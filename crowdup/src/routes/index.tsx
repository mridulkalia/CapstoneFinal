import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  CampaignDetailsPage,
  CampaignsPage,
  CreateCampaignPage,
  DashboardPage,
  DetailError404Page,
  Error404Page,
  HomePage,
  HowItWorksPage,
  LoginPage,
  RegisterResourcePage,
  SignupPage,
  DisasterInfoPage,
  // Import the new component
} from "../pages";
import { AuthLayout, DashboardLayout, PublicLayout } from "../layout";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../context/AuthProvider";
import RegisterNgoHospitalPage from "../pages/RegisterNgoHospitalPage";
import LoginNGOHospitalPage from "../pages/LoginNGOHospitalPage";
import ResourcesPage from "../pages/ResourcesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <PublicLayout compressedNav />
      </PrivateRoute>
    ),
    errorElement: <Error404Page />,
    children: [
      {
        path: "",
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/register",
    element: (
      <AuthLayout>
        <SignupPage />
      </AuthLayout>
    ),
    errorElement: <Error404Page />,
  },
  {
    path: "/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
    errorElement: <Error404Page />,
  },
  {
    path: "/disaster-preparedness",
    element: <PublicLayout />,
    errorElement: <Error404Page />,
    children: [
      {
        path: "",
        index: true,
        element: <DisasterInfoPage />,
      },
    ],
  },
  {
    path: "/how-it-works",
    element: <PublicLayout />,
    errorElement: <Error404Page />,
    children: [
      {
        path: "",
        index: true,
        element: <HowItWorksPage />,
      },
    ],
  },
  {
    path: "/campaigns",
    element: <PublicLayout />,
    children: [
      {
        path: "",
        index: true,
        element: <CampaignsPage />,
        errorElement: <Error404Page />,
      },
      {
        path: ":id",
        element: <CampaignDetailsPage />,
        errorElement: <DetailError404Page />,
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute adminOnly>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <Error404Page />,
    children: [
      {
        path: "",
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "/registerresource",
    element: <PublicLayout />,
    errorElement: <Error404Page />,
    children: [
      {
        path: "",
        index: true,
        element: <RegisterResourcePage />,
      },
    ],
  },
  {
    path: "/all-resources",
    element: <PublicLayout />,
    errorElement: <Error404Page />,
    children: [
      {
        path: "",
        index: true,
        element: <ResourcesPage />,
      },
    ],
  },
  {
    path: "/register-ngo-hospital", // Add the new route
    element: (
      <AuthLayout>
        <RegisterNgoHospitalPage></RegisterNgoHospitalPage>
      </AuthLayout>
    ), // Use your new component
    errorElement: <Error404Page />,
  },
  {
    path: "/login-ngo-hospital", // Add the new route
    element: (
      <AuthLayout>
        <LoginNGOHospitalPage></LoginNGOHospitalPage>
      </AuthLayout>
    ), // Use your new component
    errorElement: <Error404Page />,
  },
  {
    path: "/create-campaign",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <Error404Page />,
    children: [
      {
        path: "",
        index: true,
        element: <CreateCampaignPage />,
      },
    ],
  },
]);

export const AppRouter = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default AppRouter;
