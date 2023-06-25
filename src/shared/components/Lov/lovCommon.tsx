// Esse arquivo guarda códigos que são compartilhados entre os componentes da lov.
// No futuro podemos abstrair tudo que repete entre Lov e NlPaginatedLov para cá...

import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
  AutocompleteRenderOptionState,
  FormHelperText,
  Popper,
  PopperProps,
  StandardTextFieldProps,
  TextFieldProps,
  Theme,
} from "@mui/material";
import React, { ReactNode } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { v4 } from "uuid";
import LovOption from "./components/LovOption";

export type LovChangeReason = AutocompleteChangeReason | "autoSelect";

export interface IBaseLovProps
  extends Omit<
    Partial<AutocompleteProps<any, true, true, true>>,
    "onChange" | "value"
  > {
  // Caso informado, o botão de "+" da lov será mostrado em tela. Função pra disparar quando clicar no "+" da lov.
  onAddOpen?: () => void;

  // Field para controle do campo no React-Hook-Form
  field?: ControllerRenderProps<any, any>;

  // Define estilizações na lov caso ela esteja com erro
  error?: boolean;

  // Texto de ajuda que fica em baixo do campo. Usado para caso tiver um erro no campo.
  helperText?: ReactNode;

  // Comprimento fixo em pixels
  width?: number;

  // Comprimento mínimo em pixels do input da lov
  minWidth?: number;

  // Comprimento em pixels do campo de id (primeira coluna)
  idColumnWidth?: number;

  // Irá disparar um "getData" toda vez que seu valor mudar. Pode ser um objeto, number, string ou até array
  watch?: any;

  // Se fullWidth for true, a lov irá se expandir em comprimento o máximo possível
  fullWidth?: boolean;

  /**
   * @deprecated Usar `fullWidth` no lugar
   */
  flex?: boolean;

  // Comprimento máximoem pixels do input da lov
  maxWidth?: number;

  // Caso disableAutoSelect seja informado, em casos onde há apenas um registro na lov, registro não irá ser selecionado automaticamente
  disableAutoSelect?: boolean;

  // Mostra os ID's negativos na lov. Caso não informado, a lov mostrará 'Novo' no lugar de ids negativos
  showNegativeIds?: boolean;

  // Propriedade para setar o value de forma forçada caso necessário
  value?: any | null;

  // Campos no qual a lov não deve mostrar
  hideFields?: string[];

  // Esconde a coluna de id
  hideIdColumn?: boolean;

  // Formatador customizado para cada linha na lov de forma que não afeta o valor real
  optionFormatter?: <T extends any>(row: T) => T;

  // Executa a primeira busca quando o componente for renderizado
  searchOnRender?: boolean;

  // Exatamente igual o onChange do autocomplete, porém com "reason" novas.
  // Pode opcionalmente retornar um valor:
  // Se for retornado true ou undefined, irá prosseguir normalmente, porém caso seja retornado false, a lov não irá
  // mudar seu valor, cancelando o change.
  onChange?: (
    event: React.SyntheticEvent,
    value: any,
    reason: LovChangeReason,
    details?: AutocompleteChangeDetails<any>
  ) => void | boolean | Promise<void | boolean>;

  inputProps: StandardTextFieldProps;
}

export interface IBaseLovRef {
  options: any[];
  setOptions: (newOptions: any[]) => void;
}

type KeyMap = { [key: string]: any };
/**
 * Cria uma cópia do objeto sem os campos informados no segundo parâmetro
 *
 * @param obj Objeto para modificar
 * @param fieldsToHide Vetor de string com os nomes dos campos a esconder
 * @returns Objecto novo sem os campos
 */
export const deleteFieldsFromObj = (
  obj: KeyMap,
  fieldsToHide: string[]
): any => {
  const objCopy = JSON.parse(JSON.stringify(obj));
  fieldsToHide.forEach((fieldToHide) => delete objCopy[fieldToHide]);
  return objCopy;
};

/**
 * Ver comentário da prop "onChange" de IBaseLovProps
 *
 * Retorna um valor boolean dizendo se o onChange deve executar dependendo do seu resultado
 *
 * @param onChangeResponse Resultado da chamada do onChange da lov
 * @returns Retorna um valor boolean dizendo se o onChange deve executar dependendo do seu resultado
 */
export const isOnChangeValid = (onChangeResponse: void | boolean) =>
  onChangeResponse === undefined || onChangeResponse;

// const useLovStyles: any = makeStyles((theme: Theme) =>
//   createStyles({
//     errorColor: {
//       color: "#f44336",
//     },
//     borderErrorColor: {
//       "& .MuiInput-underline:before, .MuiInput-underline:hover:before, .MuiInput-underline:after":
//         {
//           borderBottomColor: "#f44336",
//           borderBottomWidth: 2,
//         },
//     },
//     colloredSvg: {
//       "&.Mui-focused .MuiAutocomplete-clearIndicator .MuiIconButton-label .MuiSvgIcon-root":
//         {
//           color:
//             theme.palette.primary.main /* cor do X para fechar quando focado*/,
//         },
//       "&.Mui-focused .MuiAutocomplete-popupIndicator .MuiIconButton-label .MuiSvgIcon-root":
//         {
//           color: theme.palette.primary.main,
//         },
//     },
//   })
// );

// const generateAutocompleteClasses: any = (
//   minWidth: number,
//   flex: boolean,
//   width?: number,
//   maxWidth?: number
// ) =>
//   makeStyles(() =>
//     createStyles({
//       autocomplete: {
//         minWidth,
//         maxWidth: maxWidth ?? "100%",
//         width: flex ? "100%" : width ?? 400,
//       },
//     })
//   )();

export const formatLovId = (id: any, showNegativeIds = false) => {
  if (!showNegativeIds) {
    return Number(id) < 0 ? "Novo" : id;
  } else {
    return id;
  }
};

export const getLovCommomProps = (props: IBaseLovProps) => {
  // const classes = useLovStyles();
  // const autocompleteClasses = generateAutocompleteClasses(
  //   props.minWidth,
  //   props.fullWidth,
  //   props.width,
  //   props.maxWidth
  // );

  return {
    getOptionLabel(option: any) {
      // Se foi informado campos para serem escondidos, estes devem ser removidos para não aparecer no label
      const optionValues = Object.values(
        props.hideFields
          ? deleteFieldsFromObj(option, props.hideFields)
          : option
      );

      if (props.hideIdColumn) {
        // Remove o campo de id
        optionValues.splice(0, 1);
      } else if (
        !props.showNegativeIds &&
        !isNaN(Number(optionValues[0])) &&
        Number(optionValues[0]) < 0
      ) {
        // Põe "Novo" no lugar de ids negativo se não for informado showNegativeIds
        optionValues[0] = "Novo";
      }

      // CampoId - Campo1 - Campo2 (...)
      return optionValues.join(" - ") || "";
    },
    isOptionEqualToValue: (option: any, value: any) =>
      option[Object.keys(option)[0]] === value[Object.keys(value)[0]],
    loadingText: "Carregando...",
    noOptionsText: props.noOptionsText ?? "Sem resultados",
    className: `lovInput ${props.error ? "lov-underline-error" : ""}`,
    // ${      classes.colloredSvg    }
    classes: {
      // root: autocompleteClasses.autocomplete,
    },
    PopperComponent: (popperProps: PopperProps) => (
      <Popper
        {...popperProps}
        className={`lov-dinamic-border-radius ${popperProps.className}`}
      />
    ),
    renderOption: props.renderOption
      ? props.renderOption
      : (
          properties: React.HTMLAttributes<HTMLLIElement>,
          option: Record<string, string>,
          { inputValue }: AutocompleteRenderOptionState
        ) => (
          <li key={v4()} {...properties}>
            <LovOption
              hideFields={props.hideFields}
              option={option}
              inputValue={inputValue}
              showNegativeIds={props.showNegativeIds}
              optionFormatter={props.optionFormatter}
            />
          </li>
        ),
    async onChange(
      e: React.SyntheticEvent,
      newValue: any,
      reason: LovChangeReason,
      details?: AutocompleteChangeDetails<any>
    ) {
      const result = await (props.onChange &&
        props.onChange(e, newValue, reason, details));
      if (isOnChangeValid(result)) {
        props.field?.onChange(newValue);
      }
    },
  };
};

export const LovHelperText: React.FC<{
  error: IBaseLovProps["error"];
  helperText: IBaseLovProps["helperText"];
}> = ({ helperText, error }) => {
  // const classes = useLovStyles();

  return (
    <div className="w-full ml-[0.1125rem]">
      <FormHelperText> {helperText} </FormHelperText>
    </div>
  );
};

export const isSameLovWatch = (watch: any, oldWatch: any): boolean => {
  if (watch instanceof Array && oldWatch) {
    if (watch.length !== oldWatch.length) return false;

    let same = true;

    for (let i = 0; i < watch.length; i++) {
      if (watch[i] instanceof Array && oldWatch[i] instanceof Array) {
        same = isSameLovWatch(watch[i], oldWatch[i]);
      } else if (watch[i] !== oldWatch[i]) {
        same = false;
      }

      if (!same) break;
    }

    return same;
  } /* if instanceof Object */ else {
    return watch === oldWatch;
  }
};
