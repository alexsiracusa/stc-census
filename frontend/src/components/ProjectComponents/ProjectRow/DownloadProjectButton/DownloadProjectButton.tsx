import React from 'react';

type DownloadProjectButtonProps = {
    projectId: number;
};

const DownloadProjectButton: React.FC<DownloadProjectButtonProps> = ({ projectId }) => {
    const handleDownload = async () => {
        try {
            // Fetch CSV data from the endpoint (customized with the projectId)
            const response = await fetch(`http://localhost:8000/project/${projectId}/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Get CSV as text and create a Blob object
            const csvData = await response.text();
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link to trigger the download
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
