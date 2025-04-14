import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import AllLogbooks from "./pages/AllLogbooks/AllLogbooks";
import SingleLogbook from "./pages/SingleLogbook/SingleLogbook";
import MainContent from "./pages/MainContent/MainContent";
import AdminDashboard from "./pages/AdminDashboard/Admin";
import AdminLogbooks from "./pages/AdminLogbooks/AdminLogbooks";
import SubmitLogbook from "./pages/SubmitLogbook/SubmitLogbook";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import DailyLogs from "./pages/DailyLogs/DailyLogs";
import SingleDailyLog from "./pages/SIngleDailyLog/SingleDailyLog";
import AdminLogbookView from "./pages/AdminLogbookView/AdminLogbookView";
import AdminHome from "./pages/AdminHome/AdminHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <MainContent />,
      },
      {
        path: "logbooks",
        element: <AllLogbooks />,
      },
      {
        path: "logbook/:id",
        element: <SingleLogbook />,
      },
      {
        path: "submit-logbook",
        element: <SubmitLogbook />,
      },
      {
        path: "daily-logs",
        element: <DailyLogs />,
      },
      {
        path: "daily-log/:id",
        element: <SingleDailyLog />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
    children: [
      {
        path: "",
        element: <AdminHome />,
      },
      {
        path: "logbooks",
        element: <AdminLogbooks />,
      },
      {
        path: "logbook/:id",
        element: <AdminLogbookView />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
