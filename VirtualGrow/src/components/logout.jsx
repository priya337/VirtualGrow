import { useContext, useEffect } from "react";
import { authcontext.jsx } from "../context/authcontext.jsx"; // ✅ Ensure correct casing
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { user, logout } = useContext(authcontext.jsx);
  const navigate = useNavigate();

  // ✅ Redirect only after logout, not before
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login"); // ✅ Redirect after logout
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
};

export default Logout; // ✅ Ensure default export with uppercase `Logout`
