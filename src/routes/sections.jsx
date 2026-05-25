/* eslint-disable */

import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import DashboardLayout from "src/layouts/dashboard";

import { ProtectedRoutes, PublicRoutes } from "./protectedRoutes";

export const IndexPage = lazy(() => import("src/pages/app"));
export const BlogPage = lazy(() => import("src/pages/blog"));
export const UserPage = lazy(() => import("src/pages/user"));
export const FeedbackPage = lazy(() => import("src/pages/feedback"));
export const NotificationsManagementPage = lazy(() =>
  import("src/pages/notifications"),
);
export const LoginPage = lazy(() => import("src/pages/login"));
export const ForgotPasswordPage = lazy(() =>
  import("../pages/forget-password"),
);
export const ResetPasswordPage = lazy(() => import("../pages/reset-password"));
export const ViewPage = lazy(() => import("../pages/viewUser"));
export const ProfilePage = lazy(() => import("../pages/profile"));
export const CallLogsPage = lazy(() => import("../pages/call-logs"));
export const IncomePage = lazy(() => import("../pages/income"));
export const SubscriptionPage = lazy(() => import("../pages/subscription"));
export const ProfileEditPage = lazy(() => import("../pages/profile-edit"));
export const Page404 = lazy(() => import("src/pages/page-not-found"));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: "dashboard",
      element: (
        <ProtectedRoutes>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoutes>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: "company-management", element: <UserPage /> },
        { path: "feedbacks", element: <FeedbackPage /> },
        {
          path: "notifications",
          element: <NotificationsManagementPage />,
        },
        { path: "calls&invoices", element: <CallLogsPage /> },
        { path: "subscription&commission", element: <IncomePage /> },
        { path: "plans&fess", element: <SubscriptionPage /> },
        { path: "view/:id", element: <ViewPage /> },
        { path: "admin-profile", element: <ProfilePage /> },
        { path: "admin-profile/edit", element: <ProfileEditPage /> },
      ],
    },
    {
      path: "login",
      element: (
        <PublicRoutes>
          <LoginPage />
        </PublicRoutes>
      ),
    },
    {
      path: "forgetPassword",
      element: <ForgotPasswordPage />,
    },
    {
      path: "reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ]);

  return routes;
}
