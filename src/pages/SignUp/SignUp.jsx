import { Link } from "react-router";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "../Auth.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [school, setSchool] = useState("");
  const [errors, setErrors] = useState({});

  const errorStyle = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold"
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const nameRegex = /^[a-zA-Z]{2,}(?: [a-zA-Z]+)*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

    if (!name) {
      newErrors.name = "Full name is required";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Enter a valid full name (letters only)";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (
      !emailRegex.test(email) ||
      email.startsWith("1") ||
      email.split("@")[0].length < 4
    ) {
      newErrors.email = "Enter a valid email (e.g., john.doe@example.com)";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!department) newErrors.department = "Department is required";
    if (!school) newErrors.school = "School is required";

    setErrors(newErrors);

    // Stop if there are errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    // Implement user registration logic here
    const user = { name, email, password, department, school };

    if (!name || !email || !password || !department || !school) {
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
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
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
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
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
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="" defaultValue={true}>
                --Select a department--
              </option>
              <option value="infrastructure">Infrastructure</option>
              <option value="knoc">Knoc</option>
              <option value="support">Support</option>
              <option value="cybersecurity">Cybersecurity</option>
            </select>
            {errors.department && (
              <p style={errorStyle}>{errors.department}</p>
            )}
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
            {errors.school && <p style={errorStyle}>{errors.school}</p>}
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
