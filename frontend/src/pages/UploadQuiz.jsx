import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api.js";

const UploadQuiz = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/admin/upload", formData);
      toast.success("File uploaded successfully");
      // alert("File uploaded successfully");
    } catch (err) {
      // alert("Upload failed");
      toast.error("Upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 px-4">
      <div className="bg-white border border-blue-100 p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          📄 Upload Quiz Excel File
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose your `.xlsx` or `.xls` file:
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
          />
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white font-medium py-2 px-4 rounded-md shadow-sm mt-4"
        >
          ⬆️ Upload File
        </button>
      </div>
    </div>
  );
};

export default UploadQuiz;
