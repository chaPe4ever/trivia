import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Difficulty, QuestionsType } from './types';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const getEnumKey = (enumObj, value) => {
  return Object.keys(enumObj).find((key) => enumObj[key] === value);
};

export function generateTriviaSearchQuery({ triviaQuerySettings }) {
  const { token, type, difficulty, category } = triviaQuerySettings;

  const params = new URLSearchParams({
    // always search for 1 question
    amount: 1,
    token: token,
  });

  const typeKey = getEnumKey(QuestionsType, type);
  if (typeKey) {
    params.append('type', typeKey.toLowerCase()); // 'multiple' or 'boolean'
  }

  const difficultyKey = getEnumKey(Difficulty, difficulty);
  if (difficultyKey) {
    params.append('difficulty', difficultyKey.toLowerCase()); // 'easy', 'medium', 'hard'
  }

  if (category.id) {
    params.append('category', category.id);
  }

  const query = params.toString();

  return query;
}
