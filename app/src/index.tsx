import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Location from "./pages/Location";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/location" element={<Location />}/>
        <Route path="/" element={<Location />}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
