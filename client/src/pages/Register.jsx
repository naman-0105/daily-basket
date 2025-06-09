import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye, FaEnvelope, FaLock, FaUser } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const isFormValid = Object.values(data).every(el => el);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must match");
            return;
        }

        try {
            setIsLoading(true);
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            });
            
            if(response.data.error) {
                toast.error(response.data.message);
            }
            
            if(response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
                navigate("/login");
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-center">
                        <h2 className="text-3xl font-bold text-white">Create Account</h2>
                        <p className="text-green-100 mt-2">Join daily-basket today</p>
                    </div>
                    
                    <div className="p-8">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 block">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        autoFocus
                                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                        name="password"
                                        value={data.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                    />
                                    <div 
                                        onClick={() => setShowPassword(prev => !prev)} 
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <FaRegEye className="h-5 w-5" /> : <FaRegEyeSlash className="h-5 w-5" />}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                        name="confirmPassword"
                                        value={data.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                    />
                                    <div 
                                        onClick={() => setShowConfirmPassword(prev => !prev)} 
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <FaRegEye className="h-5 w-5" /> : <FaRegEyeSlash className="h-5 w-5" />}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Password must match the one entered above
                                </div>
                            </div>
                            
                            <button 
                                disabled={!isFormValid || isLoading} 
                                className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-all mt-6 ${
                                    isFormValid && !isLoading 
                                        ? "bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : "Create Account"}
                            </button>
                        </form>
                        
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account? 
                                <Link to="/login" className="ml-1 font-semibold text-green-700 hover:text-green-800 hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;