import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Fragment, PropsWithChildren, ReactNode, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// type Columns<T extends Record<string, unknown>> = {
//   field: FlattenObjectKeys<T> | string;
//   headerName?: string;
//   type?: GridColType;
//   valueGetter?: (row: T) => ReactNode;
// };

export interface CollapsibleTableProps<
  T extends Record<string, unknown>,
  C extends Record<string, unknown>
> {
  data: T[];
  getCollapsibleData: (row: T) => C[];
  columns: GridColDef<T>[];
  collapsibleColumns: GridColDef<C>[];
  getRowId: (row: T) => number | string;
  getCollapsibleRowId: (row: C) => any;
}
export const CollapsibleTable = <
  T extends Record<string, unknown>,
  C extends Record<string, unknown>
>({
  data,
  columns,
  getRowId,
  collapsibleColumns,
  getCollapsibleData,
  getCollapsibleRowId,
}: PropsWithChildren<CollapsibleTableProps<T, C>>): ReturnType<React.FC> => {
  const [open, setOpen] = useState<(number | string)[]>([]);

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((column) => (
              <TableCell key={column.field}>
                {column.headerName ?? column.field}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Fragment key={getRowId(row)}>
              <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() =>
                      setOpen((state) =>
                        state.some((id) => id === getRowId(row))
                          ? state.filter((id) => id !== getRowId(row))
                          : [...state, getRowId(row)]
                      )
                    }
                  >
                    {open ? <FiChevronDown /> : <FiChevronUp />}
                  </IconButton>
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {column.valueGetter
                      ? column.valueGetter({ row } as GridValueGetterParams)
                      : (row[column.field] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={6}
                >
                  <Collapse
                    in={open.includes(getRowId(row))}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ margin: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {collapsibleColumns.map((column) => (
                              <TableCell key={column.field}>
                                {column.headerName}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getCollapsibleData(row).length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={collapsibleColumns.length}>
                                <span>Sem resultados</span>
                              </TableCell>
                            </TableRow>
                          ) : (
                            getCollapsibleData(row).map((collapsibleRow) => (
                              <TableRow
                                key={getCollapsibleRowId(collapsibleRow)}
                              >
                                {collapsibleColumns.map((column) => (
                                  <TableCell key={column.field}>
                                    {column.valueGetter
                                      ? column.valueGetter({
                                          row: collapsibleRow,
                                        } as GridValueGetterParams)
                                      : (collapsibleRow[
                                          column.field
                                        ] as ReactNode)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
