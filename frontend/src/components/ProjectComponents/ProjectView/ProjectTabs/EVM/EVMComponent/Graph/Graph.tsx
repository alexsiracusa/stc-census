import './Graph.css'

import React from 'react';
import { Line } from 'react-chartjs-2';

interface GraphProps {
    data: any;
    options: any;
}

const Graph: React.FC<GraphProps> = ({ data, options }) => {
    return (
        <div className="evm-graph-container">
            <Line data={data} options={options} />
        </div>
    );
};

export default Graph;
