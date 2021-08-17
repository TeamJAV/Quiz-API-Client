import axios from "axios";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faSpinner,
    faShareAlt,
    faTrashAlt,
    faPencilAlt,
    faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import Modal from "../commons/Modal";
import Table from "../commons/Table";

const fetchGetAllRoomsAPI = (orderBy, type, config) => {
    return axios.get(`/api/teacher/room/list-all/${orderBy}/${type}`, config);
};

const fetchCreateUpdateRoom = (room, config) => {
    return axios.post(`/api/teacher/room/create`, room, config);
    // room = {
    //      id: room id - null if create room
    //      name: room name
    //}
};

//TODO: DELETE ROOM
const fetchDeleteRoom = (id, config) => {
    return axios.post(`/api/teacher/room/${id}/delete`, {}, config);
};

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const headerConfig = useHeaderConfig();

    const [roomModalData, setRoomModalData] = useState(null); //null - close modal, {name: ''} - modal create, {id: "room_id", name: "room_name"} - modal rename

    useEffect(() => {
        fetchGetAllRoomsAPI("name", "asc", headerConfig)
            .then((res) => {
                setRooms(res.data.data.room);
            })
            .catch((err) => {
                alert(getErrorMessage(err));
            });
    }, []);

    const handleCreateRoom = () => {
        setRoomModalData({ name: "" });
    };

    const handleDeleteRoom = useCallback(
        (id) => {
            fetchDeleteRoom(id, headerConfig)
                .then((res) =>
                    setRooms((r) => r.filter((room) => room.id !== id))
                )
                .catch((err) => alert(getErrorMessage(err)));
        },
        [headerConfig]
    );

    const createRoom = (name) => {
        fetchCreateUpdateRoom({ name: name }, headerConfig)
            .then((res) => {
                setRoomModalData(null);
                setRooms([...rooms, res.data.data]);
            })
            .catch((err) => alert(getErrorMessage(err)));
    };

    const updateRoom = (name) => {
        fetchCreateUpdateRoom(
            { id: roomModalData?.id, name: name },
            headerConfig
        )
            .then((res) => {
                const updatedRoom = res.data.data.room;
                setRoomModalData(null);
                setRooms(
                    rooms.map((room) =>
                        room.id === updatedRoom.id
                            ? { ...room, name: updatedRoom.name }
                            : room
                    )
                );
            })
            .catch((err) => alert(getErrorMessage(err)));
    };

    const columns = useMemo(
        () => [
            {
                Header: "STATUS",
                accessor: "status",
                Cell: ({ cell }) => (
                    <div
                        className={
                            cell.value === "Offline" ? "text-grey" : "text-blue"
                        }
                    >
                        <FontAwesomeIcon
                            className="icon"
                            id="share-icon"
                            icon={faWifi}
                        ></FontAwesomeIcon>
                    </div>
                ),
            },
            {
                Header: "NAME",
                accessor: "name",
            },
            {
                Header: "SHARE",
                accessor: "share",
                disableSortBy: true,
                Cell: () => (
                    <button
                        type="button"
                        className="text-blue bg-trans"
                        style={{ margin: "0 auto", width: "100%" }}
                    >
                        <FontAwesomeIcon
                            className="icon"
                            id="share-icon"
                            icon={faShareAlt}
                        ></FontAwesomeIcon>
                    </button>
                ),
                className: "column-btn--2",
            },
            {
                Header: "RENAME",
                accessor: "rename",
                disableSortBy: true,
                Cell: ({ cell }) => (
                    <button
                        type="button"
                        className="text-blue bg-trans"
                        style={{ margin: "0 auto", width: "100%" }}
                        onClick={() => {
                            const row = cell.row.original;
                            setRoomModalData({
                                id: row.id,
                                name: row.name,
                            });
                        }}
                    >
                        <FontAwesomeIcon
                            className="icon"
                            id="share-icon"
                            icon={faPencilAlt}
                        ></FontAwesomeIcon>
                    </button>
                ),
                className: "column-btn--2",
            },
            {
                Header: "DELETE",
                accessor: "delete",
                disableSortBy: true,
                Cell: ({ cell }) => (
                    <button
                        type="button"
                        className="text-blue bg-trans"
                        style={{ margin: "0 auto", width: "100%" }}
                        onClick={() => {
                            const row = cell.row.original;
                            handleDeleteRoom(row.id);
                        }}
                    >
                        <FontAwesomeIcon
                            className="icon"
                            id="share-icon"
                            icon={faTrashAlt}
                        ></FontAwesomeIcon>
                    </button>
                ),
                className: "column-btn--2",
            },
        ],
        [handleDeleteRoom]
    );

    return (
        <Container fluid className="room-list">
            <div className="flex justify-between text-header font-300 py-3r">
                <span>Rooms</span>
                <Button
                    className="btn-pill py-1r bg-orange"
                    onClick={handleCreateRoom}
                >
                    <FontAwesomeIcon icon={faPlus} size="lg"></FontAwesomeIcon>
                    &nbsp;CREATE ROOM
                </Button>
            </div>
            <Table data={rooms} columns={columns}></Table>
            <RoomNameModal
                roomData={roomModalData}
                setRoomData={setRoomModalData}
                handleSubmit={
                    roomModalData && roomModalData?.id ? updateRoom : createRoom
                }
            ></RoomNameModal>
        </Container>
    );
}

const RoomNameModal = ({ roomData, setRoomData, handleSubmit }) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCloseModal = () => {
        setRoomData(null);
    };

    useEffect(() => {
        const isRoomDataNull = roomData === null;
        setShow(!isRoomDataNull);
        if (!isRoomDataNull && roomData?.name) setName(roomData.name);
    }, [roomData]);

    useEffect(() => {
        if (show) {
            setIsLoading(false);
        }
    }, [show]);

    return (
        <Modal state={{ show }} onHide={handleCloseModal}>
            <input
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                }}
                style={{ width: "100%", marginBottom: "30px" }}
                className="room-modal-input"
                placeholder="What should I call this room..."
            ></input>
            <div className="flex">
                <Button
                    className=" py-1r bg-orange room-modal-btn"
                    onClick={() => {
                        setIsLoading(!isLoading);
                        handleSubmit(name);
                    }}
                >
                    {isLoading ? (
                        <FontAwesomeIcon
                            icon={faSpinner}
                            className="fa-spin"
                        ></FontAwesomeIcon>
                    ) : roomData && roomData?.id ? (
                        "RENAME"
                    ) : (
                        "CREATE ROOM"
                    )}
                </Button>
            </div>
        </Modal>
    );
};
