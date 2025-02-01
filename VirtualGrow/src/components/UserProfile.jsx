import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ Ensure correct import
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login"); // ✅ Redirect if not logged in
    return null;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
      <p>Location: {user.location || "Not provided"}</p>
      <p>Interested in Exterior Plants: {user.ExteriorPlants ? "Yes" : "No"}</p>
      <p>Interested in Interior Plants: {user.InteriorPlants ? "Yes" : "No"}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
