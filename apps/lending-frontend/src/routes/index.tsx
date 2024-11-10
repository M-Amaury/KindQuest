import { createBrowserRouter, Navigate } from "react-router-dom";
import { 
  AuthPage, 
  HomePage, 
  MissionsPage, 
  LeaderboardPage, 
  SettingsPage,
  ExperiencePage
} from "../pages";
import { AppLayout } from "../app-layouts/app-layouts";
import { useUser } from "../shared/contexts/user-context";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/auth" replace />;
  return <AppLayout>{children}</AppLayout>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/missions",
    element: (
      <ProtectedRoute>
        <MissionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/experience",
    element: (
      <ProtectedRoute>
        <ExperiencePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute>
        <LeaderboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
]); 