import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function SearchInput({ searchTerm, setSearchTerm }) {
    const [searchInput, setSearchInput] = useState(searchTerm);
    const debouncedSearchInput = useDebounce(searchInput, 500);

    useEffect(() => {
        setSearchTerm(debouncedSearchInput);
    }, [debouncedSearchInput]);

    return (
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
        </div>
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
