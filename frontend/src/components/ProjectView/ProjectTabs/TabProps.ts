interface Project {
    id: string;
    [key: string]: any; // catch-all for other unspecified properties
}

type TabProps = {
    project: Project
}

export default TabProps
