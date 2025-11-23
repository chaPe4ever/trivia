import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAnswers,
  selectError,
  selectQuestion,
  selectQuestionProgress,
} from '../store/trivia/trivia.selector';
import {
  setWrongQuestions,
  setQuestionIndex,
  setTriviaQuestions,
  setError,
  clearError,
} from '../store/trivia/trivia.reducer';
import { useNavigate } from 'react-router';
import {
  selectSettings,
  selectToken,
} from '../store/settings/settings.selector';
import { fetchQuestionsFromSettings } from '../utils/api';
import QuestionCard from '../components/QuestionCard';
import { Timer } from 'lucide-react';

const QuestionPage = () => {
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [wrongQuestionsLocal, setWrongQuestionsLocal] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Selectors
  const question = useSelector(selectQuestion);
  const error = useSelector(selectError);
  const answers = useSelector(selectAnswers);
  const questionProgress = useSelector(selectQuestionProgress);
  const settings = useSelector(selectSettings);
  const token = useSelector(selectToken);

  // Use this effect to prevent user from picking quickly answers to avoid getting error from server
  useEffect(() => {
    setIsDisabled(true);
    setTimeRemaining(3);

    const intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeoutId = setTimeout(() => {
      setIsDisabled(false);
      setTimeRemaining(0);
    }, 3000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [question]);

  useEffect(() => {
    let timeoutId;

    if (selectedAnswer) {
      timeoutId = setTimeout(async () => {
        // Check if current question is wrong
        const isWrong =
          question &&
          question.correctAnswer &&
          selectedAnswer !== question.correctAnswer;

        // Build updated wrong questions list (including current if wrong)
        const updatedWrongQuestions = isWrong
          ? [
              ...wrongQuestionsLocal,
              {
                ...question,
                userSelectedAnswer: selectedAnswer,
              },
            ]
          : wrongQuestionsLocal;

        // Update local state
        if (isWrong) {
          setWrongQuestionsLocal(updatedWrongQuestions);
        }

        // Check if there are more questions
        const hasMoreQuestions =
          questionProgress.index + 1 < questionProgress.questionsNumber;

        if (hasMoreQuestions) {
          const nextQuestionIndex = questionProgress.index + 1;

          // Fetch the next question based on user selection
          const questions = await fetchQuestionsFromSettings({
            triviaSettings: settings,
            token,
          }).catch((error) => {
            dispatch(setError(error));
            console.error('Error fetching questions', error);
            return null; // Return null to prevent further processing
          });

          // Only proceed if questions were fetched successfully
          if (questions) {
            dispatch(clearError()); // Clear any previous errors
            // Save the questions to store
            dispatch(setQuestionIndex(nextQuestionIndex));
            dispatch(setTriviaQuestions(questions));
          }
          setSelectedAnswer(null);
        } else {
          // Last question - proceed to results with all wrong questions
          dispatch(setWrongQuestions(updatedWrongQuestions));
          navigate('/result');
        }
      }, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
    // Only run when selectedAnswer changes - other dependencies are intentionally omitted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnswer]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5 p-10">
      <div className="flex items-center gap-3 text-xl font-bold">
        <span>
          Question:
          {questionProgress?.index !== undefined &&
          questionProgress?.questionsNumber
            ? ` ${questionProgress.index + 1}/${questionProgress.questionsNumber}`
            : ' Loading...'}
        </span>
        {isDisabled && timeRemaining > 0 && (
          <div className="flex items-center gap-2 text-amber-600">
            <Timer className="h-5 w-5 animate-pulse" />
            <span>{timeRemaining}s</span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          {error.status && (
            <p className="text-sm">
              {error.status === 429 &&
                'Too many requests. Please wait a moment and try again'}
            </p>
          )}
        </div>
      )}

      {question &&
      Object.keys(question).length > 0 &&
      answers &&
      answers.length > 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-5">
          <QuestionCard
            question={question}
            answers={answers}
            selectedAnswer={selectedAnswer}
            isDisabled={isDisabled}
            isReviewMode={false}
            onAnswerClick={setSelectedAnswer}
          />
        </div>
      ) : (
        <div className="text-lg">Loading question...</div>
      )}
    </div>
  );
};

export default QuestionPage;
