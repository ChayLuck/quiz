import './App.css';
import {Route, Routes} from "react-router-dom";
import NavBar from "./pages/NavBar";
import SignUpPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <div className="App">
        <NavBar/>
      <Routes>
          <Route path="/SignUp" element={<SignUpPage/>} />
          <Route path="/" element={<MainPage/>} />
          <Route path="/Home" element={<HomePage/>} />
          <Route path="/Quiz" element={<QuizPage/>} />
          <Route path="/Result" element={<ResultPage/>} />
      </Routes>
    </div>
  );
}

export default App;