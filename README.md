# Trivia App

A modern, interactive trivia quiz application built with React and Redux. Test your knowledge across various categories, difficulties, and question types using questions from the Open Trivia Database API.

## Features

- **Customizable Quiz Settings**
  - Select from multiple categories or choose "Any Category"
  - Choose difficulty level (Easy, Medium, Hard, or Any)
  - Select question type (Multiple Choice, True/False, or Any)
  - Set the number of questions (1-50+)

- **Smart Question Management**
  - Rate limiting protection with cooldown timer between questions
  - Automatic question fetching for each new question
  - Progress tracking (current question / total questions)

- **Results & Review**
  - View all incorrectly answered questions
  - See your selected answer vs. the correct answer
  - Review mode with highlighted correct/incorrect answers

- **State Management**
  - Redux Toolkit for centralized state management
  - Redux Persist for state persistence across sessions
  - Reselect for optimized selectors

- **Modern UI**
  - Beautiful, responsive design with Tailwind CSS
  - Smooth transitions and hover effects
  - Accessible form inputs with focus states

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux Toolkit, Redux Persist
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **API**: [Open Trivia Database](https://opentdb.com/)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd trivia-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

```
trivia-app/
├── src/
│   ├── components/          # Reusable React components
│   │   └── QuestionCard.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx     # Quiz configuration page
│   │   ├── QuestionPage.jsx # Quiz question page
│   │   └── ResultPage.jsx  # Results and review page
│   ├── store/              # Redux store configuration
│   │   ├── settings/       # Settings reducer and selectors
│   │   ├── trivia/         # Trivia reducer and selectors
│   │   ├── root-reducer.js
│   │   └── store.js
│   ├── utils/              # Utility functions
│   │   ├── api.js          # API calls
│   │   ├── helpers.js      # Helper functions
│   │   ├── mappers.js      # Data transformation
│   │   └── types.js        # Type definitions
│   ├── App.jsx             # Main app component
│   ├── App.css
│   ├── index.css
│   └── main.jsx            # App entry point
├── public/                 # Static assets
├── package.json
├── vite.config.js
└── README.md
```

## How It Works

1. **Home Page**: Configure your quiz preferences
   - Select category, difficulty, type, and number of questions
   - The app validates available questions based on your selections
   - Click "Start" to begin the quiz

2. **Question Page**: Answer questions
   - Each question displays with shuffled answer options
   - A 3-second cooldown prevents rapid clicking (rate limiting protection)
   - After selecting an answer, the next question loads automatically
   - Wrong answers are tracked for review

3. **Result Page**: Review your performance
   - See all questions you answered incorrectly
   - Compare your selected answer with the correct answer
   - Click "Start over" to begin a new quiz

## API Integration

This app uses the [Open Trivia Database API](https://opentdb.com/), which provides:

- Free, user-contributed trivia questions
- Multiple categories and difficulty levels
- Rate limiting (429 status code) - handled gracefully in the app

## State Management

The app uses Redux Toolkit with the following state slices:

- **Settings**: User preferences (category, difficulty, type, questions number, token)
- **Trivia**: Quiz state (questions, current index, wrong questions, errors)

State is persisted using Redux Persist, so your quiz progress survives page refreshes.

## Error Handling

The app includes robust error handling:

- API rate limiting (429 errors) with user-friendly messages
- Network errors with proper error states
- Non-serializable error objects are properly transformed for Redux

## Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Important: Client-Side Routing Configuration

When deploying a React Router SPA, you need to configure your server to serve `index.html` for all routes. Otherwise, direct navigation to routes like `/question` or `/result` will result in a 404 error.

The project includes configuration files for common hosting platforms:

- **Vercel**: Uses `vercel.json` (already included)
- **Netlify**: Uses `netlify.toml` or `public/_redirects` (both included)
- **Nginx**: Add this to your server config:
  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

**Which file to use:**

- If hosting on **Vercel**: The `vercel.json` file will be automatically used
- If hosting on **Netlify**: The `netlify.toml` file will be automatically used
- If hosting on **GitHub Pages**: You may need to use a 404.html workaround or configure redirects in repository settings

After deploying, test that direct navigation to `/question` or `/result` works correctly.

## License

This project is open source and available for educational purposes.
