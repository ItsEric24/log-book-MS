import { Link } from "react-router";
import { useState } from "react";
import {ToastContainer, toast} from "react-toastify";
import "../Auth.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Implement user registration logic here
    const user = { name, email, password, department };

    if(!name || !email || !password || !department){
      return toast.error("Please fill in all fields");
    }
    const url = "http://localhost:8000/api/users/register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const userExists = await response.json();

    if (userExists.message === "User already exists") {
      toast.error("User already exists, try logging in");
    }

    if (response.status === 200) {
      toast.success("User created successfully, you can now login");
      setName("");
      setEmail("");
      setPassword("");
      setDepartment("");
    }

  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" disabled defaultValue={true}>
                Select a department
              </option>
              <option value="infrastructure">Infrastructure</option>
              <option value="knoc">Knoc</option>
              <option value="support">Support</option>
              <option value="cybersecurity">Cybersecurity</option>
            </select>
          </div>
          <button type="submit" className="auth-button" onClick={handleSubmit}>
            Sign Up
          </button>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
