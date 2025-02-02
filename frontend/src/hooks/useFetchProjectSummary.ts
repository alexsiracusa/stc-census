import {useDispatch} from "react-redux";
const host = import.meta.env.VITE_BACKEND_HOST;
import {useEffect, useState} from "react";
import {addProjectSummary} from "../redux/features/tasks/projectSummaryReducer.js";

const useFetchProjectSummary = (project_id) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${host}/project/${project_id}/summary`);
                const json = await response.json()
                if (!response.ok) {
                    setError(json['error']);
                    console.error(json['error']);
                    return;
                }
                dispatch(addProjectSummary({ project: json }));
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

export default useFetchProjectSummary;