import React from "react";
import Container from "react-bootstrap/Container";
import ReportList from "./ReportList";

export default function ReportTab() {

    return (
        <Container fluid className="room-tab px-0">
            <ReportList></ReportList>
        </Container>
    );
}
