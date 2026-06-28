import './bootstrap';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './Pages/HomePage';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ReportsIndex from './Pages/ReportsIndex';

import CreateExam from './Pages/Exams/CreateExam';

import ExamsIndex from './Pages/Exams/ExamsIndex';
//import ExamResults from './Pages/Exams/ExamResults';
import ShowExam from './Pages/Exams/ShowExam';
import EditExam from './Pages/Exams/EditExam';
import TakeExam from './Pages/Exams/TakeExam';

import QuestionsIndex from './Pages/Questions/QuestionsIndex';
import CreateQuestion from './Pages/Questions/CreateQuestion';
import EditQuestion from './Pages/Questions/EditQuestion';


import '../css/app.css';


const theme = createTheme({
     direction: 'rtl',
});

const components = {
     HomePage,
     Login,
     Register,
     Dashboard,
     ReportsIndex,
     CreateExam,
     ExamsIndex,
     //ExamResults,
     ShowExam,
     EditExam,
     TakeExam,
     QuestionsIndex,
     CreateQuestion,
     EditQuestion
};

const pageName = window.pageName || 'HomePage';
const pageProps = window.pageProps || {};

const Component = components[pageName];
if (!Component) {
     console.error(`Component "${pageName}" not found. Available: ${Object.keys(components).join(', ')}`);
     throw new Error(`Page component "${pageName}" not found.`);
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
     <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
     </ThemeProvider>
)