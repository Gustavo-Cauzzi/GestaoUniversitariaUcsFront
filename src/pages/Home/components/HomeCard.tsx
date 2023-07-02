import { Paper } from "@mui/material";
import { PropsWithChildren, HTMLAttributes } from "react";

export const HomeCard: React.FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, ...props }) => (
  <Paper className="flex flex-col gap-4 bg-white p-4 w-full" {...props}>
    {children}
  </Paper>
);
