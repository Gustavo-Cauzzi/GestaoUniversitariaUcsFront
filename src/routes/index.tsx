import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Auth } from "./layers/Auth";
import { BaseLayout } from "./layouts/BaseLayout";

export const AppRoutes = () => (
  <BrowserRouter>
    <Auth>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/person" element={<Pessoas />} />
          <Route path="/projects" element={<Projetos />} />
          <Route path="/results" element={<Results />} /> */}
        </Route>
      </Routes>
    </Auth>
  </BrowserRouter>
);
