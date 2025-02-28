import './ProjectDownloadButton.css';

import React, { useEffect, useState } from 'react';
import { convertProjectDataToCSV, downloadCSV } from './projectCsvFormatter';
import useFetchProjectDownload from "../../../hooks/useFetchProjectDownload";

type DownloadProjectButtonProps = {
    projectId: number;
};

const ProjectDownloadButton: React.FC<DownloadProjectButtonProps> = ({ projectId }) => {
    const { downloadProject, loading, error, data } = useFetchProjectDownload();
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingError, setProcessingError] = useState<string | null>(null);

    const handleDownload = async () => {
        // Fetch JSON data for the given project.
        downloadProject(projectId);
    };

    useEffect(() => {
        // Only process data if it exists and is not null
        if (data) {
            setIsProcessing(true);
            setProcessingError(null);

            try {
                // Convert project data to CSV format
                const csvContent = JSON.stringify(data) // !!! convertProjectDataToCSV(data);

                // Generate filename using project name if available
                const projectName = data.result.project.name || `Project_${projectId}`;
                const sanitizedName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${sanitizedName}_${timestamp}.csv`;

                // Trigger the download
                downloadCSV(csvContent, filename);
            } catch (err) {
                console.error("Error processing data for download:", err);
                setProcessingError("Failed to process project data for download.");
            } finally {
                setIsProcessing(false);
            }
        }
    }, [data, projectId]);

    return (
        <div className="project-download-container">
            {error && <div className="project-download-error">Error: {error}</div>}
            {processingError && <div className="project-download-error">Error: {processingError}</div>}
            <button
                className="project-download-button"
                onClick={handleDownload}
                disabled={loading || isProcessing}
            >
                {loading || isProcessing ? 'Processing...' : 'Download CSV'}
            </button>
        </div>
    );
};

export default ProjectDownloadButton;
