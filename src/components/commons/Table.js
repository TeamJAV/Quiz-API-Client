import React from "react";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy } from "react-table";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Table = ({ data, columns, onClickTitle }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data, onClickTitle }, useSortBy);

    return (
        <BTable {...getTableProps()} className="r-table">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => {
                            return (
                                <th
                                    {...column.getHeaderProps([
                                        {
                                            className: column.className,
                                            style: column.style,
                                        },
                                        column.getSortByToggleProps(),
                                    ])}
                                >
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <FontAwesomeIcon
                                                    icon={faSortDown}
                                                ></FontAwesomeIcon>
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faSortUp}
                                                ></FontAwesomeIcon>
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </span>
                                </th>
                            );
                        })}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()} className="text-xs">
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </BTable>
    );
};

export default Table;
