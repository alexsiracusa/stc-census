import './DownloadProjectButton.css';

import React from 'react';
import { convertProjectDataToCSV } from './utils/csvFormatter';

type DownloadProjectButtonProps = {
    projectId: number;
};

const DownloadProjectButton: React.FC<DownloadProjectButtonProps> = ({ projectId }) => {
    const handleDownload = async () => {
        try {
            // Fetch JSON data for the given project.
            const response = await fetch(`http://localhost:8000/project/${projectId}/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Parse the JSON.
            const data = await response.json();

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
        } catch (error) {
            console.error('Error downloading the project data:', error);
        }
    };

    return (
        <button className="download-button" onClick={handleDownload}>
            Download
        </button>
    );
};

export default DownloadProjectButton;
