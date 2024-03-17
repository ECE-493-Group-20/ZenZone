import ReactDOM from "react-dom/client";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Location from "./pages/Location";
import Main from "./App";

export default function App() {
  //<Route path="/location" element={<Location />}/>
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Main />}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);