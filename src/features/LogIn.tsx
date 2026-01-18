import React, { useState } from 'react';
import { authService } from '../services/authService';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                await authService.register(email, password);
                alert("Check your email for a verification code!");
            } else {
                await authService.login(email, password);
                const token = await authService.getToken();
                console.log("Logged in! JWT Token:", token);
                // Redirect to your app here
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
            <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
            <form onSubmit={handleAuth}>
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                <button type="submit">{isRegistering ? 'Sign Up' : 'Sign In'}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                Switch to {isRegistering ? 'Login' : 'Sign Up'}
            </button>
        </div>
    );
};