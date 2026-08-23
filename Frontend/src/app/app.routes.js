import { createElement } from 'react'
import { createBrowserRouter } from 'react-router'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import Home from './Home'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: createElement(Home),
  },
  {
    path: '/register',
    element: createElement(Register),
  },
  {
    path: '/login',
    element: createElement(Login),
  },
])
