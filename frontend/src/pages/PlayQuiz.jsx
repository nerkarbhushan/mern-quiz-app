import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext";

const PlayQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, startQuizTimer, resetTimer } = useContext(AuthContext);
  const navigate = useNavigate();

  const category = searchParams.get("category");

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/quiz?category=${category}`);
      setQuestions(res.data);
      setIndex(0);
      setScore(0);

      localStorage.setItem(
        "quizState",
        JSON.stringify({
          category,
          index: 0,
          score: 0,
          questions: res.data,
        })
      );

      startQuizTimer(); // 🔁 Start timer on fresh load
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
      if (stored.quizFinished) {
        setShowScore(true);
      }
    } else {
      fetchQuestions();
    }
  }, [category]);

  const handleAnswer = async (ans) => {
    if (!questions[index]) return;

    const isCorrect = ans === questions[index].correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;

    const nextIndex = index + 1;

    if (nextIndex < questions.length) {
      setIndex(nextIndex);
      setScore(updatedScore);

      localStorage.setItem(
        "quizState",
        JSON.stringify({
          category,
          index: nextIndex,
          score: updatedScore,
          questions,
        })
      );
    } else {
      // ✅ Final question answered
      setShowScore(true);
      localStorage.setItem(
        "quizState",
        JSON.stringify({
          category,
          index,
          score: updatedScore,
          questions,
          quizFinished: true, // <-- store completion status
        })
      );

      if (typeof resetTimer === "function") {
        resetTimer();
      }

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
        {showScore ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              Your Score: {score} / {questions.length}
            </h2>
            {showScore && (
              <button
                onClick={() => {
                  localStorage.removeItem("quizState");
                  navigate("/user");
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Go to Home
              </button>
            )}
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Q{index + 1}.{questions[index].questionText}
            </h3>
            <div className="space-y-3">
              {questions[index].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="block w-full bg-blue-100 p-2 rounded hover:bg-blue-200"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayQuiz;
