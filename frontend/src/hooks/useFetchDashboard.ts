import {useDispatch} from "react-redux";
const host = import.meta.env.VITE_BACKEND_HOST;
import {useEffect, useState} from "react";
import {addProjects} from "../redux/features/tasks/projectDashboardReducer.js";

const useFetchDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${host}/projects/`);
                const json = await response.json()
                if (!response.ok) {
                    setError(json['error']);
                    console.error(json['error']);
                    return;
                }
                dispatch(addProjects({ projects: json }));
            } catch (error) {
                setError(error);
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [dispatch]);

    return { loading, error };
};

export default useFetchDashboard;