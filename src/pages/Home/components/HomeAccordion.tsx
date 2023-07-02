import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { PropsWithChildren } from "react";
import { FiChevronDown } from "react-icons/fi";

type HomeAccordionVariants = "ERROR" | "SUCCESS" | "STANDARD";
interface HomeAccordionProps {
  succeess?: boolean;
  variant?: HomeAccordionVariants;
  title?: string;
}

const homeStyling: Record<HomeAccordionVariants, string> = {
  ERROR: "text-error",
  STANDARD: "text-primary",
  SUCCESS: "text-green-600",
};

export const HomeAccordion: React.FC<PropsWithChildren<HomeAccordionProps>> = ({
  children,
  title,
  variant = "STANDARD",
}) => {
  const style = homeStyling[variant];
  return (
    <Accordion className="w-full">
      <AccordionSummary
        expandIcon={<FiChevronDown />}
        className={`text-lg font-bold ${style}`}
      >
        {title ?? ""}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};
