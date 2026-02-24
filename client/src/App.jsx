import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

/* Public pages */
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* User dashboard */
import DashboardHome from "./pages/dashboard/DashboardHome";
import MyCourses from "./pages/dashboard/MyCourses";
import Profile from "./pages/dashboard/Profile";
import CoursePlayer from "./pages/dashboard/CoursePlayer";

/* Admin */
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseForm from "./pages/admin/AdminCourseForm";
import AdminLessons from "./pages/admin/AdminLessons";
import AdminLessonForm from "./pages/admin/AdminLessonForm";
import AdminPosts from "./pages/admin/AdminPosts";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ================= USER DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="courses/:courseId" element={<CoursePlayer />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />

          {/* Courses */}
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/new" element={<AdminCourseForm />} />
          <Route path="courses/:id" element={<AdminCourseForm />} />

          {/* Lessons */}
          <Route path="courses/:courseId/lessons" element={<AdminLessons />} />
          <Route
            path="courses/:courseId/lessons/new"
            element={<AdminLessonForm />}
          />
          <Route
            path="courses/:courseId/lessons/:lessonId"
            element={<AdminLessonForm />}
          />

          {/* Blog */}
          <Route path="posts" element={<AdminPosts />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}