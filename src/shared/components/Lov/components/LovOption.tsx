import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { deleteFieldsFromObj, formatLovId } from "../lovCommon";

interface ILovOptionProps {
  option: Record<string, string>;
  inputValue: any;
  showNegativeIds?: boolean;
  hideFields?: string[];
  optionFormatter?: (row: any) => any;
}

const generateHighlight = (inputValue: string) => (value: string) =>
  parse(value, match(value, inputValue)).map((part, letterIndex) => (
    <span
      key={letterIndex}
      style={{
        fontWeight: part.highlight ? 700 : 400,
      }}
    >
      {part.text}
    </span>
  ));

const LovOption: React.FC<ILovOptionProps> = ({
  hideFields = [],
  inputValue,
  option,
  optionFormatter = (row) => row,
  showNegativeIds,
}) => {
  const [fieldsToShow, setFieldsToShow] = useState<typeof option>({});
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const applyHighlight = generateHighlight(inputValue);

  useEffect(() => {
    setFieldsToShow(optionFormatter(deleteFieldsFromObj(option, hideFields)));
  }, []);

  useLayoutEffect(() => {
    const newWidths: number[] = [];

    document.querySelectorAll(".lovRow").forEach((lovRowElem) => {
      lovRowElem.querySelectorAll(".lovOption").forEach((lovOptionElem, i) => {
        newWidths[i] = Math.max(
          newWidths[i] ?? 0,
          lovOptionElem.clientWidth + 1
        );
      });
    });

    setColumnWidths(newWidths);
  }, [fieldsToShow, option]);

  return (
    <div className="flex items-center w-full" key={fieldsToShow.key}>
      <div className="flex w-full gap-x-2 lovRow">
        {Object.entries(fieldsToShow).map(([key, value], i) => (
          <div
            key={key}
            className="lovOption"
            style={{ width: columnWidths[i] || "auto" }}
          >
            {applyHighlight(
              i === 0 ? formatLovId(value, showNegativeIds) : value ?? ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LovOption;
