import {useDispatch} from "react-redux";
const host = import.meta.env.VITE_BACKEND_HOST;
import {addProject} from "../redux/features/tasks/projectsReducer.js";
import {useEffect, useState} from "react";

const useFetchProject = (project_id) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${host}/project/${project_id}`);
                const json = await response.json();
                if (!response.ok) {
                    setError(json['error']);
                    console.error(json['error']);
                    return;
                }
                dispatch(addProject({ project: json }));
            } catch (error) {
                setError(error);
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };

        if (project_id && host) {
            fetchProject();
        }
    }, [project_id, host, dispatch]);

    return { loading, error };
};

export default useFetchProject;