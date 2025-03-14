import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StatusActivation = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-status-otp`, { email });
            if (data.success) {
                toast.success(data.message);
                setOtpSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-status-otp`, { email, otp });
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Activate Account Status</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                {otpSent && (
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                )}
                <button
                    onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    {otpSent ? 'Verify OTP' : 'Send OTP'}
                </button>
            </div>
        </div>
    );
};

export default StatusActivation;