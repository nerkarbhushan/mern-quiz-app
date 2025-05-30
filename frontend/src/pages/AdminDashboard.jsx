import { useEffect, useState } from "react";
import api from "../services/api.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, categories: [] });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/quiz/stats");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <p className="text-gray-700 mb-6">
          📊 Total Questions in DB: <strong>{stats.total}</strong>
        </p>

        <div>
          <h3 className="text-xl font-semibold mb-2">Questions by Category:</h3>
          <ul className="list-disc pl-6 text-gray-800 space-y-1">
            {stats.categories.map((cat, idx) => (
              <li key={idx}>
                <strong>{cat.category}</strong>: {cat.count} Question
                {cat.count > 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
