import { FaUniversity } from "react-icons/fa";
import { FiClipboard, FiFile, FiLink, FiUser } from "react-icons/fi";
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
    title: "Matricula",
    icon: FiLink,
    goTo: "/enrollment",
  },
  {
    title: "Curso",
    icon: FiClipboard,
    goTo: "/course",
  },
];

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-10 pt-6">
      {menus.map((menu) => (
        <div
          className="text-primary bg-white border-primary border-2 rounded-3xl p-2 w-full min-h-[10rem] flex items-center justify-center gap-6 text-3xl cursor-pointer hover:brightness-90 transition-all"
          onClick={() => navigate(menu.goTo)}
          key={menu.title}
        >
          <menu.icon className="ml-[-1.5rem]" size={45} />
          <span>{menu.title}</span>
        </div>
      ))}
    </div>
  );
};
