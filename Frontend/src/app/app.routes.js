import { createElement } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/products/pages/createProduct'
import ViewProduct from '../features/products/pages/ViewProduct'
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
  {
    path: '/seller',
    children: [
      {
        index: true,
        element: createElement(Navigate, { to: '/seller/viewproduct', replace: true }),
      },
      {
        path: 'createproduct',
        element: createElement(CreateProduct),
      },
      {
        path: 'viewproduct',
        element: createElement(ViewProduct),
      },
    ],
  },
])
