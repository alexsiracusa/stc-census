import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

/**
 * A generic custom hook for updating data and dispatching Redux actions.
 *
 * @returns {function} - A function to perform the update operation.
 * @returns {object} - An object containing `loading`, `error`, and the updated data (if needed).
 */
const useUpdate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();

    // Create the update function
    const updateData = useCallback(async (url, update, options) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, options);
            const json = await response.json();
            if (!response.ok) {
                setError(json.error || "Unable to update data");
                console.error(json.error || "Update error");
                return;
            }

            setData(json);
            if (update) {
                dispatch(update(json));
            }
        } catch (error) {
            setError(error.message || "An error occurred");
            console.error("Failed to update data:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    return { updateData, loading, error, data };
};

export default useUpdate;