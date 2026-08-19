import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import PortalLayout from "./components/layout/PortalLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PipelineFlowPage from "./pages/PipelineFlowPage";
import Tickets from "./pages/Tickets";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import SubmitQuery from "./pages/student/SubmitQuery";
import MyQueries from "./pages/student/MyQueries";
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import DepartmentTickets from "./pages/department/DepartmentTickets";
import DepartmentAnalytics from "./pages/department/DepartmentAnalytics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import { useAuth } from "./hooks/useAuth";
import { getDashboardPath } from "./utils/auth";

function HomeRoute() {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={getDashboardPath(user)} replace /> : <Login />;
}

function MissingRoute() {
  const { user, isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? getDashboardPath(user) : "/"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />

        <Route element={<ProtectedRoute allow={["student"]} />}>
          <Route element={<PortalLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/queries" element={<MyQueries />} />
            <Route path="/student/submit-query" element={<SubmitQuery />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allow={["department"]} />}>
          <Route element={<PortalLayout />}>
            <Route path="/department/dashboard" element={<DepartmentDashboard />} />
            <Route path="/department/tickets" element={<DepartmentTickets />} />
            <Route path="/department/analytics" element={<DepartmentAnalytics />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allow={["admin"]} />}>
          <Route element={<PortalLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/tickets" element={<Tickets />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/pipeline" element={<PipelineFlowPage />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<MissingRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
