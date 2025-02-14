import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1B5E20", // Dark Green
        color: "#FFFFFF", // White font color
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "5rem", marginBottom: "10px" }}>404</h1>
      <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>🌿 Page Not Found</h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px", maxWidth: "500px" }}>
        Oops! The page you're looking for is lost in the garden.
      </p>
      <Link
        to="/"
        style={{
          padding: "12px 25px",
          backgroundColor: "#FFEB3B", // Light Yellow
          color: "#333",
          textDecoration: "none",
          borderRadius: "20px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "0.3s ease-in-out",
        }}
      >
        🌻 Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
