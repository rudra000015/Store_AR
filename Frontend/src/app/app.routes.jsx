import { createBrowserRouter } from 'react-router'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/products/pages/createProduct'
import ViewProduct from '../features/products/pages/ViewProduct'
import SellerDashboard from '../features/products/pages/SellerDashboard'
import Home from '../features/auth/components/Home'
import Protected from '../features/auth/components/Protected'
import RoleRedirect from '../features/auth/components/RoleRedirect'
import ProductDetail from '../features/auth/components/ProductDetail'
import SellerProductDetail from '../features/auth/components/SellerProductDetail'
import Cart from '../features/cart/pages/Cart'
import AppLayout from '../components/layout/AppLayout'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <RoleRedirect />,
  },

  {
    path: '/buyer',
    element: (
      <Protected role='Buyer'>
        <AppLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
    ],
  },

  {
    path: '/product/:id',
    element: (
      <Protected role='Buyer'>
        <ProductDetail />
      </Protected>
    ),
  },

  {
    path: '/register',
    element: <Register />,
  },

  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/seller',
    element: <Protected role='Seller' />,
    children: [
      {
        index: true,
        element: <SellerDashboard />,
      },
      {
        path: 'createproduct',
        element: <CreateProduct />,
      },
      {
        path: 'viewproduct',
        element: <ViewProduct />,
      },
      {
        path: 'product/:id',
        element: <SellerProductDetail />,
      },
    ],
  },
])



