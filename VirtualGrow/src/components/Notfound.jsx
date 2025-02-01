import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>🚨 Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
};

export default NotFound;
