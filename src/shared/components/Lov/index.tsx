import { Autocomplete } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import LovInput from "./components/LovInput";
import "./lov.scss";
import {
  getLovCommomProps,
  IBaseLovProps,
  IBaseLovRef,
  isOnChangeValid,
  isSameLovWatch,
  LovHelperText,
} from "./lovCommon";

export interface ILovRef extends IBaseLovRef {
  getData: <T>() => Promise<T[]>;
}
interface ILovProps extends IBaseLovProps {
  // Função que retorna os dados da lov
  getData: () => Promise<any[]> | any[];
  // Ref para controlar e acessar os dados internos da lov caso necessário.
  ref?: React.Ref<ILovRef>;
}

const Lov = forwardRef<ILovRef, ILovProps>((props, ref) => {
  const {
    renderOption,
    getData,
    onAddOpen,
    placeholder,
    field,
    idColumnWidth,
    error = false,
    helperText,
    width,
    minWidth = 400,
    maxWidth,
    watch,
    fullWidth = false,
    disableAutoSelect = false,
    onChange,
    hideFields = [],
    showNegativeIds = false,
    value,
    hideIdColumn = false,
    searchOnRender = false,
    ...rest
  } = props;
  const lovCommomProps = getLovCommomProps(props);

  const [open, setOpen] = useState(false);
  const [oldWatch, setOldWatch] = useState<any>();
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const loading = open && !searchExecuted && options.length === 0;

  const isMounted = useRef(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        getData: () => getLovData(),
        setOptions: (newOptions: any[]) => setOptions(newOptions),
        options,
      };
    },
    [options]
  );

  useEffect(() => {
    // Evitar erros de componente chamar o "getData" com o componente desmontando.
    isMounted.current = true;

    if (searchOnRender) getLovData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const getLovData = async function <T>(): Promise<T[]> {
    if (!isMounted.current) return [] as T[];

    setSearchExecuted(false);
    const requestData: T[] = await getData();
    if (!isMounted.current) return requestData;
    setSearchExecuted(true);

    if (requestData.length === 0) {
      setOptions([]);
      return [];
    }

    // Retira o valor selecionado se esse não está nas novas opções
    if (
      field &&
      field.value &&
      !requestData.find((data) =>
        (rest.isOptionEqualToValue ?? lovCommomProps.isOptionEqualToValue)(
          field.value,
          data
        )
      )
    ) {
      field.onChange(null);
    }

    // Seta as opções na Lov
    setOptions(requestData);

    // Se só há um valor na lov, seleciona este diretamente
    if (!disableAutoSelect && requestData.length === 1 && (field || onChange)) {
      if (
        !onChange ||
        isOnChangeValid(
          await onChange({} as React.ChangeEvent, requestData[0], "autoSelect")
        )
      ) {
        field && field.onChange(requestData[0]);
      }
    }

    return requestData;
  };

  useEffect(() => {
    if (watch === undefined) return;

    const isTheSame = isSameLovWatch(watch, oldWatch);
    setOldWatch(watch);

    if (isTheSame) return;

    getLovData();
  }, [watch]);

  useEffect(() => {
    if (loading) return;

    getLovData();
  }, [open]);

  return (
    <div className={`flex w-full flex-col ${props.className ?? ""}`}>
      <Autocomplete
        {...field}
        {...lovCommomProps}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        value={(field?.value ?? value) || null}
        loading={loading}
        renderInput={(params) => (
          <LovInput
            params={params}
            loading={loading}
            placeholder={props.placeholder}
            error={props.error}
            onAddOpen={props.onAddOpen}
          />
        )}
        {...rest}
      />

      {helperText && <LovHelperText error={error} helperText={helperText} />}
    </div>
  );
});

export default Lov;
