import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Graphql from "./components/Graphql";
import Products from "./components/Products";
import RHF from "./components/RHF";
import Animation from "./components/Animation";
import Gallery from "./components/Gallery";
import DraggablePage from "./components/DraggablePage";
import "./App.css";

function App() {
  const navigate = useNavigate();

  // React Router calls this function with an object like:
  // { isActive: boolean, isPending: boolean, isTransitioning: boolean }
  const getActiveClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

  return (
    <main>
      <nav>
        <ul>
          <li>
            <button onClick={() => navigate("/")}>Home</button>
          </li>
          <li>
            <NavLink to="/products" className={getActiveClass}>
              Products
            </NavLink>
          </li>
          <li>
            {/* Use Link for general links */}
            <NavLink to="/graphql" className={getActiveClass}>
              GraphQL
            </NavLink>
          </li>
          <li>
            <NavLink to="/rhf" className={getActiveClass}>
              RHF
            </NavLink>
          </li>
          <li>
            <NavLink to="/animation" className={getActiveClass}>
              Animation
            </NavLink>
          </li>

          <li>
            <NavLink to="/draggable" className={getActiveClass}>
              Drag & Drop
            </NavLink>
          </li>

          <li>
            <NavLink to="/gallery" className={getActiveClass}>
              Gallery
            </NavLink>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/graphql" element={<Graphql />} />
        <Route path="/rhf" element={<RHF />} />
        <Route path="/animation" element={<Animation />} />
        <Route path="/draggable" element={<DraggablePage />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </main>
  );
}

export default App;

// npx vite --host=0.0.0.0
// npm run dev
// Visit: http://localhost:5173
