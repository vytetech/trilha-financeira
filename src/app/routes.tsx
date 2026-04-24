import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import PublicLayout from "@/layouts/PublicLayout";

// Public pages
import LandingPage from "@/features/public/pages/LandingPage";
import NotFound from "@/features/public/pages/NotFound";

// Auth pages
import Login from "@/features/auth/pages/Login";
import Signup from "@/features/auth/pages/Signup";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import ResetPassword from "@/features/auth/pages/ResetPassword";

// Public layout pages
import TermsPage from "@/features/public/pages/TermsPage";
import PrivacyPage from "@/features/public/pages/PrivacyPage";
import RoadmapPage from "@/features/public/pages/RoadmapPage";
import HelpPage from "@/features/public/pages/HelpPage";

// Protected pages
import Dashboard from "@/features/dashboard/pages/Dashboard";
import TasksPage from "@/features/tasks/pages/TasksPage";
import HabitsPage from "@/features/habits/pages/HabitsPage";
import GoalsPage from "@/features/goals/pages/GoalsPage";
import FinancePage from "@/features/finance/pages/FinancePage";
import InvestmentsPage from "@/features/investments/pages/InvestmentsPage";
import DreamsPage from "@/features/dreams/pages/DreamsPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import RankingPage from "@/features/ranking/pages/RankingPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth (sem layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Páginas públicas com nav + footer */}
      <Route element={<PublicLayout />}>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Route>

      {/* Páginas protegidas com sidebar */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/finances" element={<FinancePage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/dreams" element={<DreamsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
