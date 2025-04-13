import React from "react";

const ActionButton = ({onClick, label,color,icon}) => {
    return (
        <button
            className={`flex cursor-pointer items-center justify-center rounded-lg bg-${color}-500 p-2 text-white hover:bg-${color}-600`}
            onClick={onClick}
            aria-label={label}
        >
            {icon}
        </button>
    );
}
export default ActionButton;