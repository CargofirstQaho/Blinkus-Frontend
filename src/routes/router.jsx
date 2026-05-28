import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '../components/layout/AppLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import Spinner from '../components/ui/Spinner';

const wrap = (Component) => (
  <Suspense fallback={<Spinner fullScreen />}>
    <Component />
  </Suspense>
);

const Home           = lazy(() => import('../pages/Home'));
const Login          = lazy(() => import('../pages/Login'));
const Signup         = lazy(() => import('../pages/Signup'));
const VerifyOtp      = lazy(() => import('../pages/VerifyOtp'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const VerifyResetOtp = lazy(() => import('../pages/VerifyResetOtp'));
const ResetPassword  = lazy(() => import('../pages/ResetPassword'));
const GoogleCallback = lazy(() => import('../pages/GoogleCallback'));
const About          = lazy(() => import('../pages/About'));
const Contact        = lazy(() => import('../pages/Contact'));
const Careers        = lazy(() => import('../pages/Careers'));
const Blog           = lazy(() => import('../pages/Blog'));
const Articles       = lazy(() => import('../pages/Articles'));
const PressRelease   = lazy(() => import('../pages/PressRelease'));
const Dashboard      = lazy(() => import('../pages/Dashboard'));
const Chat           = lazy(() => import('../pages/Chat'));
const Profile        = lazy(() => import('../pages/Profile'));
const Settings       = lazy(() => import('../pages/Settings'));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true,                   element: wrap(Home)           },
      { path: 'about',                 element: wrap(About)          },
      { path: 'contact',               element: wrap(Contact)        },
      { path: 'careers',               element: wrap(Careers)        },
      { path: 'blog',                  element: wrap(Blog)           },
      { path: 'articles',              element: wrap(Articles)       },
      { path: 'press-release',         element: wrap(PressRelease)   },
      { path: 'auth/google/callback',  element: wrap(GoogleCallback) },
      {
        element: <GuestRoute />,
        children: [
          { path: 'login',            element: wrap(Login)          },
          { path: 'signup',           element: wrap(Signup)         },
          { path: 'verify-otp',       element: wrap(VerifyOtp)      },
          { path: 'forgot-password',  element: wrap(ForgotPassword) },
          { path: 'verify-reset-otp', element: wrap(VerifyResetOtp) },
          { path: 'reset-password',   element: wrap(ResetPassword)  },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard',    element: wrap(Dashboard) },
          { path: 'chat/:chatId', element: wrap(Chat)      },
          { path: 'profile',      element: wrap(Profile)   },
          { path: 'settings',     element: wrap(Settings)  },
        ],
      },
    ],
  },
]);
