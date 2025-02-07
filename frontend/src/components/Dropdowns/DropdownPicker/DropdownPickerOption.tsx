import {Children, PropsWithChildren} from "react";

type DropdownRowProps = {
    value: string
    className: string
}

const DropdownPickerOption = (props: PropsWithChildren<DropdownRowProps>) => {
    return (
        <div className={props.className}>
            {Children.map(props.children, child =>
                <>
                    {child}
                </>
            )}
        </div>
    )
}

export default DropdownPickerOption;