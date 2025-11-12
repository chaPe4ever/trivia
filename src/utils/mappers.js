// Example result category question count lookup
// {
//     "category_id": 9,
//     "category_question_count": {
//       "total_question_count": 401,
//       "total_easy_question_count": 191,
//       "total_medium_question_count": 147,
//       "total_hard_question_count": 63
//     }
// }
export const mapCategoryInfo = (apiResponse) => {
  return {
    id: apiResponse.category_id,
    questionsCount: {
      total: apiResponse.category_question_count.total_question_count,
      easy: apiResponse.category_question_count.total_easy_question_count,
      medium: apiResponse.category_question_count.total_medium_question_count,
      hard: apiResponse.category_question_count.total_hard_question_count,
    },
  };
};

// Example result trivia question
// {
//     "type": "multiple",
//     "difficulty": "easy",
//     "category": "Entertainment: Video Games",
//     "question": "The &quot;Day of Defeat&quot; series of games take place during which war?",
//     "correct_answer": "World War II",
//     "incorrect_answers": [
//       "World War I",
//       "Vietnam War",
//       "Iraq War"
//     ]
//   },

export const mapTriviaQuestion = (apiResponse) => {
  return {
    type: apiResponse.type,
    difficulty: apiResponse.difficulty,
    categoryName: apiResponse.category,
    question: apiResponse.question,
    correctAnswer: apiResponse.correct_answer,
    incorrectAnswers: apiResponse.incorrect_answers,
  };
};
