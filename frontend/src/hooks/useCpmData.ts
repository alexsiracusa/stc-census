import useFetch from "./useFetch";

const setCpmData = ({ json }: { json: any[] }) => ({
    type: 'SET_CPM_DATA',
    payload: json.reduce((acc: Record<number, any>, item: any) => {
        acc[item.task_id] = item;
        return acc;
    }, {})
});

const useCpmData = (projectId: number) => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = projectId ? `${host}/project/${projectId}/cpm` : '';

    return useFetch(url, setCpmData);
};

export default useCpmData;
