import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/register", { email, password });
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Email may already exist.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" ,fontSize: 'clamp(12px, 2vw, 20px)' }}>
      <h2 className="mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Email:</label>
          <input type="email" className="form-control" required value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Password:</label>
          <input type="password" className="form-control" required value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-teal w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
