import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose, IoHomeOutline, IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { HiOutlineBuildingOffice2, HiOutlineGlobeAlt } from "react-icons/hi2";
import { useGlobalContext } from '../provider/GlobalProvider';

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        mode: 'onChange'
    });
    const { fetchAddress } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async(data) => {
        try {
            setIsLoading(true);
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-auto'>
            <div className='bg-white w-full max-w-lg rounded-xl shadow-2xl'>
                <div className='p-6 border-b border-gray-100'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-xl font-bold text-gray-800'>Add New Address</h2>
                        <button 
                            onClick={close}
                            className='text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100'
                        >
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>
                
                <form className='p-6 space-y-5' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor='addressline' className='block text-sm font-medium text-gray-700 mb-1'>
                            Address Line
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <IoHomeOutline className='h-5 w-5 text-gray-400' />
                            </div>
                            <input
                                type='text'
                                id='addressline'
                                placeholder='House No, Street Name, Area'
                                className={`pl-10 w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                    errors.addressline ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200 focus:border-green-400'
                                }`}
                                {...register("addressline", {
                                    required: "Address is required"
                                })}
                            />
                        </div>
                        {errors.addressline && (
                            <p className='mt-1 text-sm text-red-500'>{errors.addressline.message}</p>
                        )}
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div>
                            <label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-1'>
                                City
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <HiOutlineBuildingOffice2 className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type='text'
                                    id='city'
                                    placeholder='Your City'
                                    className={`pl-10 w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.city ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200 focus:border-green-400'
                                    }`}
                                    {...register("city", {
                                        required: "City is required"
                                    })}
                                />
                            </div>
                            {errors.city && (
                                <p className='mt-1 text-sm text-red-500'>{errors.city.message}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor='state' className='block text-sm font-medium text-gray-700 mb-1'>
                                State
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <IoLocationOutline className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type='text'
                                    id='state'
                                    placeholder='Your State'
                                    className={`pl-10 w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.state ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200 focus:border-green-400'
                                    }`}
                                    {...register("state", {
                                        required: "State is required"
                                    })}
                                />
                            </div>
                            {errors.state && (
                                <p className='mt-1 text-sm text-red-500'>{errors.state.message}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div>
                            <label htmlFor='pincode' className='block text-sm font-medium text-gray-700 mb-1'>
                                Pincode
                            </label>
                            <input
                                type='text'
                                id='pincode'
                                placeholder='6-digit Pincode'
                                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                    errors.pincode ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200 focus:border-green-400'
                                }`}
                                {...register("pincode", {
                                    required: "Pincode is required",
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: "Please enter a valid 6-digit pincode"
                                    }
                                })}
                            />
                            {errors.pincode && (
                                <p className='mt-1 text-sm text-red-500'>{errors.pincode.message}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor='country' className='block text-sm font-medium text-gray-700 mb-1'>
                                Country
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <HiOutlineGlobeAlt className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type='text'
                                    id='country'
                                    placeholder='Your Country'
                                    className={`pl-10 w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.country ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200 focus:border-green-400'
                                    }`}
                                    {...register("country", {
                                        required: "Country is required"
                                    })}
                                />
                            </div>
                            {errors.country && (
                                <p className='mt-1 text-sm text-red-500'>{errors.country.message}</p>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor='mobile' className='block text-sm font-medium text-gray-700 mb-1'>
                            Mobile Number
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <IoCallOutline className='h-5 w-5 text-gray-400' />
                            </div>
                            <input
                                type='text'
                                id='mobile'
                                placeholder='Your Mobile Number'
                                className={`pl-10 w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                    errors.mobile ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200 focus:border-green-400'
                                }`}
                                {...register("mobile", {
                                    required: "Mobile number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Please enter a valid 10-digit mobile number"
                                    }
                                })}
                            />
                        </div>
                        {errors.mobile && (
                            <p className='mt-1 text-sm text-red-500'>{errors.mobile.message}</p>
                        )}
                    </div>
                    
                    <div className='pt-4'>
                        <button 
                            type='submit' 
                            disabled={!isValid || isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                                isValid && !isLoading 
                                    ? 'bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving Address...
                                </span>
                            ) : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddress;