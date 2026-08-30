import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Phone, Mail, ShieldCheck, ArrowRight, RefreshCw, KeyRound, Sparkles, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerAuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    loginAsCustomer,
    lastSentOtp,
    generateAndSendOtp,
    verifyOtp,
    showToast,
  } = useStore();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCodePreview, setActiveCodePreview] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  useEffect(() => {
    if (!authModalOpen) {
      setStep('input');
      setOtpDigits(['', '', '', '', '', '']);
      setResendTimer(30);
    }
  }, [authModalOpen]);

  const targetIdentifier = authMethod === 'phone' ? (phoneNumber.startsWith('+91') ? phoneNumber : `+91 ${phoneNumber}`) : emailAddress;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'phone') {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        showToast('Invalid Phone', 'Please enter a valid 10-digit mobile number', 'error');
        return;
      }
    } else {
      if (!emailAddress.includes('@') || !emailAddress.includes('.')) {
        showToast('Invalid Email', 'Please enter a valid email address', 'error');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      const code = generateAndSendOtp(targetIdentifier);
      setActiveCodePreview(code);
      setIsLoading(false);
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length !== 6) {
      showToast('Incomplete Code', 'Please enter all 6 digits of the OTP', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const isValid = verifyOtp(targetIdentifier, enteredCode);
      setIsLoading(false);
      if (isValid) {
        loginAsCustomer(targetIdentifier, customerName);
      } else {
        showToast('Incorrect OTP', 'The code you entered is invalid. Please try again or use 123456', 'error');
      }
    }, 600);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    const code = generateAndSendOtp(targetIdentifier);
    setActiveCodePreview(code);
    setResendTimer(30);
    setOtpDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  if (!authModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#FFF8E8] dark:bg-zinc-900 border border-[#D4A017]/30 rounded-2xl shadow-2xl overflow-hidden text-zinc-900 dark:text-zinc-100"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#1B5E20] p-6 text-white text-center relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border-2 border-[#D4A017] mb-3 shadow-md backdrop-blur-md">
              <img
                src="/LOGO.png"
                alt="Sajjan Enne Gana"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <h3 className="text-xl font-bold font-['Poppins'] tracking-tight">Sajjan Enne Gana</h3>
            <p className="text-xs text-amber-200/90 mt-1">100% Cold Pressed Wooden Ghani Edible Oils</p>
          </div>

          <div className="p-6">
            {step === 'input' ? (
              <div>
                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-[#1B5E20] dark:text-[#81C784]">Customer Login</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    Enter your phone or email to receive a secure 6-digit OTP
                  </p>
                </div>

                {/* Login Method Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-200/60 dark:bg-zinc-800 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                      authMethod === 'phone'
                        ? 'bg-[#1B5E20] text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Phone Number
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                      authMethod === 'email'
                        ? 'bg-[#1B5E20] text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email Address
                  </button>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#D4A017]"
                    />
                  </div>

                  {authMethod === 'phone' ? (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-700 focus-within:ring-2 focus-within:ring-[#1B5E20] dark:focus-within:ring-[#D4A017]">
                        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3.5 py-2.5 text-sm font-medium border-r border-zinc-300 dark:border-zinc-700 flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="82178 46338"
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800 text-sm focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">We will send a 6-digit SMS OTP</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#D4A017]"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">We will send a 6-digit Email code</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick 1-Click Demo Login */}
                <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
                  <p className="text-xs text-zinc-500 mb-2">Want a quick preview?</p>
                  <button
                    type="button"
                    onClick={() => loginAsCustomer('+91 82178 46338', 'Guest Customer')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B5E20] dark:text-[#D4A017] hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant Guest Login & Open Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-5">
                  <div className="inline-flex p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[#1B5E20] dark:text-emerald-400 mb-2">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Verify 6-Digit OTP</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    Sent to <span className="font-semibold text-zinc-900 dark:text-zinc-100">{targetIdentifier}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-xs text-[#1B5E20] dark:text-[#D4A017] hover:underline mt-0.5"
                  >
                    Change {authMethod === 'phone' ? 'phone' : 'email'}
                  </button>
                </div>

                {/* Demo OTP Helper pill */}
                {activeCodePreview && (
                  <div className="mb-4 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 rounded-xl text-center">
                    <p className="text-xs text-amber-900 dark:text-amber-200">
                      ⚡ Demo OTP: <strong className="font-mono text-sm tracking-widest text-[#1B5E20] dark:text-[#D4A017]">{activeCodePreview}</strong> (or enter <strong>123456</strong>)
                    </p>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  {/* 6 Digit Input Boxes */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (inputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        onPaste={handlePaste}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#D4A017] focus:border-transparent shadow-sm transition-all"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      {resendTimer > 0 ? (
                        <>Resend OTP in <strong className="text-zinc-700 dark:text-zinc-300">{resendTimer}s</strong></>
                      ) : (
                        'Didn’t get the code?'
                      )}
                    </span>
                    <button
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={handleResend}
                      className="font-semibold text-[#1B5E20] dark:text-[#D4A017] hover:underline disabled:opacity-40 disabled:no-underline"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[#1B5E20] hover:bg-[#154a19] text-white font-semibold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Verify & Open Product Dashboard</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
