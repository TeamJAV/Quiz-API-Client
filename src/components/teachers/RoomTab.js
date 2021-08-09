import React from "react";
import Container from "react-bootstrap/Container";
import RoomList from "./RoomList";

export default function RoomTab() {

    return (
        <Container fluid className="room-tab px-0">
            <RoomList></RoomList>
        </Container>
    );
}
