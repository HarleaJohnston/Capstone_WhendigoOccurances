import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, useRoutes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Posts from './Pages/Posts'
import Collections from './Pages/Collections';
import Create from './CRUD/Create'
import Update from './CRUD/Update'
import Delete from './CRUD/Delete'
import Login from './Pages/Login';
import Signup from './Pages/Signup'
import Error from './ErrorPages/Error';
import Error2 from './ErrorPage/Error2';
import UserProfile from './Pages/UserProfile';
import UpdateUser from './CRUD/UpdateUser';
import UserDisplay from './Pages/UserDisplay';
import CookieClicker from './Souls/CookieClicker';

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
    path: '/update/:itemId',
    element: <Update/>,
  },
  {
    path: '/delete/:id',
    element: <Delete/>,
  },
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/signup',
    element: <Signup/>,
  }
  ,
  {
    path: '/error',
    element: <Error/>,
  },
  {
    path: '/error2',
    element: <Error2/>,
  }
  ,
  {
    path: '/userProfile',
    element: <UserProfile/>,
  },
  {
    path: '/updateUser',
    element: <UpdateUser/>,
  },
  {
    path: '/user/:id',
    element: <UserDisplay/>,
  },
  {
    path: '/clicker',
    element: <CookieClicker/>
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
