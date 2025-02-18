import React from "react";

const FlowerBed = ({ garden }) => {
  const styles = {
    flowerBed: {
      background: "#f5f0e1", // Light earthy tone
      border: "4px solid #c4a484", // Soft brown garden border
      borderRadius: "15px",
      position: "relative",
      padding: "20px",
      textAlign: "center",
      boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
    },
    flowerText: {
      fontFamily: "'Cursive', sans-serif",
      color: "#d63384", // Soft pink
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "#ffcc5c",
      border: "none",
      fontWeight: "bold",
      color: "#5a3e2b",
      padding: "10px 15px",
      borderRadius: "20px",
      transition: "0.3s ease-in-out",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#ffa07a", // Light coral
    },
    flowerDecoration: {
      fontSize: "1.5rem",
      textAlign: "center",
      color: "#ff69b4",
      margin: "5px 0",
    },
  };

  return (
    <div style={styles.flowerBed}>
      <div style={styles.flowerDecoration}>🌹🌼🌹🌼</div> {/* Top Flowers */}
      <div className="card shadow border-0">
        {garden.imageUrl ? (
          <img
            src={garden.imageUrl}
            alt={garden.name}
            className="card-img-top"
            style={{
              height: "200px",
              objectFit: "cover",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
        ) : (
          <div className="text-center p-5 bg-light">No Image Available</div>
        )}
        <div className="card-body text-center">
          <h5 style={styles.flowerText}>{garden.name} 🌸</h5>
          <button
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Explore Garden
          </button>
        </div>
      </div>
      <div style={styles.flowerDecoration}>🌹🌼🌹🌼</div> {/* Bottom Flowers */}
    </div>
  );
};

export default FlowerBed;
