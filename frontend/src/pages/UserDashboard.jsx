import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/quiz/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/results");
        console.log("Fetched quiz results:", res.data);
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
    fetchHistory();
  }, []);

  const handleStartQuiz = () => {
    if (!selectedCategory) return toast.error("Please select a category");
    navigate(`/user/quiz?category=${selectedCategory}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-3xl font-bold mb-6">Welcome, {user?.name} 👋</h2>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">📜 Quiz History</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {history.map((h, i) => (
              <li key={i}>
                {h.category} - Score: {h.score}/{h.total} (
                {new Date(h.date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6">
          <div className="p-6 border rounded-lg bg-blue-50">
            <h3 className="text-xl font-semibold mb-2">
              Ready to test your knowledge?
            </h3>

            <label className="block mb-2 text-gray-700 font-semibold">
              Select Category:
            </label>
            <select
              className="mb-4 p-2 border w-full rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Select --</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
