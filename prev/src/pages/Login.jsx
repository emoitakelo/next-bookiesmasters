import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance"; // ✅ use axiosInstance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ for error feedback
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset error
    try {
      const res = await axios.post("/auth/login", { email, password }); // ✅ baseURL is handled

      // Save token and user info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/request-tips"); // ✅ protected route
      window.location.reload(); // ✅ update Navbar (optional)
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "400px", fontSize: "clamp(12px, 2vw, 20px)" }}
    >
      <h2 className="mb-4 text-center">Login</h2>

      {error && <div className="alert alert-danger">{error}</div>} {/* ✅ error message */}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-teal w-100">
          Login
        </button>
      </form>
          <p className="mt-3 text-center">
      Don't have an account?{" "}
      <Link to="/register" className="text-success" style={{ textDecoration: "underline" }}>
        Register here
      </Link>
    </p>
    </div>
  );
};

export default Login;
