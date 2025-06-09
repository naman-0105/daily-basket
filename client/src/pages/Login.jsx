import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye, FaEnvelope, FaLock } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        try {
            setIsLoading(true);
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            });
            
            if(response.data.success) {
                const {accesstoken, refreshToken} = response.data.data;
                localStorage.setItem('accesstoken', accesstoken);
                localStorage.setItem('refreshToken', refreshToken);
                
                const userDetails = await fetchUserDetails();
                if(userDetails?.data) {
                    dispatch(setUserDetails(userDetails.data));
                    toast.success('Login successful!');
                    navigate("/");
                }
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
                        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                        <p className="text-green-100 mt-2">Sign in to your account</p>
                    </div>
                    
                    <div className="p-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                <div className="flex justify-between">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Password</label>
                                </div>
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
                                <Link to="/forgot-password" className="text-sm text-right block text-green-700 hover:text-green-800 font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            
                            <button 
                                disabled={!isFormValid || isLoading} 
                                className={`w-full px-4 py-3 rounded-lg font-medium text-white transition-all ${
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
                                        Signing in...
                                    </span>
                                ) : "Sign In"}
                            </button>
                        </form>
                        
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account? 
                                <Link to="/register" className="ml-1 font-semibold text-green-700 hover:text-green-800 hover:underline">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;