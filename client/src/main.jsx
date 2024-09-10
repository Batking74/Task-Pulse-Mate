// Importing Modules/Packages
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TaskChecklistPage from './pages/TaskChecklistPage.jsx';
import { registerServiceWorker } from './helpers/helpers.js';
import { createRoot } from 'react-dom/client';
import ErrorPage from './pages/ErrorPage.jsx';
import App from './App.jsx';

// Stylesheet
import './assets/output/main.min.css';

// Creating React Routes
const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  errorElement: <ErrorPage />, // This handles errors within the route
  children: [
    {
      index: true,
      element: <TaskChecklistPage />
    },
    {
      path: '*',
      element: <ErrorPage /> // This handles unmatched routes
    }
  ]
}]);

registerServiceWorker();

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);