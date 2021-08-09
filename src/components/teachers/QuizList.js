import React, { useCallback, useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Table from "../commons/TableWithSelector";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faPlus,
    faSearch,
    faShareAlt,
    faTimes,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { getErrorMessage, toLocaleDateString } from "../../utils/utils";
import AnchorTag from "../commons/AnchorTag";
import axios from "axios";
import { useHeaderConfig } from "../../utils/Users";

const columns = [
    {
        Header: "NAME",
        accessor: "title",
        Cell: AnchorTag,
    },
    {
        Header: "DATE",
        accessor: "created_at",
        Cell: ({ value }) => {
            return toLocaleDateString(value);
        },
    },
    {
        Header: "COPY",
        accessor: "copy",
        disableSortBy: true,
        Cell: ({ cell }) => (
            <button type="button" className="text-blue">
                <FontAwesomeIcon
                    className="icon"
                    id="copy-icon"
                    icon={faCopy}
                ></FontAwesomeIcon>
            </button>
        ),
    },
    {
        Header: "DOWNLOAD",
        accessor: "download",
        disableSortBy: true,
        Cell: ({ cell }) => (
            <button type="button" className="text-blue">
                <FontAwesomeIcon
                    className="icon"
                    id="download-icon"
                    icon={faArrowDown}
                ></FontAwesomeIcon>
            </button>
        ),
    },
    {
        Header: "SHARE",
        accessor: "share",
        disableSortBy: true,
        Cell: ({ cell }) => (
            <button type="button" className="text-blue">
                <FontAwesomeIcon
                    className="icon"
                    id="share-icon"
                    icon={faShareAlt}
                ></FontAwesomeIcon>
            </button>
        ),
    },
];

const fetchCreateQuizAPI = (config) => {
    return axios.post("/api/teacher/quiz/create_quiz", {}, config);
};

const fetchGetQuizListAPI = (config) => {
    return axios.get("/api/teacher/quiz/list_quiz", config);
};

const fetchDeleteQuizAPI = (id, config) => {
    return axios.post(`/api/teacher/quiz/delete_quiz/${id}`, {}, config);
};

export default function QuizList(props) {
    const [quizzes, setQuizzes] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearchTerm = useDebounce(searchInput, 500);
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);

    const headerConfig = useHeaderConfig();

    const searchQuizByName = useCallback(
        (searchName) => {
            return quizzes.filter((quiz) => quiz.title.includes(searchName));
        },
        [quizzes]
    );

    useEffect(() => {
        fetchGetQuizListAPI(headerConfig)
            .then((res) => {
                setQuizzes(res.data.data);
            })
            .catch((err) => {
                console.log(getErrorMessage(err));
            });
    }, []);

    useEffect(() => {
        setSearchResults(quizzes);
    }, [quizzes]);

    useEffect(() => {
        const results = searchQuizByName(debouncedSearchTerm);
        setSearchResults(results);
    }, [debouncedSearchTerm, searchQuizByName]);

    const handleCreateQuizClick = () => {
        fetchCreateQuizAPI(headerConfig)
            .then((res) => {
                const data = res.data.data;
                const id = data.id;
                const title = data.title;
                props.onSelect({ id, title });
            })
            .catch((err) => console.log(getErrorMessage(err)));
    };

    const handleOnDeleteQuiz = () => {
        // At the moment, we only allow to delete one quiz at a time
        if (selectedQuizzes.length !== 1) return;
        const quizId = selectedQuizzes[0];
        fetchDeleteQuizAPI(quizId, headerConfig)
            .then((res) => {
                setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
            })
            .catch((err) => {
                console.log(getErrorMessage(err));
            });
    };

    return (
        <Container fluid className="quiz-list">
            <div className="flex justify-between text-header font-300 py-3r">
                <span>Quizzes</span>
                <Button
                    className="btn-pill py-1r bg-orange"
                    onClick={handleCreateQuizClick}
                >
                    <FontAwesomeIcon icon={faPlus} size="lg"></FontAwesomeIcon>
                    &nbsp;ADD QUIZ
                </Button>
            </div>
            <div className="search-container bg-grey--light text-base flex justify-between align-center">
                <div className="input-container">
                    <FontAwesomeIcon
                        className="icon"
                        id="search-icon"
                        icon={faSearch}
                    ></FontAwesomeIcon>
                    <input
                        className="input-2"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search Quizzes"
                    ></input>
                    {searchInput !== "" ? (
                        <FontAwesomeIcon
                            className="icon"
                            id="delete-icon"
                            icon={faTimes}
                            onClick={() => {
                                setSearchInput("");
                            }}
                        ></FontAwesomeIcon>
                    ) : null}
                </div>
                <div className="delete-quiz-btn">
                    <button
                        type="button"
                        disabled={Object.keys(selectedQuizzes).length !== 1}
                        onClick={handleOnDeleteQuiz}
                    >
                        <FontAwesomeIcon
                            id="delete-icon"
                            icon={faTrashAlt}
                            style={{
                                width: "25px",
                                height: "25px",
                                marginRight: "5px",
                            }}
                        ></FontAwesomeIcon>
                        Delete
                    </button>
                </div>
            </div>
            <Table
                data={searchResults}
                columns={columns}
                onClickTitle={(id, title) => props.onSelect({ id, title })}
                onSelectedRowsChange={setSelectedQuizzes}
            ></Table>
        </Container>
    );
}

const useDebounce = (value, delay) => {
    const [debounceVal, setDebounceVal] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceVal(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debounceVal;
};
