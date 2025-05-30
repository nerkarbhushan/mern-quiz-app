// src/components/Scorecard.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Scorecard = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/quiz/scorecard");
        setResults(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load results");
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="scorecard">
      <h2 className="text-xl font-bold mb-4">Previous Quiz Results</h2>
      {results.length === 0 ? (
        <p>No previous attempts found.</p>
      ) : (
        <table className="table-auto w-full border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Score</th>
              <th className="p-2">Total</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, index) => (
              <tr key={index} className="text-center border-t">
                <td className="p-2">{res.name}</td>
                <td className="p-2">{res.category}</td>
                <td className="p-2">{res.score}</td>
                <td className="p-2">{res.total}</td>
                <td className="p-2">{new Date(res.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Scorecard;
