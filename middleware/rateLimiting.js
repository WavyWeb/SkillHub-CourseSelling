// middleware/rateLimiting.js
const rateLimit = require('express-rate-limit');
const { createHash } = require('crypto');
const { ipKeyGenerator } = require('express-rate-limit'); // Import the official helper

// Custom key generator that correctly handles IPv6
const createKeyGenerator = (includeUser = false) => {
  return (req, res) => {
    let key = ipKeyGenerator(req, res); // Use the official helper for IP handling

    if (includeUser && req.body) {
      const userIdentifier = req.body.email || req.body.username;
      if (userIdentifier) {
        // Hash the user identifier for privacy
        const hashedUser = createHash('sha256').update(userIdentifier).digest('hex').substring(0, 16);
        key += `:${hashedUser}`;
      }
    }
    return key;
  };
};

// Custom message handler
const createRateLimitMessage = (type, maxAttempts, windowMs) => {
  const windowMinutes = Math.ceil(windowMs / (1000 * 60));
  
  return {
    error: 'Too many attempts',
    message: `Too many ${type} attempts. Maximum ${maxAttempts} attempts allowed per ${windowMinutes} minute${windowMinutes > 1 ? 's' : ''}. Please try again later.`,
    retryAfter: windowMs,
    type: 'RATE_LIMIT_EXCEEDED'
  };
};

// Custom handler for rate limit exceeded
const createRateLimitHandler = (type, maxAttempts, windowMs) => {
  return (req, res) => {
    const resetTime = new Date(Date.now() + windowMs);
    
    res.status(429).json({
      ...createRateLimitMessage(type, maxAttempts, windowMs),
      resetTime: resetTime.toISOString(),
      ip: req.ip
    });
  };
};

// Login rate limiting - 5 attempts per 15 minutes per IP+Email combination
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  keyGenerator: createKeyGenerator(true), // Include user identifier
  handler: createRateLimitHandler('login', 5, 15 * 60 * 1000),
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
});

// Registration rate limiting - 3 attempts per hour per IP
const registrationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  keyGenerator: createKeyGenerator(false), // IP only
  handler: createRateLimitHandler('registration', 3, 60 * 60 * 1000),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// Password reset rate limiting - 3 attempts per hour per IP+Email
const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  keyGenerator: createKeyGenerator(true), // Include email
  handler: createRateLimitHandler('password reset', 3, 60 * 60 * 1000),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// Email verification rate limiting - 5 attempts per hour per IP+Email
const emailVerificationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts
  keyGenerator: createKeyGenerator(true), // Include email
  handler: createRateLimitHandler('email verification', 5, 60 * 60 * 1000),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
});

// General API rate limiting - 100 requests per 15 minutes per IP
const generalApiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests
  keyGenerator: ipKeyGenerator, // Corrected to use the helper
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'API rate limit exceeded. Maximum 100 requests per 15 minutes.',
      retryAfter: 15 * 60 * 1000,
      type: 'API_RATE_LIMIT_EXCEEDED'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for sensitive operations - 10 attempts per hour per IP
const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts
  keyGenerator: createKeyGenerator(false),
  handler: createRateLimitHandler('sensitive operation', 10, 60 * 60 * 1000),
  standardHeaders: true,
  legacyHeaders: false,
});

// Progressive rate limiting - increases restriction after multiple violations
const createProgressiveRateLimit = (baseWindowMs, baseMax) => {
  const violations = new Map();
  
  return rateLimit({
    windowMs: baseWindowMs,
    max: (req, res) => { // keyGenerator and handler functions get both req and res
      const key = ipKeyGenerator(req, res);
      const violationCount = violations.get(key) || 0;
      
      const adjustedMax = Math.max(1, baseMax - Math.floor(violationCount / 2));
      return adjustedMax;
    },
    keyGenerator: createKeyGenerator(true),
    handler: (req, res) => {
      const key = ipKeyGenerator(req, res);
      const currentViolations = violations.get(key) || 0;
      violations.set(key, currentViolations + 1);
      
      setTimeout(() => {
        violations.delete(key);
      }, 24 * 60 * 60 * 1000);
      
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Multiple violations detected. Rate limits have been tightened for your IP.',
        violationCount: currentViolations + 1,
        type: 'PROGRESSIVE_RATE_LIMIT_EXCEEDED'
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const progressiveLoginRateLimit = createProgressiveRateLimit(15 * 60 * 1000, 5);

module.exports = {
  loginRateLimit,
  registrationRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  generalApiRateLimit,
  strictRateLimit,
  progressiveLoginRateLimit,
  createRateLimitMessage,
  createKeyGenerator
};