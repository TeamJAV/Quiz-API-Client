
import React from "react";
import Button from "react-bootstrap/Button"

export default function AnchorTag({
    value,
    row: {
        original: { id, title },
    },
    onClickTitle,
}) {
    return (
        <Button
            as="a"
            className="text-blue text-display"
            onClick={() => {
                onClickTitle(id, title);
            }}
            style={{textDecoration: "underline"}}
            bsPrefix="a"
        >
            {value}
        </Button>
    );
}
