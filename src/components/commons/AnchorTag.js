import React from "react";

export default function AnchorTag({
    value,
    row: {
        original: { id, title },
    },
    onClickTitle,
}) {
    return (
        <a
            className="text-blue text-display"
            onClick={() => {
                onClickTitle(id, title);
            }}
            style={{textDecoration: "underline"}}
        >
            {value}
        </a>
    );
}
