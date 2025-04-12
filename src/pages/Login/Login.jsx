import { Link, useNavigate } from "react-router";
import "../Auth.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/users/users";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [school, setSchool] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !department || !school) {
      return toast.error("Please fill in all fields");
    }

    // Dispatch login action and wait for it to resolve
    try {
      await dispatch(login({ email, password, department, school })).unwrap();
      // If login is successful
      toast.success(
        "Login successful, you will be redirected to the dashboard shortly"
      );
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      // If there's an error (login failed)
      toast.error(err || "Login failed. Please try again.");
    }

    // Clear input fields after submission
    setEmail("");
    setPassword("");
    setDepartment("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" defaultValue={true}>
                ---Select a department---
              </option>
              <option value="infrastructure">Infrastructure</option>
              <option value="knoc">Knoc</option>
              <option value="support">Support</option>
              <option value="cybersecurity">Cybersecurity</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="school">School</label>
            <select
              id="school"
              name="school"
              onChange={(e) => setSchool(e.target.value)}
            >
              <option value="" defaultValue={true}>
                --Select a School--
              </option>
              <option value="kca">KCA</option>
              <option value="daystar">Daystar</option>
              <option value="usiu">USIU</option>
              <option value="zetech">Zetech</option>
            </select>
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/sign-up">SignUp</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
