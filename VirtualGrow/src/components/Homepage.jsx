import React, { useState } from "react";
import Logo from "../assets/LogoVectorized-removebg-preview.png";
import BackgroundImage from "../assets/garden2.jpg"; // Importing background image

const Homepage = () => {
    const [generatedImage, setGeneratedImage] = useState(Logo);
    const [loading, setLoading] = useState(false);

    const handleGenerateImage = async () => {
        setLoading(true);
        console.log("Generating new image...");

        const prompt = "A beautiful, lush virtual garden with vibrant nature and futuristic plant designs";
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        setTimeout(() => {
            setGeneratedImage(imageUrl);
            setLoading(false);
            console.log("Image generation completed!");
        }, 2000);
    };

    return (
        <div style={styles.home}>
            {/* Background Image */}
            <div style={{ ...styles.background, backgroundImage: `url(${BackgroundImage})` }}></div>

            {/* Stylish Slogan */}
            <h1 style={styles.slogan}>Cultivating Dreams, One Seed at a Time</h1>

            {/* Logo Image with Full Coverage */}
            <div style={styles.imageContainer}>
                {loading && <div style={styles.spinner}></div>}
                <img src={generatedImage} alt="Virtual Garden Logo" style={styles.homepageLogo} />
            </div>

            {/* Generate Image Button */}
            <div style={styles.buttonContainer}>
            <button 
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "200px", // Fixed width for balance
        height: "50px", // Ensures vertical centering
        fontSize: "1rem",
        fontWeight: "500",
        backgroundColor: loading ? "#98c9a3" : "#2c8a3e",
        color: "white",
        border: "2px solid " + (loading ? "#7a9b85" : "#24732e"),
        borderRadius: "8px",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "0.3s ease-in-out",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: "1px",
        textTransform: "uppercase",
        textAlign: "center", // Ensures text stays centered
        padding: "0", // Removes extra padding causing misalignment
    }} 
    onClick={handleGenerateImage} 
    disabled={loading}
>
    {loading ? "Generating..." : "Generate Image"}
</button>

            </div>
        </div>
    );
};

// Inline Styles
const styles = {
    home: {
        textAlign: "center",
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Centering content vertically
        alignItems: "center",
        paddingTop: "30px", // Bringing everything more to the center
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -1,
        opacity: 0.4,
    },
    slogan: {
        fontSize: "1.8rem",
        fontWeight: "600",
        textTransform: "uppercase",
        color: "#2c8a3e",
        letterSpacing: "1px",
        textShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)",
        marginBottom: "20px",
        padding: "10px 20px",
        background: "rgba(255, 255, 255, 0.7)", // Light background to make it stand out
        borderRadius: "8px",
        fontFamily: "'Poppins', sans-serif",
    },
    imageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginBottom: "15px",
    },
    homepageLogo: {
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        objectFit: "cover",
        boxShadow: "0 0 30px rgba(44, 138, 62, 0.7)",
        transition: "0.3s ease-in-out",
    },

    spinner: {
        position: "absolute",
        width: "60px",
        height: "60px",
        border: "6px solid rgba(44, 138, 62, 0.3)",
        borderTop: "6px solid #2c8a3e",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "15px",
    },
    generateBtn: {
        padding: "10px 24px", // Sleeker button
        fontSize: "1rem", // Standardized font size
        fontWeight: "500",
        backgroundColor: "#2c8a3e",
        color: "white",
        border: "2px solid #24732e",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "0.3s ease-in-out",
        textAlign: "center",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        fontFamily: "'Poppins', sans-serif",
    },
    generateBtnDisabled: {
        padding: "10px 24px",
        fontSize: "1rem",
        fontWeight: "500",
        backgroundColor: "#98c9a3",
        color: "white",
        border: "2px solid #7a9b85",
        borderRadius: "6px",
        cursor: "not-allowed",
        textAlign: "center",
    },
};

export default Homepage;
