import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/accounts/accountsReducer.js'; // import actions from the accountSlice
import { useState, useEffect } from 'react';

const useFetchUser = (userId) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return; // Don't fetch if no userId is provided

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                dispatch(setUser(userData)); // Update Redux state with the fetched user using setUser
            } catch (err) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, dispatch]);

    return { loading, error }; // We return `loading` and `error` to let the consuming component manage UI states
};

export default useFetchUser;
