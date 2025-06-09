import React from 'react';
import { useForm } from "react-hook-form";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose, IoLocationOutline, IoHome, IoBusinessOutline, IoMailOutline, IoCallOutline, IoEarthOutline, IoPencilOutline } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider';

const EditAddressDetails = ({ close, data }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            _id: data._id,
            userId: data.userId,
            address_line: data.address_line,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            mobile: data.mobile 
        }
    });
    
    const { fetchAddress } = useGlobalContext();
    
    const onSubmit = async(formData) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateAddress,
                data: {
                    ...formData,
                    address_line: formData.address_line,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    pincode: formData.pincode,
                    mobile: formData.mobile
                }
            });
            const { data: responseData } = response;
            
            if(responseData.success) {
                toast.success(responseData.message);
                if(close) {
                    close();
                    reset();
                    fetchAddress();
                }
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-green-50 to-green-100">
                    <div className="flex items-center space-x-2">
                        <IoPencilOutline className="text-green-700 text-xl" />
                        <h2 className="text-xl font-semibold text-gray-800">Edit Address</h2>
                    </div>
                    <button 
                        onClick={close} 
                        className="text-gray-500 hover:text-red-500 transition-colors rounded-full p-1 hover:bg-red-50"
                    >
                        <IoClose size={24} />
                    </button>
                </div>
                
                {/* Form */}
                <form className="p-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Address Line */}
                    <div className="space-y-1">
                        <label htmlFor="address_line" className="text-sm font-medium text-gray-700 flex items-center">
                            <IoHome className="mr-2 text-green-600" />
                            Address Line
                        </label>
                        <input
                            type="text"
                            id="address_line"
                            className="w-full px-4 py-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            {...register("address_line", { 
                                required: "Address is required" 
                            })}
                        />
                        {errors.address_line && (
                            <p className="text-red-500 text-xs mt-1">{errors.address_line.message}</p>
                        )}
                    </div>
                    
                    {/* City & State in a grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center">
                                <IoBusinessOutline className="mr-2 text-green-600" />
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                className="w-full px-4 py-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                {...register("city", { 
                                    required: "City is required" 
                                })}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <label htmlFor="state" className="text-sm font-medium text-gray-700 flex items-center">
                                <IoEarthOutline className="mr-2 text-green-600" />
                                State
                            </label>
                            <input
                                type="text"
                                id="state"
                                className="w-full px-4 py-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                {...register("state", { 
                                    required: "State is required" 
                                })}
                            />
                            {errors.state && (
                                <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Pincode & Country in a grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label htmlFor="pincode" className="text-sm font-medium text-gray-700 flex items-center">
                                <IoMailOutline className="mr-2 text-green-600" />
                                Pincode
                            </label>
                            <input
                                type="text"
                                id="pincode"
                                className="w-full px-4 py-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                {...register("pincode", { 
                                    required: "Pincode is required",
                                    pattern: {
                                        value: /^\d+$/,
                                        message: "Please enter a valid pincode"
                                    }
                                })}
                            />
                            {errors.pincode && (
                                <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <label htmlFor="country" className="text-sm font-medium text-gray-700 flex items-center">
                                <IoEarthOutline className="mr-2 text-green-600" />
                                Country
                            </label>
                            <input
                                type="text"
                                id="country"
                                className="w-full px-4 py-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                {...register("country", { 
                                    required: "Country is required" 
                                })}
                            />
                            {errors.country && (
                                <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Mobile */}
                    <div className="space-y-1">
                        <label htmlFor="mobile" className="text-sm font-medium text-gray-700 flex items-center">
                            <IoCallOutline className="mr-2 text-green-600" />
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            id="mobile"
                            className="w-full px-4 py-3 border bg-gray-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            {...register("mobile", { 
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Please enter a valid 10-digit mobile number"
                                }
                            })}
                        />
                        {errors.mobile && (
                            <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                        )}
                    </div>
                    
                    {/* Buttons */}
                    <div className="pt-3 flex gap-3">
                        <button
                            type="button"
                            onClick={close}
                            className="flex-1 py-3 px-4 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition ${
                                isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-700 hover:bg-green-800 shadow hover:shadow-md'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : 'Update Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAddressDetails;