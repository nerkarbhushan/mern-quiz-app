import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UploadQuiz from "./pages/UploadQuiz";
import UserDashboard from "./pages/UserDashboard";
import PlayQuiz from "./pages/PlayQuiz";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Scores from "./pages/Scores";
import Scorecard from "./components/Scorecard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute role="admin">
                <UploadQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/scores"
            element={
              <ProtectedRoute role="admin">
                <Scores />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route
            path="/user"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/quiz"
            element={
              <ProtectedRoute role="user">
                <PlayQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/scorecard"
            element={
              <ProtectedRoute role="user">
                <Scorecard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
