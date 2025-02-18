import './ProjectRow.css'

import {SortOptions} from "../../../utils/sort.ts";
import {Project} from "../../../types/Project.ts";

type ProjectRowHeaderProps = {
    projectSortOptions: SortOptions<Project>,
    setProjectSortOptions: (options: SortOptions<Project>) => void
}

import TriangleDown from '../../../assets/Icons/TriangleDown.svg'
import TriangleUp from '../../../assets/Icons/TriangleUp.svg'
import {useTranslation} from "react-i18next";

const ProjectRowHeader = (props: ProjectRowHeaderProps) => {
    const {t} = useTranslation();

    const columns = [
        {
            displayName: t('projectList.columns.id'),
            columnName: 'id',
            className: 'project-id-header',
            disabled: false,
        },
        {
            displayName: t('projectList.columns.name'),
            columnName: 'name',
            className: 'project-name-header',
            disabled: false,
        },
        {
            displayName: t('projectList.columns.status'),
            columnName: 'status',
            className: 'project-status-header',
            disabled: false,
        },
        {
            displayName: t('projectList.columns.startDate'),
            columnName: 'target_start_date',
            className: 'project-start-date-header',
            disabled: false,
        },
        {
            displayName: t('projectList.columns.dueDate'),
            columnName: 'target_completion_date',
            className: 'project-due-date-header',
            disabled: false,
        },
    ]

    return (
        <div className='project-row-header'>
            {columns.map((column) => (
                <div
                    className={column.className + " header"}
                    key={column.columnName}
                >
                    <div
                        className='header-button'
                        onClick={() => {
                            if (props.projectSortOptions.key === column.columnName) {
                                props.setProjectSortOptions({
                                    key: column.columnName,
                                    order: props.projectSortOptions.order === 'desc' ? 'asc' : 'desc'
                                })
                            } else {
                                props.setProjectSortOptions({
                                    key: column.columnName,
                                    order: 'asc'
                                } as SortOptions<Project>)
                            }
                        }}
                    >
                        <p
                            className='project-field-header'
                            style={{
                                fontWeight: column.columnName === props.projectSortOptions.key ? 'bold' : 'normal'
                            }}
                        >
                            {column.displayName}
                        </p>
                        {column.columnName === props.projectSortOptions.key &&
                            <img src={props.projectSortOptions.order === 'asc' ? TriangleUp : TriangleDown}/>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
};

export default ProjectRowHeader;