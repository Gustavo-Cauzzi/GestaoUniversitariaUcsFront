import { FC } from "react";
import { CollapsibleTable, CollapsibleTableProps } from "./CollapsibleTable";
import { HomeAccordion } from "./HomeAccordion";
import { CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

type CollipsableConfigProps =
  | "getCollapsibleData"
  | "collapsibleColumns"
  | "getCollapsibleRowId";

export interface ValidInvalidTableProps<
  T extends Record<string, unknown>,
  C extends Record<string, unknown>
> extends Omit<CollapsibleTableProps<T, C>, "data" | CollipsableConfigProps> {
  data?: { valid: T[]; invalid: T[] };
  collapsibleConfig?: Pick<CollapsibleTableProps<T, C>, CollipsableConfigProps>;
}

export const ValidInvalidTable = <
  T extends Record<string, unknown>,
  C extends Record<string, unknown>
>({
  data,
  collapsibleConfig,
  ...props
}: ValidInvalidTableProps<T, C>): ReturnType<FC> => {
  if (!data) {
    return (
      <div className="flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <HomeAccordion
        title={`Inválidas (${data?.invalid.length ?? "-"})`}
        variant="ERROR"
      >
        {collapsibleConfig ? (
          <CollapsibleTable
            data={data.invalid}
            {...props}
            {...collapsibleConfig}
          />
        ) : (
          <DataGrid {...props} rows={data.invalid} />
        )}
      </HomeAccordion>
      <HomeAccordion
        title={`Válidas (${data?.valid.length ?? "-"})`}
        variant="SUCCESS"
      >
        {collapsibleConfig ? (
          <CollapsibleTable
            data={data.valid}
            {...props}
            {...collapsibleConfig}
          />
        ) : (
          <DataGrid {...props} rows={data.valid} />
        )}
      </HomeAccordion>
    </>
  );
};
