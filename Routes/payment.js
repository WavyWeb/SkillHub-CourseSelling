const { Router } = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = Router();

// initialize razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// create order route
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // amount should be in paise from frontend

    //USD -> INR
    const conversionRate = 87;
    const inrAmount = Math.round(amount * conversionRate);
    // ✅ Validate Razorpay limits
    if (inrAmount < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least ₹1",
      });
    }

    if (inrAmount > 50000000) {
      // 5,00,000 INR in paise
      return res.status(400).json({
        success: false,
        message: "Course price exceeds Razorpay maximum limit of ₹5,00,000",
      });
    }

    const options = {
      amount: inrAmount, // amount already in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // send key to frontend dynamically
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// verify payment route
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
