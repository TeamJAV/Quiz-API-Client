import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchInput from "./SearchInput";
import Table from "./TableWithSelector";
import { getErrorMessage } from "../../utils/utils";

export default function ListWithSelector({
    setSelected,
    getDataAsync,
    filterDataAfterGet,
    columns,
    searchBy,
    onClickTitle,
}) {
    const [items, setItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        getDataAsync()
            .then((res) => {
                const data = res.data.data;
                setItems(filterDataAfterGet && data.length > 0 ? filterDataAfterGet(data) : data);
            })
            .catch((err) => alert(getErrorMessage(err)));
    }, []);

    useEffect(() => {
        setSearchResults(items);
    }, [items]);

    useEffect(() => {
        const results = items.filter((quiz) =>
            quiz?.[searchBy] && quiz[searchBy].includes(searchTerm)
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
                onClickTitle={onClickTitle}
            ></Table>
        </>
    );
}
