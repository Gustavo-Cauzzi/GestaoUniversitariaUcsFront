import {
  AutocompleteRenderInputParams,
  CircularProgress,
  IconButton,
  StandardTextFieldProps,
  TextField,
  useTheme,
} from "@mui/material";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { RiSettings3Line } from "react-icons/ri";

interface ILovInput extends StandardTextFieldProps {
  onAddOpenSettings?: () => void;
  onAddOpen?: () => void;
  placeholder?: string;
  params: AutocompleteRenderInputParams;
  error?: boolean;
  loading?: boolean;
  codUm?: string;
}

// export const useStyles = makeStyles(() =>
//   createStyles({
//     errorColor: {
//       color: "#f44336",
//     },
//     borderErrorColor: {
//       "& .MuiFilledInput-root:before": {
//         borderBottomColor: "#f44336",
//         borderBottomWidth: 2,
//       },
//       "& .MuiFilledInput-root:hover:before": {
//         borderBottomColor: "#f44336",
//         borderBottomWidth: 2,
//       },
//       "& .MuiFilledInput-root:after": {
//         borderBottomColor: "#f44336",
//         borderBottomWidth: 2,
//       },
//     },
//   })
// );

const LovInput: React.FC<ILovInput> = ({
  onAddOpenSettings,
  onAddOpen,
  placeholder,
  params,
  error = false,
  loading = false,
  codUm,
  ...props
}) => {
  const theme = useTheme();
  // const classes = useStyles();

  return (
    <div className="flex items-center gap-1 mt-[5px]">
      {onAddOpen && (
        <div
          style={{ backgroundColor: theme.palette.primary.main }}
          className="addContainer hover:darken transition-filter"
          onMouseDown={onAddOpen}
        >
          <FiPlus size={20} color="#fff" />
        </div>
      )}
      <TextField
        {...props}
        {...params}
        placeholder={placeholder}
        className="lovTextField"
        InputProps={{
          ...params.InputProps,
          className: `${params.InputProps.className}`,
          endAdornment: (
            <span className="text-[13px]">
              {codUm ?? ""}
              {params.InputProps.endAdornment}
            </span>
          ),
        }}
      />
    </div>
  );
};

export default LovInput;
