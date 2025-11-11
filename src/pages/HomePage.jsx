import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTriviaCategories,
  setUserSelectionOptions,
} from '../store/settings/settings.reducer';
import { selectCategories } from '../store/settings/settings.selector';
import { Difficulty, QuestionsType } from '../utils/types';
import { mapCategoryInfo } from '../utils/mappers';
import { cn } from '../utils/utils';

const HomePage = () => {
  const [category, setCategory] = useState('Any Category');
  const [difficulty, setDifficulty] = useState('Any Difficulty');
  const [type, setType] = useState('Any Type');
  const [questionsNumber, setQuestionsNumber] = useState(10);
  const [maxAvailableQuestions, setMaxAvailableQuestions] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
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
      fetchAllCategoriesInfo(categories).then((maxQs) =>
        setMaxAvailableQuestions(maxQs)
      )
    );
  }, []);

  const categories = useSelector(selectCategories);

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

      // selectedCategoryFound will be found if it's not of 'Any Category' option
      const selectedCategoryFound = categories.find(
        (cat) => cat.name === category
      );
      if (selectedCategoryFound) {
        // Fetches categoryInfo of questios count
        const res = await axios.get(
          `https://opentdb.com/api_count.php?category=${selectedCategoryFound.id}`
        );
        const categoryInfo = mapCategoryInfo(res.data);
        maxQs = categoryInfo.questionsCount[difficultyKey];
      } else {
        maxQs = await fetchAllCategoriesInfo(categories);
      }
      setMaxAvailableQuestions(maxQs);

      // Check if the numb of questions is way too many for the available ones
      if (questionsNumber > maxQs) {
        alert(
          `The number of questions you picked is too high. You can pick for your current selected options up to ${maxQs}`
        );
      }
      dispatch(
        setUserSelectionOptions({
          questionsNumber,
          type,
          difficulty,
          category,
        })
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch all the categories info if the category option was of 'Any Category'
  async function fetchAllCategoriesInfo(categories) {
    // extract the key that questionsCount obj expects
    const difficultyKey = Object.values(Difficulty).includes(difficulty)
      ? difficulty.toLowerCase()
      : 'total';

    return await Promise.all(
      categories.map((cat) =>
        axios.get(`https://opentdb.com/api_count.php?category=${cat.id}`)
      )
    )
      .then((response) => {
        const categoriesInfo = response.map((res) => mapCategoryInfo(res.data));

        const maxQs = categoriesInfo
          .map((categoryInfo) => categoryInfo.questionsCount[difficultyKey])
          .reduce((prev, acc) => prev + acc, 0);
        return maxQs;
      })
      .catch((e) => {
        console.error('There was an error fetching the categories info', e);
        throw Error('There was an error fetching the questionsCount', e);
      });
  }

  function onChangeHanlder(e) {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(value);
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
    <div>
      <h1>Welcome to trivia app!</h1>
      <form onSubmit={submitHandler}>
        <h3>To start over please select your desired options</h3>
        <section>
          <label htmlFor="category">Select category: </label>
          <select name="category" value={category} onChange={onChangeHanlder}>
            <option>Any Category</option>
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
