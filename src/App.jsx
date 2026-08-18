import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Results from "./pages/Results";
import BookDetails from "./pages/BookDetails";
import MyUmbrella from "./pages/MyUmbrella";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/book/:workKey" element={<BookDetails />} />
        <Route path="/my-umbrella" element={<MyUmbrella />} />
      </Routes>
    </>
  );
}

export default App;
