import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

/**
 * A generic custom hook for fetching data and dispatching Redux actions.
 *
 * @param {string} url - The API endpoint to fetch data from.
 * @param {function} actionCreator - The Redux action creator to dispatch the fetched data.
 * @param {object} [options={}] - Optional settings for the fetch request.
 *
 * @returns {object} - An object containing `loading`, `error`, and the fetched data (if needed).
 */
const useFetch = (url, actionCreator, options = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null); // Optional, to return data directly if needed
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(url, {...options, credentials: 'include'});
                const json = await response.json();
                if (!response.ok) {
                    setError(json.error || "Unable to fetch data");
                    console.error(json || "Fetch error");
                    return;
                }

                setData(json); // Store the fetched data (optional)
                if (actionCreator) {
                    dispatch(actionCreator({json})); // Dispatch the Redux action with the fetched data
                }
            } catch (error) {
                setError(error.message || "An error occurred");
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if the URL exists
        if (url) {
            fetchData();
        }
    }, [url, actionCreator, dispatch]);

    // Return loading and error states (and optionally the data if the consumer needs it)
    return { loading, error, data };
};

export default useFetch;