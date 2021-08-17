import axios from "axios";
import React, { useState, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage } from "../../utils/utils";
import AnchorTag from "../commons/AnchorTag";
import ListWithSelector from "../commons/ListWithSelector";
import { useHistory } from "react-router-dom";

const columns = [
    {
        Header: "NAME",
        accessor: "title",
        Cell: AnchorTag,
    },
    {
        Header: "DATE",
        accessor: "start_at",
        // Cell: ({ cell }) => {
        //     const split = String(cell.value).split(" ");
        //     return (
        //         <>
        //             <div className="date">{split[0]}</div>
        //             <div className="hour">{split[1]}</div>
        //         </>
        //     );
        // },
    },
    {
        Header: "ROOM",
        accessor: "name",
    },
    {
        Header: "TYPE",
        Cell: ({ cell }) => <div>Quiz</div>,
    },
];

export default function ReportList() {
    const [selectedReport, setSelectedReport] = useState(null);
    const headerConfig = useHeaderConfig();
    const history = useHistory();

    const getAllReports = useCallback(
        () => axios.get("/api/teacher/result/all_result", headerConfig),
        [headerConfig]
    );

    return (
        <Container fluid className="room-list">
            <div className="flex justify-between text-header font-300 py-3r">
                <span>Reports</span>
            </div>
            <ListWithSelector
                setSelected={setSelectedReport}
                getDataAsync={getAllReports}
                filterDataAfterGet={(data) =>
                    data.reduce((list, re) => {
                        if (re?.room?.name && re?.quiz?.title) {
                            list.push({
                                id: re.id,
                                status: re.status,
                                name: re.room.name,
                                title: re.quiz.title,
                                start_at: re.start_at,
                            });
                        }
                        return list;
                    }, [])
                }
                columns={columns}
                searchBy="title"
                onClickTitle={(id) => history.push(`/teacher/reports/${id}`)}
            ></ListWithSelector>
        </Container>
    );
}
