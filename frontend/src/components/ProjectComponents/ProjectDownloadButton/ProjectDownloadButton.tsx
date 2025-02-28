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
        
        // // Parse the JSON.
        // const data = await response.json();
        //
        // // Convert the JSON data to a formatted CSV string.
        // const csvString = convertProjectDataToCSV(data);
        //
        // // Create a Blob from the CSV data and trigger the download.
        // const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `project_${projectId}.csv`);
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // window.URL.revokeObjectURL(url);

    };

    // useEffect that console logs the data
    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <button className="project-download-button" onClick={handleDownload}>
            Download
        </button>
    );
};

export default ProjectDownloadButton;
