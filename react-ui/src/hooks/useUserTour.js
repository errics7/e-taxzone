import { useCallback, useState } from 'react';
import axios from 'axios';
import API from '../utils/host.config';

const useUserTour = () => {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(null);
    const [error, setError] = useState(null);

    // Mark a tour as completed in the backend
    const markCompletedTour = useCallback(async (tourKey) => {
        if (!tourKey) return false;
        
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('xtoken');
            if (!token) {
                setError('No authentication token found');
                return false;
            }
            
            const res = await axios.post(
                `${API.HOST}/api/v2/user-tour`,
                { tour_key: tourKey },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            const success = res.data?.success === true;
            setCompleted(success);
            return success;
        } catch (err) {
            console.error('Error marking tour as completed:', err);
            setError(err.response?.data?.message || 'Failed to mark tour as completed');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Check if a tour has been completed
    const checkUserTour = useCallback(async (tourKey) => {
        if (!tourKey) return false;
        
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('xtoken');
            if (!token) {
                setError('No authentication token found');
                return false;
            }
            
            const res = await axios.get(
                `${API.HOST}/api/v2/user-tour/${tourKey}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            // Handle different API response formats
            let isCompleted = false;
            
            if (res.data && typeof res.data.completed !== 'undefined') {
                isCompleted = Boolean(res.data.completed);
            } else if (res.data && typeof res.data.success !== 'undefined') {
                isCompleted = Boolean(res.data.success);
            }
            
            setCompleted(isCompleted);
            return isCompleted;
        } catch (err) {
            // For 404 or other errors, assume tour not completed
            console.warn('Tour check warning:', err.message);
            setCompleted(false);
            
            // Only set error for unexpected errors, not 404s
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || 'Failed to check tour status');
            }
            
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        loading, 
        completed, 
        error, 
        markCompletedTour, 
        checkUserTour 
    };
};

export default useUserTour;