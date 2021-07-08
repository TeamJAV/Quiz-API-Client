import React from "react";
import BTable from 'react-bootstrap/Table'
import { useTable, useRowSelect, useSortBy } from "react-table";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Table = ({ data, columns, onClickTitle }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
        state: { selectedRowIds },
    } = useTable({ columns, data, onClickTitle }, useSortBy, useRowSelect, (hooks) => {
        hooks.visibleColumns.push((columns) => [
            // Let's make a column for selection
            {
                id: "selection",
                // The header can use the table's getToggleAllRowsSelectedProps method
                // to render a checkbox
                Header: ({ getToggleAllRowsSelectedProps }) => (
                    <div className="flex">
                        <IndeterminateCheckbox
                            {...getToggleAllRowsSelectedProps()}
                        />
                        <span style={{marginLeft: "9px"}}>ALL</span>
                    </div>
                ),
                // The cell can use the individual row's getToggleRowSelectedProps method
                // to the render a checkbox
                Cell: ({ row }) => (
                    <div className="flex">
                        <IndeterminateCheckbox
                            {...row.getToggleRowSelectedProps()}
                        />
                    </div>
                ),
            },
            ...columns,
        ]);
    });

    return (
        <BTable {...getTableProps()} className="r-table">
            <thead>
                {headerGroups.map((headerGroup) => ( 
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => {
                            // console.log(column);
                            return (
                                <th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
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

export default Table

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        );
    }
);
