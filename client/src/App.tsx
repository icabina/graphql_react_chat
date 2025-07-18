import Products from "./components/Products";
import Chat from "./components/Chat";
import "./App.css";

function App() {
  return (
    <div>
      <h1>Products</h1>
      <Products />
    </div>
  );
}

export default App;

// npx vite --host=0.0.0.0
// npm run dev
// Visit: http://localhost:5173
