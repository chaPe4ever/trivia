import { useSelector } from 'react-redux';
import { selectCorrectQuestionsAndAnswers } from '../store/trivia/trivia.selector';

const ResultPage = () => {
  const correctQuestionsAndAnswers = useSelector(
    selectCorrectQuestionsAndAnswers
  );
  return (
    <div>
      <h2>Results: </h2>
      {correctQuestionsAndAnswers.length === 0 ? 'No correct answers...' : ''}
      {correctQuestionsAndAnswers.map((q) => {
        return (
          <div key={q.question}>
            <p>Question:{q.question}</p>
            <p>Correct Answer: {q.answer}</p>
            <Link to="/">Start over</Link>
          </div>
        );
      })}
    </div>
  );
};

export default ResultPage;
