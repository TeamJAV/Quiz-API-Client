import React from "react";
import { default as BModal } from "react-bootstrap/Modal";

export default function Modal({
    state: { show, setShow },
    backdrop = true,
    onShow,
    onHide,
    children,
}) {

    return (
        <BModal
            show={show}
            onShow={onShow}
            onHide={onHide}
            backdrop={backdrop}
            centered
        >
            <BModal.Header closeButton></BModal.Header>
            <BModal.Body>{children}</BModal.Body>
        </BModal>
    );
}
