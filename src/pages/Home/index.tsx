import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { HTMLAttributes, PropsWithChildren } from "react";
import { FaUniversity } from "react-icons/fa";
import { TbCirclesRelation } from "react-icons/tb";
import {
  FiChevronDown,
  FiClipboard,
  FiFile,
  FiLink,
  FiUser,
} from "react-icons/fi";
import { MdSwitchAccount } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const menus = [
  {
    title: "Universidades",
    icon: FaUniversity,
    goTo: "/university",
  },
  {
    title: "Estudantes",
    icon: FiUser,
    goTo: "/students",
  },
  {
    title: "Disciplinas",
    icon: FiFile,
    goTo: "/subjects",
  },
  {
    title: "Curso",
    icon: FiClipboard,
    goTo: "/course",
  },
];
const relationMenu = [
  {
    title: "Matricula",
    icon: FiLink,
    goTo: "/enrollment",
    type: "relation",
  },
  {
    title: "Cursos - Disciplinas",
    icon: MdSwitchAccount,
    goTo: "/subjectsCourses",
    type: "relation",
  },
  {
    title: "Universidade - Cursos",
    icon: TbCirclesRelation,
    goTo: "/universityCourse",
    type: "relation",
  },
];

export const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Accordion className="w-full">
        <AccordionSummary expandIcon={<FiChevronDown />}>
          <h2 className="text-3xl text-primary">Cadastros</h2>
        </AccordionSummary>
        <AccordionDetails>
          <h3 className="text-2xl text-primary">Básicos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-10 gap-y-5 pt-6">
            {menus.map((menu) => (
              <HomeButton onClick={() => navigate(menu.goTo)} key={menu.title}>
                <menu.icon className="ml-[-1.5rem]" size={35} />
                <span>{menu.title}</span>
              </HomeButton>
            ))}
            <hr className="my-2 col-span-2" />
            <h3 className="col-span-2 text-2xl text-primary">Relações</h3>
            {relationMenu.map((menu) => (
              <HomeButton onClick={() => navigate(menu.goTo)} key={menu.title}>
                <menu.icon className="ml-[-1.5rem]" size={35} />
                <span>{menu.title}</span>
              </HomeButton>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

const HomeButton: React.FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className="text-primary bg-white border-primary border-2 rounded-3xl p-2 w-full min-h-[5rem] flex items-center justify-center gap-4 text-2xl cursor-pointer hover:brightness-90 transition-all"
    >
      {children}
    </div>
  );
};
