import './ProjectDownloadButton.css';

import React, {useEffect} from 'react';
import { convertProjectDataToCSV } from './projectCsvFormatter.ts';
import useFetchProjectDownload from "../../../hooks/useFetchProjectDownload.ts";

type DownloadProjectButtonProps = {
    projectId: number;
};

const ProjectDownloadButton: React.FC<DownloadProjectButtonProps> = ({ projectId }) => {

    const {downloadProject, loading, error, data} = useFetchProjectDownload();

    const handleDownload = async () => {

        // Fetch JSON data for the given project.
        downloadProject(projectId);
    };


    useEffect(() => {
        // Convert the JSON data to a formatted CSV string.
        const csvString = convertProjectDataToCSV(data);

        // Create a Blob from the CSV data and trigger the download.
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `project_${projectId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, [data]);

    return (
        <div className="project-download-container">
            {error && <div className="project-download-error">Error: {error}</div>}
            <button
                className="project-download-button"
                onClick={handleDownload}
                disabled={loading}
            >
                {loading ? 'Downloading...' : 'Download'}
            </button>
        </div>
    );
};

export default ProjectDownloadButton;
