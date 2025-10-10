import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Shield } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const { sendOTP, login, isLoading } = useAuthStore();
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      await sendOTP(email);
      setStep('otp');
      toast({
        title: 'OTP sent',
        description: 'Check your email for the verification code',
      });
    } catch (error) {
      toast({
        title: 'Failed to send OTP',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast({
        title: 'OTP required',
        description: 'Please enter the verification code',
        variant: 'destructive',
      });
      return;
    }

    try {
      await login(email, otp);
      onOpenChange(false);
      setStep('email');
      setEmail('');
      setOtp('');
      toast({
        title: 'Login successful',
        description: 'Welcome to SkillHub!',
      });
    } catch (error) {
      toast({
        title: 'Invalid OTP',
        description: 'Please check your code and try again',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setStep('email');
    setOtp('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Join SkillHub
          </DialogTitle>
          <DialogDescription>
            {step === 'email' 
              ? 'Enter your email to get started with learning'
              : 'Enter the verification code sent to your email'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'email' ? (
            <div key="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSendOTP} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Verification Code
              </Button>
            </div>
          ) : (
            <div key="otp" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-wider"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
