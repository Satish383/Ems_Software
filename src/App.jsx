import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import EmployeesPage from "@/pages/employees/EmployeesPage";
import AddEmployeePage from "@/pages/employees/AddEmployeePage";
import EmployeeDetailsPage from "@/pages/employees/EmployeeDetailsPage";
import DepartmentsPage from "@/pages/departments/DepartmentsPage";
import DesignationsPage from "@/pages/designations/DesignationsPage";
import AttendancePage from "@/pages/attendance/AttendancePage";
import LeavesPage from "@/pages/leaves/LeavesPage";
import PayrollPage from "@/pages/payroll/PayrollPage";
import PerformancePage from "@/pages/performance/PerformancePage";
import ReportsPage from "@/pages/reports/ReportsPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import MyProfilePage from "@/pages/profile/MyProfilePage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Public auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* App (protected) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/new" element={<AddEmployeePage />} />
        <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/designations" element={<DesignationsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/leaves" element={<LeavesPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
