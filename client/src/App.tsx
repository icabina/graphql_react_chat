import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Graphql from "./components/Graphql";
import Products from "./components/Products";
import "./App.css";

function App() {
  const navigate = useNavigate();

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
            {/* Use Link for general links */}
            <NavLink to="/graphql" className={getActiveClass}>
              GraphQL
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={getActiveClass}>
              Products
            </NavLink>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphql" element={<Graphql />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </main>
  );
}

export default App;

// npx vite --host=0.0.0.0
// npm run dev
// Visit: http://localhost:5173
