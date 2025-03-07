import "./Dashboard.css"
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))
  

  useEffect(() => {
    if(user && user.role === "supervisor"){
      navigate("/admin", { replace: true })
    }
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login", { replace: true })
    }else{
      setIsAuthenticated(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <Outlet/>
      </div>
    </div>
  );
}

export default Dashboard;
