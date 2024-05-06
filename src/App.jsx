import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoursesList from "./component/CoursesList";
import CourseHome from "./component/CourseHome";
import StudentDashboard from "./component/StudentDashboard";
import Landing from "./component/Landing";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<CoursesList />} />
            <Route path="/course" element={<CourseHome />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
