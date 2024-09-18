import React, { useEffect, useState } from 'react';
import liff from '@line/liff';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Settings = () => {
    const [profile, setProfile] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        login();
    }, []);

    const login = async () => {
        try {
            await liff.init({ liffId: '2005859640-eRy005zg' });
            if (!liff.isLoggedIn() && notificationsEnabled) {
                liff.login();
            } else {
                const userProfile = await liff.getProfile();
                setProfile(userProfile);
                console.log(userProfile);
            }
        } catch (error) {
            console.error('LIFF initialization failed: ', error);
        }
    };

    const logout = async () => {
        await liff.logout();
        setProfile(null);
    };

    const toggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-6">
                {profile ? (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <img 
                            src={profile.pictureUrl} 
                            alt={profile.displayName} 
                            className="w-40 rounded-full mx-auto mb-4" 
                        />
                        <h2 className="text-xl font-bold text-center mb-2">Hello, {profile.displayName}</h2>
                        <div className="text-center mb-4">UID: {profile.userId}</div>

                        <div className="mt-6 flex justify-between">
                            <h3 className="text-lg font-semibold mt-6">LINE Notification Settings</h3>
                            <div className="flex items-center justify-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={notificationsEnabled}
                                    onChange={toggleNotifications}
                                    className="toggle toggle-primary mr-2"
                                />
                                <label className="label">{notificationsEnabled ? 'Notifications Enabled' : 'Notifications Disabled'}</label>
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button 
                                onClick={logout} 
                                className="btn btn-danger"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">Loading...</div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Settings;
