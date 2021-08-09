import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useHeaderConfig } from "../../utils/Users";
import { getErrorMessage, toLocaleDateString } from "../../utils/utils";
import Table from "../commons/TableWithSelector";
import SearchInput from "../commons/SearchInput";
import ReactSwitch from "react-switch";
import HashLoader from "react-spinners/HashLoader";
import { useHistory } from "react-router-dom";

const getClassNameByCurrentStage = (indicator, currentStage) => {
    if (currentStage > indicator) return "complete";
    if (currentStage === indicator) return "active";
    return "";
};

const quizColumns = [
    {
        Header: "NAME",
        accessor: "title",
    },
    {
        Header: "DATE",
        accessor: "created_at",
        Cell: ({ value }) => {
            return toLocaleDateString(value);
        },
    },
];

const roomColumns = [
    {
        Header: "NAME",
        accessor: "name",
    },
    {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ cell }) => (
            <div
                className={cell.value === "Offline" ? "text-grey" : "text-blue"}
            >
                <FontAwesomeIcon
                    className="icon"
                    id="share-icon"
                    icon={faWifi}
                ></FontAwesomeIcon>
            </div>
        ),
    },
];

const isTimeInputValid = (timeInputStr) => {
    const regExp = new RegExp(/^[0-9]+$/);
    const timeInt = parseInt(timeInputStr);
    return (
        regExp.test(timeInputStr) &&
        !isNaN(timeInt) &&
        timeInt >= 1 &&
        timeInt <= 120
    );
};

const List = ({
    listType,
    setSelected,
    apiGetData,
    headerConfig,
    columns,
    searchBy,
}) => {
    const [items, setItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        axios
            .get(apiGetData, headerConfig)
            .then((res) => {
                setItems(
                    listType === "room"
                        ? res.data.data.room.filter(
                              (room) => room.status === "Offline"
                          )
                        : res.data.data
                );
            })
            .catch((err) => {
                console.log(getErrorMessage(err));
            });
    }, []);

    useEffect(() => {
        setSearchResults(items);
    }, [items]);

    useEffect(() => {
        const results = items.filter((quiz) =>
            quiz[searchBy].includes(searchTerm)
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
                columns={columns}
                onSelectedRowsChange={setSelected}
                isSelectedAllAllowed={false}
                isToggleSelected={true}
            ></Table>
        </>
    );
};

const Settings = ({ settings, setSettings }) => {
    const [isTimeValid, setIsTimeValid] = useState(true);
    const handleOnTimeSettingChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setIsTimeValid(true);
        setSettings((s) => ({ ...s, [name]: value }));
    };

    const handleOnTimeSettingBlur = (e) => {
        const value = e.target.value;
        if (!isTimeInputValid(value)) {
            setIsTimeValid(false);
        }
    };

    return (
        <div className="settings-container">
            <table>
                <tbody>
                    <tr>
                        <td>Time (minutes):</td>
                        <td>
                            <input
                                type="number"
                                name="time_offline"
                                value={settings.time_offline}
                                onChange={handleOnTimeSettingChange}
                                onBlur={handleOnTimeSettingBlur}
                                min="1"
                                max="120"
                            />
                            {!isTimeValid && <p>Your time is not valid</p>}
                        </td>
                    </tr>
                    <tr>
                        <td>Shuffle Questions:</td>
                        <td>
                            <ReactSwitch
                                checked={settings.shuffle_question}
                                onChange={() => {
                                    setSettings((s) => ({
                                        ...s,
                                        shuffle_question: !s.shuffle_question,
                                    }));
                                }}
                                className="react-switch"
                                id="shuffle-question-switch"
                            ></ReactSwitch>
                        </td>
                    </tr>
                    <tr>
                        <td>Shuffle Answers:</td>
                        <td>
                            <ReactSwitch
                                checked={settings.shuffle_answer}
                                onChange={() => {
                                    setSettings((s) => ({
                                        ...s,
                                        shuffle_answer: !s.shuffle_answer,
                                    }));
                                }}
                                className="react-switch"
                                id="shuffle-answer-switch"
                            ></ReactSwitch>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default function LaunchTab() {
    const [stage, setStage] = useState(0);
    const [selectedQuizId, setSelectedQuizId] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState([]);
    const [settings, setSettings] = useState({
        time_offline: "60",
        shuffle_answer: false,
        shuffle_question: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const headerConfig = useHeaderConfig();
    const history = useHistory();

    const incStage = () => {
        setStage((s) => (s += 1));
    };

    const decStage = () => {
        setStage((s) => (s -= 1));
    };

    const isCurrentStageComplete = () => {
        return (
            (stage === 1 && selectedQuizId.length === 1) ||
            (stage === 2 && selectedRoomId.length === 1) ||
            (stage === 3 && isTimeInputValid(settings.time_offline))
        );
    };

    useEffect(() => {
        if (stage > 3 && isLoading === false) {
            setIsLoading(true);
            const bodyData = {
                id: selectedRoomId[0],
                id_quiz: selectedQuizId[0],
                ...settings,
            };
            //TODO: FETCH LAUNCH ROOM API HERE
            axios
                .post("/api/teacher/room/launch", bodyData, headerConfig)
                .then((res) => {
                    setTimeout(function () {history.push("/teacher/results")}, 2000)
                })
                .catch((err) => alert(getErrorMessage(err)));
        }
    }, [stage, isLoading, headerConfig]);

    const renderContentByStage = () => {
        // content[0] was intentionally set to empty string because stage counts from 1
        const content = [
            "",
            <List
                key={stage}
                listType="quiz"
                apiGetData="/api/teacher/quiz/list_quiz"
                columns={quizColumns}
                searchBy="title"
                setSelected={setSelectedQuizId}
                headerConfig={headerConfig}
            ></List>,
            <List
                key={stage}
                listType="room"
                apiGetData="/api/teacher/room/list-all/name/asc"
                columns={roomColumns}
                searchBy="name"
                setSelected={setSelectedRoomId}
                headerConfig={headerConfig}
            ></List>,
            <Settings settings={settings} setSettings={setSettings}></Settings>,
        ];
        return content[stage];
    };

    return (
        <Container fluid className="launch-tab px-0">
            {stage > 0 ? (
                <div className="stage-indicator">
                    <div className="row pgb p-0 mt-3">
                        <div
                            className={
                                `col step p-0 ` +
                                getClassNameByCurrentStage(1, stage)
                            }
                        >
                            <p>1</p>
                            <span className="img-circle"></span>
                        </div>
                        <div
                            className={
                                `col step p-0 ` +
                                getClassNameByCurrentStage(2, stage)
                            }
                        >
                            <p>2</p>
                            <span className="img-circle"></span>
                        </div>
                        <div
                            className={
                                `col step p-0 ` +
                                getClassNameByCurrentStage(3, stage)
                            }
                        >
                            <p>3</p>
                            <span className="img-circle"></span>
                        </div>
                    </div>
                    <div className="row pgb p-0">
                        <div className="col text-center">
                            <p>Choose a Quiz</p>
                        </div>
                        <div className="col text-center">
                            <p>Choose a Room</p>
                        </div>
                        <div className="col text-center active">
                            <p>Choose Delivery Method and Settings</p>
                        </div>
                    </div>
                    {renderContentByStage()}
                    {!isLoading ? (
                        <div className="flex justify-center">
                            <Button
                                className="btn-custom--2 btn-dec py-1r"
                                onClick={decStage}
                            >
                                {stage === 1 ? "CANCEL" : "BACK"}
                            </Button>
                            {isCurrentStageComplete() ? (
                                <Button
                                    className="btn-custom--2 btn-inc py-1r bg-orange"
                                    onClick={incStage}
                                >
                                    {stage === 3 ? "LAUNCH" : "NEXT"}
                                </Button>
                            ) : (
                                <Button className="btn-custom--2 btn-custom--disabled">
                                    NEXT
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="loading-container">
                            <HashLoader
                                color={"#ffa100"}
                                size={100}
                                css={{ display: "block", margin: "100px auto" }}
                            />
                            <p className="text-smd">
                                Please wait a moment. Your room is being
                                launched
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h1>Quiz Online</h1>
                    <div>Select a room with quiz to launch an online exam</div>
                    <Button
                        className="btn-pill py-1r bg-orange"
                        onClick={incStage}
                    >
                        LAUNCH NOW
                    </Button>
                </div>
            )}
        </Container>
    );
}
