import './ProjectDownloadButton.css';

import React, {useEffect, useState} from 'react';
import {convertProjectDataToCSV, downloadCSV} from './projectCsvFormatter';
import useFetchProjectDownload from "../../../hooks/useFetchProjectDownload";

type DownloadProjectButtonProps = {
    projectId: number;
};

const ProjectDownloadButton: React.FC<DownloadProjectButtonProps> = ({projectId}) => {
    const {downloadProject, loading, error, data} = useFetchProjectDownload();
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingError, setProcessingError] = useState<string | null>(null);

    const handleDownload = async () => {
        // Fetch JSON data for the given project.
        downloadProject(projectId);
    };

    // Log errors to the console whenever they change
    useEffect(() => {
        if (error) {
            console.error("Fetch error:", error);
        }
        if (processingError) {
            console.error("Processing error:", processingError);
        }
    }, [error, processingError]);

    useEffect(() => {
        // Only process data if it exists and is not null
        if (data) {
            setIsProcessing(true);
            setProcessingError(null);

            try {
                // Convert project data to CSV format
                const csvContent = convertProjectDataToCSV(data);

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
        <button
            className={`project-download-button ${error || processingError ? 'error-state' : ''}`}
            onClick={handleDownload}
            disabled={loading || isProcessing}
        >
            {loading || isProcessing ? 'Processing...' : 'Download'}
        </button>
    );
};

export default ProjectDownloadButton;
