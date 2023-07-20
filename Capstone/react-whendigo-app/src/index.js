import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, useRoutes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Profile from './Pages/Profile'
import Posts from './Pages/Posts'
import Collections from './Pages/Collections';
import Create from './CRUD/Create'
import Update from './CRUD/Update'
import Delete from './CRUD/Delete'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
      <App/>
      </>
    ),
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/posts',
    element: <Posts/>,
  },
  {
    path: '/collections',
    element: <Collections/>,
  },
  {
    path: '/create',
    element: <Create/>,
  },
  {
    path: '/update',
    element: <Update/>,
  },
  {
    path: '/delete',
    element: <Delete/>,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
