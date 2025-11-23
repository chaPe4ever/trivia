import { useSelector } from 'react-redux';
import { selectWrongQuestions } from '../store/trivia/trivia.selector';
import { Link } from 'react-router';
import QuestionCard from '../components/QuestionCard';

const ResultPage = () => {
  const wrongQuestions = useSelector(selectWrongQuestions);

  // Helper function to get all answers (incorrect + correct) sorted
  const getAllAnswers = (question) => {
    const answers = [...question.incorrectAnswers, question.correctAnswer];
    return answers.sort();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 p-10">
      {wrongQuestions && wrongQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-bold">
            Congratulations! You got all questions correct!
          </p>
          <Link
            to="/"
            className="mt-4 rounded-xl border-2 bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
          >
            Start over
          </Link>
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col gap-8">
            <h2 className="text-2xl font-bold">
              Here are the questions you got wrong with the correct answers:
            </h2>
            {wrongQuestions &&
              wrongQuestions.map((question, index) => (
                <div
                  key={`${question.question}-${index}`}
                  className="flex w-full flex-col items-center"
                >
                  <div className="mb-2 text-lg font-semibold">
                    Question {index + 1}:
                  </div>
                  <QuestionCard
                    question={question}
                    answers={getAllAnswers(question)}
                    selectedAnswer={question.userSelectedAnswer}
                    isDisabled={true}
                    isReviewMode={true}
                  />
                </div>
              ))}
          </div>
          <Link
            to="/"
            className="mt-4 rounded-xl border-2 bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
          >
            Start over
          </Link>
        </>
      )}
    </div>
  );
};

export default ResultPage;
