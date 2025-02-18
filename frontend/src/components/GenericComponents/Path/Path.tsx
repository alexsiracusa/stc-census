import './Path.css'

import {Link} from "react-router";
import {Fragment} from "react";
import ChevronRight from "../../../assets/Icons/ChevronRight.svg";

type PathProps = {
    path: [{
        name: string,
        link: string
    }]
}

const Path = (props: PathProps) => {
    return (
        <div className='project-path'>
            {props.path.map((item, index) => (
                <Fragment key={index}>
                    <Link
                        reloadDocument
                        to={item.link}
                        className='link'
                    >
                        <p>{item.name}</p>
                    </Link>
                    {index < props.path.length - 1 &&
                        <img src={ChevronRight}/>
                    }
                </Fragment>
            ))}
        </div>
    )
}

export default Path;