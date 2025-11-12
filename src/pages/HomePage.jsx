import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setToken,
  setTriviaCategories,
  setTriviaSettings,
} from '../store/settings/settings.reducer';
import { selectCategories } from '../store/settings/settings.selector';
import { Difficulty, QuestionsType } from '../utils/types';
import { cn } from '../utils/helpers';
import {
  setQuestionIndex,
  setTriviaQuestions,
} from '../store/trivia/trivia.reducer';
import { useNavigate } from 'react-router';
import {
  fetchAllCategoriesInfoFromCatId,
  fetchCategoryInfo,
  fetchQuestionsFromSettings,
  fetchToken,
} from '../utils/api';

const HomePage = () => {
  // Hooks
  const [category, setCategory] = useState('Any Category');
  const [difficulty, setDifficulty] = useState('Any Difficulty');
  const [type, setType] = useState('Any Type');
  const [questionsNumber, setQuestionsNumber] = useState(10);
  const [maxAvailableQuestions, setMaxAvailableQuestions] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTriviaCategoriesAsync() {
      try {
        setIsLoading(true);
        const res = await axios.get('https://opentdb.com/api_category.php');
        const triviaCategories = res.data['trivia_categories'];
        dispatch(setTriviaCategories(triviaCategories));
        return triviaCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        console.error('Error response:', error.response);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTriviaCategoriesAsync().then((categories) =>
      fetchAllCategoriesInfoFromCatId(categories.map((cat) => cat.id)).then(
        (maxQs) => setMaxAvailableQuestions(maxQs)
      )
    );
  }, []);

  // Selectors
  const categories = useSelector(selectCategories);

  // Functions
  async function submitHandler(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Validation Checks

      let maxQs = maxAvailableQuestions;
      // extract the key that questionsCount obj expects
      const difficultyKey = Object.values(Difficulty).includes(difficulty)
        ? difficulty.toLowerCase()
        : 'total';

      // userSelectedCat will be found if it's not of 'Any Category' option
      const userSelectedCat = categories.find((cat) => cat.name === category);

      if (userSelectedCat) {
        // Fetches categoryInfo of questios count
        const categoryInfo = fetchCategoryInfo(userSelectedCat.id);

        maxQs = categoryInfo.questionsCount[difficultyKey];
      } else {
        const categoriesInfo = fetchAllCategoriesInfoFromCatId(
          categories.map((cat) => cat.id)
        );

        maxQs = categoriesInfo
          .map((categoryInfo) => categoryInfo.questionsCount[difficultyKey])
          .reduce((prev, acc) => prev + acc, 0);
      }
      setMaxAvailableQuestions(maxQs);

      // Check if the numb of questions is way too many for the available ones
      if (questionsNumber > maxQs) {
        alert(
          `The number of questions you picked is too high. You can pick for your current selected options up to ${maxQs}`
        );
      }
      const token = await fetchToken();
      dispatch(setToken(token));
      const triviaSettings = {
        questionsNumber,
        type,
        difficulty,
        category: userSelectedCat ? { ...userSelectedCat } : {},
      };

      dispatch(setTriviaSettings(triviaSettings));

      // Fetch the questions based on user selection
      const questions = await fetchQuestionsFromSettings({
        triviaSettings,
        token,
      });
      // Save the questions to store
      dispatch(setTriviaQuestions(questions));
      // Start the game with an initial index
      dispatch(setQuestionIndex(0));
      // Navigate to the question page begining with the first question in the list
      navigate('/question');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  function onChangeHanlder(e) {
    e.preventDefault();
    const { name, value } = e.target;

    switch (name) {
      case 'category':
        setCategory(value);
        break;
      case 'difficulty':
        setDifficulty(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'questions-number':
        setQuestionsNumber(value);
        break;

      default:
        throw Error(`There is an unhandled case of: ${name}`);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl font-extrabold">Welcome to trivia app!</h1>
      <form
        className="flex flex-col gap-4 border-2 border-amber-200 p-2"
        onSubmit={submitHandler}
      >
        <h3 className="mb-2">
          To start over please select your desired options
        </h3>
        <section>
          <label htmlFor="category">Select category: </label>
          <select name="category" value={category} onChange={onChangeHanlder}>
            <option className="border-2 border-amber-100 bg-amber-200">
              Any Category
            </option>
            {categories &&
              categories.map((cat) => <option key={cat.id}>{cat.name}</option>)}
          </select>
        </section>
        <section>
          <label htmlFor="difficulty">Select difficulty: </label>
          <select
            name="difficulty"
            value={difficulty}
            onChange={onChangeHanlder}
          >
            <option>Any Difficulty</option>
            {Object.entries(Difficulty).map(([key, value]) => {
              return <option key={key}>{value}</option>;
            })}
          </select>
        </section>
        <section>
          <label htmlFor="type">Select question type: </label>
          <select name="type" value={type} onChange={onChangeHanlder}>
            <option>Any Type</option>
            {Object.entries(QuestionsType).map(([key, value]) => {
              return <option key={key}>{value}</option>;
            })}
          </select>
        </section>
        <section>
          <label>Select number of questions: </label>
          <input
            className={cn(isLoading && 'cursor-not-allowed opacity-60')}
            type="number"
            name="questions-number"
            min={1}
            value={questionsNumber}
            disabled={isLoading}
            onChange={onChangeHanlder}
          />
        </section>
        <button
          className={cn(
            'rounded-xl border-2 bg-amber-500 px-1 py-2 transition-opacity',
            isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          )}
          type="submit"
          disabled={isLoading}
        >
          Start
        </button>
      </form>
    </div>
  );
};

export default HomePage;
