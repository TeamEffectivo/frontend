import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from "react-router-dom";

// Define the steps to manage the UI flow
type AuthStep = 'LOGIN' | 'SIGNUP' | 'VERIFY';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(''); // State for verification code
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(""); // clear previous errors
    setSuccessMsg(""); // clear previous success messages

    try {
      if (step === 'SIGNUP') {
        if (!email || !password) {
          setErrorMsg("Please enter both email and password.");
          return;
        }
        setLoading(true);
        await authService.register(email, password);
        setErrorMsg(""); 

        setStep('VERIFY'); // Move to verification step
      }
      else if (step === 'VERIFY') {
        if (!email || !code) {
          setErrorMsg("Please enter both email and verification code.");
          return;
        }
        setLoading(true);
        await authService.confirmRegistration(email, code);
        localStorage.removeItem('palmo_pending_email');
        setErrorMsg(""); // Clear any previous errors
        setSuccessMsg("Email successfully verified. Please sign in below."); // Set success message
        setStep('LOGIN'); // Move back to login after success
      }
      else {
        // Step is LOGIN
        if (!email || !password) {
          setErrorMsg("Please enter both email and password.");
          return;
        }
        setLoading(true);
        await authService.login(email, password);
        const token = await authService.getToken();
        console.log("Logged in! JWT Token:", token);
        if (token) {
          localStorage.setItem("idToken", token);
          navigate("/map"); // redirect to dashboard
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-800 mb-2">
            {step === 'LOGIN' && 'Sign In'}
            {step === 'SIGNUP' && 'Sign Up'}
            {step === 'VERIFY' && 'Verify Email'}
          </h1>
          {step === 'VERIFY' && (
            <p className="text-slate-600 text-lg mt-2">
              Please check your email for the verification code.
            </p>
          )}

        </div>

        {/* Form Card */}
        <form
          onSubmit={handleAuth}
          className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-lg flex flex-col gap-6"
        >
          {errorMsg && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && step === 'LOGIN' && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-2xl font-medium">
              {successMsg}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none text-slate-800 bg-white transition-colors"
                required
              />
            </div>

            {/* Show password field ONLY for Login and Signup */}
            {step !== 'VERIFY' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none text-slate-800 bg-white transition-colors"
                  required
                />
              </div>
            )}

            {/* Show code field ONLY for Verification */}
            {step === 'VERIFY' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="Enter your verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none text-slate-800 bg-white transition-colors"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading 
              ? 'Processing...' 
              : step === 'LOGIN' 
                ? 'Sign In' 
                : step === 'SIGNUP' 
                  ? 'Register' 
                  : 'Confirm Code'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or</span>
            </div>
          </div>

          {step === 'LOGIN' && (
            <p className="text-center text-slate-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setStep('SIGNUP');
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-blue-500 hover:text-blue-600 font-bold transition-colors"
              >
                Sign Up
              </button>
            </p>
          )}
            
          {(step === 'SIGNUP' || step === 'VERIFY') && (
            <p className="text-center text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setStep('LOGIN');
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-blue-500 hover:text-blue-600 font-bold transition-colors"
              >
                Sign In
              </button>
          
            </p>
          )}
        </form>

    
      </div>
    </div>
  );
}
