/* eslint-disable react-refresh/only-export-components */
import paths, { rootPaths } from './paths';
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from 'layouts/main-layout';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import AuthLayout from 'layouts/auth-layout';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard/Dashboard'));
const Signin = lazy(() => import('pages/authentication/Signin'));
const Signup = lazy(() => import('pages/authentication/Signup'));
const Countries = lazy(() => import('components/crud/Countries'));
const Situations = lazy(() => import('components/crud/Situations'));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: <Navigate to={paths.signin} replace />, // Redirect to SignIn
        },
        {
          path: rootPaths.authRoot,
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: paths.signin,
              element: <Signin />,
            },
            {
              path: paths.signup,
              element: <Signup />,
            },
          ],
        },
        {
          path: '/dashboard',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            </MainLayout>
          ),
        },
        {
          path: '/countries',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Countries />
              </Suspense>
            </MainLayout>
          ),
        },
        {
          path: '/situations',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Situations />
              </Suspense>
            </MainLayout>
          ),
        },
      ],
    },
  ],
  {
    basename: '/',
  },
);

export default router;