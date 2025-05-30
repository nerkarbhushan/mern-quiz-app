import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Scores = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const res = await api.get("/results/all");
      setResults(res.data);
    } catch (error) {
      console.error("Failed to fetch all results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this result?</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/results/${id}`);
                  setResults((prev) => prev.filter((r) => r._id !== id));
                  toast.success("Record deleted successfully..!!");
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Failed to delete result"
                  );
                } finally {
                  closeToast(); // close confirmation toast
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false, // don't auto-dismiss
        closeOnClick: false,
        closeButton: false,
        position: "top-center",
      }
    );
  };

  if (loading)
    return <div className="text-center mt-10">Loading results...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">📊 All User Quiz Results</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Score</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {r.name || r.user?.username || "Unknown"}
                </td>
                <td className="p-2 border">{r.category}</td>
                <td className="p-2 border">{r.score}</td>
                <td className="p-2 border">{r.total}</td>
                <td className="p-2 border">
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scores;
