import "./Header.css";
import { useSelector } from "react-redux";
import UserIcon from "../../assets/user.png";

function Header() {
  const { users, loading } = useSelector((state) => state.user);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  const name = users.role === "supervisor" ? "Admin" : users.name;
  return (
    <div className="header">
      <h1 className="header-title">Welcome, {name}</h1>
      <div className="header-actions">
        <div className="header-profile">
          <img src={UserIcon} alt="User Avatar" className="header-avatar" />
        </div>
      </div>
    </div>
  );
}

export default Header;
