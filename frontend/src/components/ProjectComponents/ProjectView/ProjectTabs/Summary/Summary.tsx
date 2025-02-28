import './Summary.css'
import {useTranslation} from 'react-i18next';

import TabProps from "../TabProps.ts";
import ProjectName from "../../../ProjectRow/ProjectName/ProjectName.tsx";
import EVMComponent from "../EVM/EVMComponent/EVMComponent.tsx";

const Summary = (props: TabProps) => {
    const {t} = useTranslation();

    return (
        <div className='summary-container'>
            <div>
                <ProjectName project_id={props.project_id}/>
            </div>
            <div className="evm-summary">
                <EVMComponent project_id={props.project_id} direction='row'/>
            </div>
        </div>
    )
};

export default Summary;