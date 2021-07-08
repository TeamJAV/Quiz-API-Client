import React, { useState, useEffect, useRef, useCallback } from "react";
import Container from "react-bootstrap/Container";
import Table from "../commons/Table";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toLocaleDateString } from "../../utils/utils";
import AnchorTag from "../commons/AnchorTag";

const date = toLocaleDateString("2021-06-10T04:08:51.000000Z", "vi-VN");
const fakeQuiz = [
    { id: 3, title: "abxyz", created_at: date },
    { id: 4, title: "ab cb", created_at: date },
    { id: 5, title: "retwert", created_at: date },
    { id: 6, title: "Nam", created_at: date },
    { id: 7, title: "opppqwe", created_at: date },
    { id: 8, title: "qweoppp", created_at: date },
];
const columns = [
    {
        Header: "NAME",
        accessor: "title",
        Cell: AnchorTag,
    },
    {
        Header: "DATE",
        accessor: "created_at",
    },
    {
        Header: "COPY",
        accessor: "copy",
        disableSortBy: true,
    },
    {
        Header: "DOWNLOAD",
        accessor: "download",
        disableSortBy: true,
    },
    {
        Header: "SHARE",
        accessor: "share",
        disableSortBy: true,
    },
];

export default function QuizList(props) {
    const [quizzes, setQuizzes] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    const searchQuizByName = (searchName) => {
        return quizzes.filter((quiz) => quiz.title.includes(searchName));
    };

    useEffect(() => {
        setQuizzes(fakeQuiz);
    }, []);

    useEffect(() => {
        setSearchResults(quizzes);
    }, [quizzes]);

    useEffect(() => {
        const results = searchQuizByName(debouncedSearchTerm);
        setSearchResults(results);
    }, [debouncedSearchTerm]);

    return (
        <Container fluid className="quiz-list">
            <div className="flex justify-between text-header font-300 py-3r">
                <span>Quizzes</span>
                <Button className="btn-pill py-1r bg-orange">
                    <FontAwesomeIcon icon={faPlus} size="lg"></FontAwesomeIcon>
                    &nbsp;ADD QUIZ
                </Button>
            </div>
            <div className="search-container bg-grey--light text-base">
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
                        ></FontAwesomeIcon>
                    ) : null}
                </div>
            </div>
            <Table data={searchResults} columns={columns} onClickTitle={(id, title) => props.onSelect({id, title})}></Table>
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
