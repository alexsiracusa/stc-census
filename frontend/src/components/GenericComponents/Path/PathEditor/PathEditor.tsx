import '../Path.css'

import {Fragment} from "react";
import ChevronRight from "../../../../assets/Icons/ChevronRight.svg";
import DropdownRowPicker from "../../Dropdowns/DropdownRowPicker/DropdownRowPicker.tsx";
import DropdownPickerOption from "../../Dropdowns/DropdownPicker/DropdownPickerOption.tsx";

type PathEditorProps = {
    path: [{
        id: string,
        name: string
    }]
}

const PathEditor = (props: PathEditorProps) => {
    return (
        <div className='project-path'>
            {props.path.map((item, index) => (
                <Fragment key={index}>
                    <DropdownRowPicker
                        icon={(
                            <p>{item.name}</p>
                        )}
                        className='link'
                        title=''
                        onChange={(value) => {

                        }}
                    >
                        <DropdownPickerOption value='project' className=''>
                            Project 1
                        </DropdownPickerOption>
                        <DropdownPickerOption value='project' className=''>
                            Project 2
                        </DropdownPickerOption>
                    </DropdownRowPicker>

                    {index < props.path.length - 1 &&
                        <img src={ChevronRight}/>
                    }
                </Fragment>
            ))}
        </div>
    )
}

export default PathEditor;