import React, { useState, useEffect, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import SearchInput from "../commons/SearchInput";
import Table from "../commons/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import AnchorTag from "../commons/AnchorTag";
import { useHistory } from "react-router-dom";

const List = () => {
    const [items, setItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const headerConfig = useHeaderConfig();
    const history = useHistory();
    const roomColumns = useMemo(
        () => [
            {
                Header: "ROOM",
                accessor: "name",
                Cell: AnchorTag,
            },
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
                        &nbsp;Online
                    </div>
                ),
            },
            {
                Header: "ACTION",
                Cell: ({ cell }) => (
                    <Button
                        type="button"
                        onClick={() => {
                            const row = cell.row.original;
                            axios
                                .post(
                                    `/api/teacher/room/${row.id}/stop-launch`, //Change "15" to room id
                                    {},
                                    headerConfig
                                )
                                .then(() =>
                                    setItems((i) =>
                                        i.filter((room) => room.id !== row.id)
                                    )
                                )
                                .catch((err) => alert(getErrorMessage(err)));
                        }}
                    >
                        Close Room
                    </Button>
                ),
            },
        ],
        []
    );
    useEffect(() => {
        axios
            .get("/api/teacher/room/list-all/name/asc", headerConfig)
            .then((res) => {
                setItems(
                    res.data.data.room.filter(
                        (room) => room.status === "Online"
                    )
                );
            })
            .catch((err) => {
                alert(getErrorMessage(err));
            });
    }, []);

    useEffect(() => {
        setSearchResults(items);
    }, [items]);

    useEffect(() => {
        const results = items.filter((quiz) =>
            quiz["name"].includes(searchTerm)
        );
        setSearchResults(results);
    }, [searchTerm]);

    return (
        <>
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            ></SearchInput>
            <Table
                data={searchResults}
                columns={roomColumns}
                onClickTitle={(id) => history.push(`/teacher/results/${id}`)}
            ></Table>
        </>
    );
};

export default function ResultTab() {
    return (
        <Container fluid>
            <div className="flex justify-between text-header font-300 py-3r">
                <span>Live Results</span>
            </div>
            <List></List>
        </Container>
    );
}
