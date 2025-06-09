import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUserCircle, FaEdit, FaUserAlt } from "react-icons/fa";
import { MdEmail, MdPhone, MdSave } from "react-icons/md";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
    const user = useSelector(state => state.user);
    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
    const [userData, setUserData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || ''
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        });
    }, [user]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            });
            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                const userData = await fetchUserDetails();
                dispatch(setUserDetails(userData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
                {/* Profile Avatar Section */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg flex items-center justify-center bg-gray-50">
                        {user.avatar ? (
                            <img 
                                alt={user.name}
                                src={user.avatar}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FaUserAlt size={65} className="text-gray-400" />
                        )}
                    </div>
                    <button
                        onClick={() => setProfileAvatarEdit(true)}
                        className="mt-4 flex items-center gap-2 bg-primary-100 hover:bg-primary-200 text-gray-800 font-medium px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        <FaEdit /> Edit Photo
                    </button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserAlt className="text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
                                        value={userData.name}
                                        name="name"
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdEmail className="text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
                                        value={userData.email}
                                        name="email"
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="mobile" className="text-sm font-medium text-gray-700 block">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdPhone className="text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        id="mobile"
                                        placeholder="Enter your mobile"
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-transparent"
                                        value={userData.mobile}
                                        name="mobile"
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-200 hover:bg-primary-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <MdSave />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {openProfileAvatarEdit && (
                <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
            )}
        </div>
    );
};

export default Profile;