import './Summary.css'
import {useTranslation} from 'react-i18next';

import TabProps from "../TabProps.ts";
import ProjectName from "../../../ProjectRow/ProjectName/ProjectName.tsx";
import EVMComponent from "../EVM/EVMComponent/EVMComponent.tsx";
import CPMComponent from "../CPM/CPMComponent/CPMComponent.tsx";
import SummaryInfo from "./SummaryInfo/SummaryInfo.tsx";

const Summary = (props: TabProps) => {
    const {t} = useTranslation();

    return (
        <div className='summary-container'>
            <div className="project-name" title='Click to edit project name'>
                <ProjectName project_id={props.project_id}/>
            </div>
            {/*<div className="summary-information">*/}
            {/*    <SummaryInfo project_id={props.project_id}/>*/}
            {/*</div>*/}
            <div className="evm-summary">
                <EVMComponent project_id={props.project_id} direction='row'/>
            </div>
            <div className="cpm-summary">
                <CPMComponent project_id={props.project_id} user_interaction={false} direction='row'/>
            </div>
        </div>
    )
};

export default Summary;