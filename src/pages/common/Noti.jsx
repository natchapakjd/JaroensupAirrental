import React, { useEffect, useState } from 'react';
import liff from '@line/liff';
import Loading from '../../components/Loading';

const Noti = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        login();
    }, []);

    const login = async () => {
        try {
            await liff.init({ liffId: '2005859640-eRy005zg' });
            if (!liff.isLoggedIn()) {
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

    return (
        <>
            {profile ? (
                <>
                    <img src={profile.pictureUrl} alt={profile.displayName} style={{ width: "250px" }} />
                    <div>Hello {profile.displayName}</div>
                    <div>UID: {profile.userId}</div>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <Loading/>
            )}
        </>
    );
}

export default Noti;
