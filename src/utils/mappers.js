// Example result (single object)
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
