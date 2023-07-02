import { createTheme } from "@mui/material";
import { MUI_DATAGRID_PT_BR } from "./shared/locale/MuiDatagrid";
import type {} from "@mui/x-data-grid/themeAugmentation";

const hoverOpacity = 0.04;
const mainColor = "#7A0BB2";

export const theme = createTheme({
  palette: {
    primary: {
      main: mainColor,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-root": {
            borderRadius: 15,
          },
        },
      },
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
          borderRadius: 10,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        gutters: {
          // borderRadius: 20,
          borderTopLeftRadius: "20px !important",
          borderTopRightRadius: "20px !important",
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        placement: "top",
        arrow: true,
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s",
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        noOptionsText: "Sem opções",
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          // Não há uma forma simples provida pelo Material de detectar a presença de um collapse em uma tabela!
          // MuiTableRow-root com collapse devem ser coloridas uma a cada 4 linhas devido as linhas escondidas que o
          // Collapse gera. Para detectar, detectamos pelo CSS se há colunas com apenas uma célula com colSpan, que
          // é um bom (mas não perfeito) indicador da presença de um collapse naquela tabela.

          // Com collapse
          "&:has(> .MuiTableRow-root > .MuiTableCell-root[colspan]:only-child)":
            {
              ".MuiTableRow-root:not(.MuiTableRow-head)": {
                "&:nth-of-type(4n -1)": {
                  backgroundColor: "rgba(0, 0, 0,0.04)",
                },
                // Hover de TableRow configurado aqui dentro para manter prioridade sobre o :nth-of-type acima
                "&:not(:has(.MuiCollapse-root)):hover": {
                  backgroundColor: "rgba(0, 0, 0,0.1)",
                },
              },
            },
          // Sem collapse (mesma coisa porém negado)
          "&:not(:has(> .MuiTableRow-root > .MuiTableCell-root[colspan]:only-child))":
            {
              ".MuiTableRow-root:not(.MuiTableRow-head)": {
                "&:nth-of-type(2n -1)": {
                  backgroundColor: "rgba(0, 0, 0,0.04)",
                },
                // Hover de TableRow configurado aqui dentro para manter prioridade sobre o :nth-of-type acima
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0,0.1)",
                },
              },
            },
        },
      },
    },
    MuiDataGrid: {
      defaultProps: {
        pageSizeOptions: [10, 25, 50, 100],
        autoHeight: true,
        disableRowSelectionOnClick: true,
        localeText: MUI_DATAGRID_PT_BR,
        initialState: {
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        },
      },
      styleOverrides: {
        root: {
          border: 0,
          "& .MuiCheckbox-root": {
            padding: "3px 9px",
          },
          "& .MuiDataGrid-row .MuiTextField-root": {
            "& .MuiFilledInput-root": {
              paddingTop: "8px",
              paddingBottom: "8px",
            },

            "& *": {
              background: "transparent",
            },
          },

          "& .MuiDataGrid-renderingZone, .MuiDataGrid-virtualScrollerContent": {
            "& .MuiDataGrid-row": {
              border: 0,
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "#E0E0E0",
              },
            },
            "& .MuiDataGrid-row:first-of-type": {
              borderTopLeftRadius: "3px",
              borderBottomLeftRadius: "3px",
              overflow: "hidden",
            },
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: `rgba(0, 0, 0, ${hoverOpacity})`,

              "&:hover": {
                backgroundColor: "#E0E0E0",
              },

              "&.Mui-selected": {
                backgroundColor: `rgba(12, 6, 63, 0.1)`,

                "&:hover": {
                  backgroundColor: `rgba(12, 6, 63, 0.12);`,
                },
              },
            },
            "& .MuiDataGrid-row:last-of-type": {
              borderTopRightRadius: "3px",
              borderBottomRightRadius: "3px",
              overflow: "hidden",
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `2px solid ${mainColor}`,
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },
    },
  },
});
