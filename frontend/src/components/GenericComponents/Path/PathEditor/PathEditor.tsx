import '../Path.css'
import './PathEditor.css'

import {Fragment} from "react";
import ChevronRight from "../../../../assets/Icons/ChevronRight.svg";
import PathEditorProject from "./PathEditorProject.tsx";

type PathEditorProps = {
    path: [{
        id: number,
        name: string
    }]
    select: (number) => void
}

const PathEditor = (props: PathEditorProps) => {
    return (
        <div className='project-path'>
            {props.path.map((item, index) => (
                <Fragment key={index}>
                    <PathEditorProject
                        project_id={item.id}
                        project_name={item.name}
                        select={props.select}
                    />
                    {index < props.path.length - 1 &&
                        <img src={ChevronRight}/>
                    }
                </Fragment>
            ))}
        </div>
    )
}

export default PathEditor;