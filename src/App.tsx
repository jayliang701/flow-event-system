import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const LoginPage = React.lazy(() => import('./login'));
const AccountBindPage = React.lazy(() => import('./account_bind'));

const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/account-bind',
    Component: AccountBindPage,
  },
]);

export default function App() {
  return (
    <div className="App">
      <React.Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </React.Suspense>
    </div>
  );
}
