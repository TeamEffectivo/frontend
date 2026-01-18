import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Try to get email from URL (?email=test@me.com) or LocalStorage
        const urlEmail = searchParams.get('email');
        const storedEmail = localStorage.getItem('palmo_pending_email');

        if (urlEmail) setEmail(urlEmail);
        else if (storedEmail) setEmail(storedEmail);
        else navigate('/login'); // If no email found, they shouldn't be here
    }, [searchParams, navigate]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.confirmRegistration(email, code);
            localStorage.removeItem('palmo_pending_email');
            alert("Success! You can now log in.");
            navigate('/login');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await authService.resendCode(email);
            alert("New code sent!");
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Verify Your Email</h2>
            <p>Enter the code sent to <strong>{email}</strong></p>

            <form onSubmit={handleVerify}>
                <input
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    type="text"
                    placeholder="6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
            </form>

            <button onClick={handleResend} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                Didn't get a code? Resend
            </button>
        </div>
    );
};