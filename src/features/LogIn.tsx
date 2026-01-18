import React, { useState } from 'react';
import { authService } from '../services/authService';

// Define the steps to manage the UI flow
type AuthStep = 'LOGIN' | 'SIGNUP' | 'VERIFY';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState(''); // State for verification code
    const [step, setStep] = useState<AuthStep>('LOGIN');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (step === 'SIGNUP') {
                await authService.register(email, password);
                alert("Verification code sent to your email!");
                setStep('VERIFY'); // Move to verification step
            }
            else if (step === 'VERIFY') {
                await authService.confirmRegistration(email, code);
                alert("Account verified! You can now login.");
                setStep('LOGIN'); // Move back to login after success
            }
            else {
                // Step is LOGIN
                await authService.login(email, password);
                const token = await authService.getToken();
                console.log("Logged in! JWT Token:", token);
                // window.location.href = '/dashboard'; // Redirect logic
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem', textAlign: 'center' }}>
            <h2>
                {step === 'LOGIN' && 'Sign In'}
                {step === 'SIGNUP' && 'Create Account'}
                {step === 'VERIFY' && 'Verify Email'}
            </h2>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Email is always needed except maybe if we strictly verify, but keep for clarity */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                {/* Show password field ONLY for Login and Signup */}
                {step !== 'VERIFY' && (
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                )}

                {/* Show code field ONLY for Verification */}
                {step === 'VERIFY' && (
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        required
                    />
                )}

                <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer' }}>
                    {step === 'LOGIN' && 'Sign In'}
                    {step === 'SIGNUP' && 'Register'}
                    {step === 'VERIFY' && 'Confirm Code'}
                </button>
            </form>

            <div style={{ marginTop: '1rem' }}>
                {step === 'LOGIN' && (
                    <button onClick={() => setStep('SIGNUP')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                        Need an account? Sign Up
                    </button>
                )}
                {(step === 'SIGNUP' || step === 'VERIFY') && (
                    <button onClick={() => setStep('LOGIN')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                        Back to Login
                    </button>
                )}
            </div>
        </div>
    );
};