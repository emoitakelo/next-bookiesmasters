// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="container mt-5">
        <h3>You must be logged in to view your profile.</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      <div className="card p-3 mt-3">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {user.name || "Not provided"}</p>
        <p><strong>Role:</strong> {user.role || "User"}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default Profile;
