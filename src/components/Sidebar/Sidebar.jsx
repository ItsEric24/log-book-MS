import "./Sidebar.css";
import { Link, useNavigate} from "react-router-dom"
import { useDispatch } from "react-redux";
import { logout } from "../../features/users/users";
import { FaBook } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { IoDocumentText } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineSpaceDashboard } from "react-icons/md";

export default function Sidebar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userLogout = () => {
    navigate("/login")
    dispatch(logout())
  }
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Logbook Dashboard</h2>
      <ul className="sidebar-menu">
        <li><MdOutlineSpaceDashboard/><Link to="/dashboard">Dashboard</Link></li>
        <li><TbSend/><Link to="/dashboard/submit-logbook">Submit Logbook</Link></li>
        <li><FaBook/><Link to="/dashboard/logbooks">Manage Logbooks</Link></li>
        <li><IoDocumentText/><Link to="/dashboard/daily-logs">Daily Logbooks</Link></li>
        <li onClick={userLogout}><IoIosLogOut/>Logout</li>
      </ul>
    </div>
  );
}
