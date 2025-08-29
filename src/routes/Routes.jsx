import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import RecipeDetails from "../pages/RecipeDetails.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipe/:id" element={<RecipeDetails />} />
    </Routes>
  );
}
