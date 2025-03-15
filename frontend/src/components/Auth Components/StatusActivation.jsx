import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleRight } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StatusActivation = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!email) {
            return toast.error("Please enter your email address.");
        }
        setLoading(true);
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
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            return toast.error("Please enter the OTP.");
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-status-otp`, { email, otp });
            if (data.success) {
                toast.success(data.message);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
        setLoading(false);
    };

    return (
        <div className="h-[100vh] flex justify-center items-center">
            <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex items-center justify-center mb-6">
                    <img src="../../public/images/CiviModeler - NBG.png" alt="Logo" className="size-6 mr-1" />
                    <h2 className="text-xl font-semibold"> Activate Account</h2>
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                    />
                </div>

                {otpSent && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
                        />
                    </div>
                )}

                <button
                    onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                    disabled={loading}
                    className="w-full flex flex-wrap gap-1 items-center justify-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded focus:outline-none transition-all duration-200 cursor-pointer"
                >
                    <FaArrowCircleRight />
                    {loading ? "Processing..." : (otpSent ? "Verify OTP" : "Send OTP")}
                </button>

                <p 
                    onClick={() => navigate('/login')} 
                    className="mt-4 text-left text-xs text-gray-600 cursor-pointer hover:text-purple-500"
                >
                    Back to Login
                </p>

                <p className="mt-6 text-center text-grey-500 text-xs">©2025 CiviModeler. All rights reserved.</p>
            </div>
        </div>
    );
};

export default StatusActivation;