import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Courses } from "../pages/Course";
import { Enrollment } from "../pages/Enrollment";
import { Home } from "../pages/Home";
import { Subjects } from "../pages/Subjects";
import { Universities } from "../pages/Universities";
import { Auth } from "./layers/Auth";
import { BaseLayout } from "./layouts/BaseLayout";
import { Students } from "../pages/Students";
import { SubjectCourses } from "../pages/SubjectCourse";

export const AppRoutes = () => (
  <BrowserRouter>
    <Auth>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/university" element={<Universities />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/course" element={<Courses />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/students" element={<Students />} />
          <Route path="/subjectsCourses" element={<SubjectCourses />} />
        </Route>
      </Routes>
    </Auth>
  </BrowserRouter>
);
