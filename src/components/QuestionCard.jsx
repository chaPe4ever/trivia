import { cn } from '../utils/helpers';

const QuestionCard = ({
  question,
  answers,
  selectedAnswer,
  isDisabled,
  isReviewMode,
  onAnswerClick,
}) => {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center gap-10 rounded-xl border-2 border-amber-200 p-5 text-xl">
      {question && (
        <p dangerouslySetInnerHTML={{ __html: question.question }} />
      )}

      <div className="flex w-full flex-col gap-2 md:cursor-pointer">
        {answers.map((answer) => {
          const isSelected = selectedAnswer === answer;
          const isCorrect = question?.correctAnswer
            ? answer === question.correctAnswer
            : false;
          const isWrongSelected = isSelected && !isCorrect;

          // In review mode, show both wrong and correct answers
          // Otherwise, show normal selection behavior
          const getBackgroundColor = () => {
            if (isReviewMode) {
              if (isCorrect) return 'bg-green-200';
              if (isWrongSelected) return 'bg-rose-200';
              return '';
            }
            // Normal mode
            if (isSelected) {
              return isCorrect ? 'bg-green-200' : 'bg-rose-200';
            }
            return '';
          };

          return (
            <button
              disabled={isDisabled}
              dangerouslySetInnerHTML={{ __html: answer }}
              onClick={(e) => {
                e.preventDefault();
                onAnswerClick(answer);
              }}
              className={cn(
                'w-full rounded-xl border-2 border-amber-500 px-1 py-2 md:cursor-pointer',
                isSelected
                  ? 'border-amber-400'
                  : !isReviewMode && 'hover:bg-amber-100',
                getBackgroundColor(),
                isDisabled &&
                  !isReviewMode &&
                  'cursor-not-allowed bg-gray-100 opacity-50',
                !isDisabled && !isReviewMode && 'hover:bg-amber-100',
                isDisabled && !isReviewMode && 'hover:bg-gray-100',
                isReviewMode && 'cursor-default',
                isDisabled && isReviewMode && 'cursor-not-allowed'
              )}
              key={answer}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
