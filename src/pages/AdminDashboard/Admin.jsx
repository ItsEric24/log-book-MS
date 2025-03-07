import { Link, Outlet} from "react-router";
import "./Admin.css";
import Header from "../../components/Header/Header";
import { logout } from "../../features/users/users";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineSpaceDashboard } from "react-icons/md";

function Admin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  if(user && user.role !== "supervisor"){
    window.location.href = "/login";
  }


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }else{
      setIsAuthenticated(true)
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li><MdOutlineSpaceDashboard/><Link to="/admin">Home</Link></li>
          <li><FaBook/><Link to="/admin/logbooks">Manage Logbooks</Link></li>
          <li onClick={handleLogout}><IoIosLogOut/>Logout</li>
        </ul>
      </div>
      <div className="admin-dashboard-main">
        <Header role="supervisor"/>
        <Outlet/>
      </div>
    </div>
  );
}

export default Admin;
