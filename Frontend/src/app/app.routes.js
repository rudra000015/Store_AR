import { createElement } from 'react'
import { createBrowserRouter } from 'react-router'

import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/products/pages/createProduct'
import ViewProduct from '../features/products/pages/ViewProduct'
import Home from './Home'
import Protected from '../features/auth/components/Protected'

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
    element: createElement(Protected),

    children: [
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