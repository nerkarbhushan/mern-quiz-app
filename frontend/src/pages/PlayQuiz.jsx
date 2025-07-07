import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const PlayQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showScore, setShowScore] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, startQuizTimer, resetTimer, timeLeft } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const category = searchParams.get("category");

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/quiz?category=${category}`);
      setQuestions(res.data);
      setIndex(0);
      setScore(0);
      setSelectedAnswer("");

      localStorage.setItem(
        "quizState",
        JSON.stringify({
          category,
          index: 0,
          score: 0,
          questions: res.data,
        })
      );

      startQuizTimer();
    } catch (err) {
      console.error("Failed to load quiz", err);
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quizState"));
    if (stored && stored.category === category) {
      setQuestions(stored.questions || []);
      setIndex(stored.index || 0);
      setScore(stored.score || 0);
      if (stored.quizFinished) setShowScore(true);
    } else {
      fetchQuestions();
    }
  }, [category]);

  useEffect(() => {
    if (timeLeft === 0 && !showScore && questions.length > 0) {
      const stored = JSON.parse(localStorage.getItem("quizState"));
      const finalScore = stored?.score || score;

      setScore(finalScore);
      setShowScore(true);

      localStorage.setItem(
        "quizState",
        JSON.stringify({
          category,
          index,
          score: finalScore,
          questions,
          quizFinished: true,
          submitted: true,
        })
      );

      if (typeof resetTimer === "function") resetTimer();

      (async () => {
        try {
          await api.post("/results", {
            score: finalScore,
            total: questions.length,
            category: questions[0]?.category || "general",
          });
        } catch (err) {
          console.error("Auto-submit failed:", err);
        }
      })();
    }
  }, [timeLeft, showScore, questions.length]);

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      toast.warn("Please select an option.");
      return;
    }

    const isCorrect = selectedAnswer === questions[index]?.correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;
    const nextIndex = index + 1;

    if (nextIndex < questions.length) {
      setIndex(nextIndex);
      setScore(updatedScore);
      setSelectedAnswer("");

      localStorage.setItem(
        "quizState",
        JSON.stringify({
          category,
          index: nextIndex,
          score: updatedScore,
          questions,
          quizFinished: false,
        })
      );
    } else {
      setScore(updatedScore);
      setShowScore(true);
      setSelectedAnswer("");

      localStorage.setItem(
        "quizState",
        JSON.stringify({
          category,
          index: nextIndex,
          score: updatedScore,
          questions,
          quizFinished: true,
          submitted: true,
        })
      );

      if (typeof resetTimer === "function") resetTimer();

      try {
        await api.post("/results", {
          score: updatedScore,
          total: questions.length,
          category: questions[0]?.category || "general",
        });
      } catch (err) {
        console.error("Failed to save quiz result:", err);
      }
    }
  };

  useEffect(() => {
    if (questions.length && !showScore) {
      const stored = JSON.parse(localStorage.getItem("quizState"));
      if (!stored?.quizFinished) {
        localStorage.setItem(
          "quizState",
          JSON.stringify({
            category,
            index,
            score,
            questions,
          })
        );
      }
    }
  }, [index, score, questions, category, showScore]);

  if (!questions.length) {
    return (
      <div className="text-center mt-20 text-gray-700">
        No questions available in this category.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
        {/* <p className="text-sm text-gray-600 mb-4">
          ⏳ Time Left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </p> */}
        {showScore ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              Your Score: {score} / {questions.length}
            </h2>
            <button
              onClick={() => {
                localStorage.removeItem("quizState");
                navigate("/user");
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Q{index + 1}. {questions[index]?.questionText}
            </h3>
            <div className="space-y-3 mb-4">
              {questions[index]?.options.map((opt, i) => (
                <label
                  key={i}
                  className={`block p-2 border rounded cursor-pointer ${
                    selectedAnswer === opt
                      ? "bg-blue-200 border-blue-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="option"
                    value={opt}
                    checked={selectedAnswer === opt}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="mr-2 bg-green-300"
                    disabled={timeLeft === 0 || showScore}
                  />
                  {String.fromCharCode(65 + i)}. {opt}
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || timeLeft === 0 || showScore}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Answer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayQuiz;
