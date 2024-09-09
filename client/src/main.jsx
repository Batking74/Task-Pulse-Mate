// Importing Modules/Packages
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TaskChecklistPage from './pages/TaskChecklistPage.jsx';
import { registerServiceWorker } from './helpers/helpers.js';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Stylesheet
import './assets/output/main.min.css';

// Creating React Routes
const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    {
      index: true,
      element: <TaskChecklistPage />
    }
  ]
}]);

registerServiceWorker();

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);