import './AliasEditor.css';

import { useEffect, useRef, useState } from "react";

type AliasEditorProps = {
    team_email_alias: string,
    setTeamAlias: (string) => void
}

const AliasEditor = (props: AliasEditorProps) => {
    const [team_email_alias, setTeamAlias] = useState(props.team_email_alias);
    const ref = useRef(null);

    const enterInput = () => {
        if (team_email_alias !== "") {
            setTeamAlias(team_email_alias);
            props.setTeamAlias(team_email_alias);
        } else {
            setTeamAlias(props.team_email_alias);
        }
        ref.current.blur();
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enterInput();
        }
    };

    useEffect(() => {
        setTeamAlias(props.team_email_alias);
    }, [props.team_email_alias]);

    return (
        <div className='alias-editor'>
            <input
                ref={ref}
                type="text"
                placeholder="Must give a team email alias"
                value={team_email_alias}
                onChange={(event) => setTeamAlias(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={enterInput}
            />
        </div>
    );
}

export default AliasEditor;
