import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAnswers,
  selectQuestion,
  selectQuestionProgress,
} from '../store/trivia/trivia.selector';
import {
  setCorrectQuestionsAndAnswers,
  setQuestionIndex,
  setTriviaQuestions,
} from '../store/trivia/trivia.reducer';
import { cn } from '../utils/helpers';
import { useNavigate } from 'react-router';
import {
  selectSettings,
  selectToken,
} from '../store/settings/settings.selector';
import { fetchQuestionsFromSettings } from '../utils/api';

const QuestionPage = () => {
  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [correctQanadAs, setCorrectQanadAs] = useState([]);

  // Selectors
  const question = useSelector(selectQuestion);
  const answers = useSelector(selectAnswers);
  const questionProgress = useSelector(selectQuestionProgress);
  const settings = useSelector(selectSettings);
  const token = useSelector(selectToken);

  // Use this effect to prevent user from picking quickly answers to avoid getting error from server
  useEffect(() => {
    setIsDisabled(true);
    const timeoutId = setTimeout(() => setIsDisabled(false), 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [question]);

  // Redirect if user reloaded and state was lost
  useEffect(() => {
    if (!question || Object.keys(question).length === 0) {
      alert(
        "Unfortunatelly the app should start from the begining as it doesn't support page refresh"
      );
      navigate('/');
    }
  }, [questionProgress]);

  useEffect(() => {
    let timeoutId;

    if (selectedAnswer) {
      timeoutId = setTimeout(() => {
        // Proceed to next question
        if (questionProgress.index + 1 < questionProgress.questionsNumber) {
          const nextQuestionIndex = questionProgress.index + 1;

          if (selectedAnswer === question.correctAnswer) {
            const question = question.question;

            setCorrectQanadAs([
              ...correctQanadAs,
              { question, anser: selectedAnswer },
            ]);
          }
          dispatch(setQuestionIndex(nextQuestionIndex));
          // Fetch the question based on user selection
          const questions = fetchQuestionsFromSettings({
            triviaSettings: settings,
            token,
          });
          // Save the questions to store
          dispatch(setTriviaQuestions(questions));
        } else {
          // proceed to results
          dispatch(setCorrectQuestionsAndAnswers(correctQanadAs));
          navigate('/result');
        }
      }, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedAnswer]);

  return (
    <div>
      <div>
        Question:
        {`${questionProgress.index + 1}/${questionProgress.questionsNumber}`}
      </div>

      {question && (
        <p dangerouslySetInnerHTML={{ __html: question.question }} />
      )}

      <div className="flex flex-col gap-2 md:cursor-pointer">
        {answers.map((answer) => (
          <button
            disabled={isDisabled}
            dangerouslySetInnerHTML={{ __html: answer }}
            onClick={(e) => {
              e.preventDefault();
              setSelectedAnswer(answer);
            }}
            className={cn(
              'rounded-xl border-2 px-1 py-2 hover:bg-amber-100 md:cursor-pointer',
              selectedAnswer === answer
                ? 'border-amber-400'
                : 'hover:bg-amber-100',
              selectedAnswer === answer
                ? selectedAnswer === question.correctAnswer
                  ? 'bg-green-200'
                  : 'bg-rose-200'
                : '',
              isDisabled ? 'bg-gray-200 hover:bg-gray-200' : ''
            )}
            key={answer}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionPage;
