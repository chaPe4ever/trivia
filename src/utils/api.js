import axios from 'axios';
import { mapCategoryInfo, mapTriviaQuestion } from './mappers';
import { Difficulty } from './types';
import { generateTriviaSearchQuery } from './helpers';

const api = axios.create({
  baseURL: 'https://opentdb.com/',
});

export default api;

export const fetchToken = async () => {
  const res = await api.get('api_token.php?command=request');
  const token = res.data.token;
  return token;
};

export const fetchCategoryInfo = async (id) => {
  const res = await api.get(`api_count.php?category=${id}`);
  const categoryInfo = mapCategoryInfo(res.data);
  return categoryInfo;
};

export async function fetchAllCategoriesInfoFromCatId(catIds) {
  return await Promise.all(
    catIds.map((id) => api.get(`api_count.php?category=${id}`))
  )
    .then((response) => {
      return response.map((res) => mapCategoryInfo(res.data));
    })
    .catch((e) => {
      console.error('There was an error fetching the categories info', e);
      throw Error('There was an error fetching the questionsCount', e);
    });
}

export const fetchQuestionsFromSettings = async ({ triviaSettings, token }) => {
  const triviaQuery = generateTriviaSearchQuery({
    triviaQuerySettings: {
      ...triviaSettings,
      token,
    },
  });
  const res = await api.get(`api.php?${triviaQuery}`);
  const questions = res.data.results.map((q) => mapTriviaQuestion(q));
  return questions;
};
