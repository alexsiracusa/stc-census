import './Project.css'
import '../../styles/Gutters.css'

import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";

const ProjectPage = () => {
    return (
        <div className='project-page'>
            <PanelGroup
                className="code-content"
                direction="horizontal"
            >
                <Panel defaultSize={18}>
                    <Sidebar/>
                </Panel>

                <PanelResizeHandle className={"gutter gutter-horizontal"}/>

                <Panel>
                    <div>Right Side</div>
                </Panel>
            </PanelGroup>
        </div>
    )
};

export default ProjectPage;