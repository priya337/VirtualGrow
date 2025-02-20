import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Gardenscape() {
  const { name } = useParams();
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

    // 1️⃣ Define `fetchSavedImage` at the top level
    const fetchSavedImage = async () => {
      try {
        const backendUrl = "https://virtualgrow-server.onrender.com";
        const response = await axios.get(`${backendUrl}/api/ai/images/${name}`);
        if (response.data && response.data.length > 0) {
          setImageUrl(response.data[0].imageUrl);
        }
      } catch (error) {
        console.error("Error fetching saved image:", error);
      }
    };


  const getFormattedLayoutSuggestions = () => {
    if (!selectedGarden?.gardenPlanOverview?.GardenPlanOverview?.LayoutSuggestions) {
      console.warn("⚠️ No Layout Suggestions found in selectedGarden!");
      return "";
    }
  
    const { GardenShape, Pathways, RelaxationZone } = selectedGarden.gardenPlanOverview.GardenPlanOverview.LayoutSuggestions;
    
    const formattedText = `Garden Shape: ${GardenShape}, Pathways: ${Pathways}, Relaxation Zone: ${RelaxationZone}`;
    console.log("📌 Extracted Layout Suggestions for Copy:", formattedText);
    return formattedText;
  };
  
  const copyToClipboard = () => {
    const textToCopy = layoutSuggestions.trim();
  
    console.log("📌 Copying This Text:", textToCopy);
  
    if (!textToCopy) {
      console.warn("⚠️ No layout suggestions available to copy!");
      return;
    }
  
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log("📋 Copied to Clipboard!");
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => console.error("❌ Clipboard API Error:", err));
    } else {
      console.warn("⚠️ Clipboard API not supported! Using fallback.");
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      console.log("📋 Copied using fallback method!");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  

  // Form fields for modal
  const [layoutSuggestions, setLayoutSuggestions] = useState("");
  const [recommendedPlants, setRecommendedPlants] = useState("");
  const [plantsPlacementThroughoutYear, setplantsPlacementThroughoutYear] = useState("");
  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
  };

  const renderValue = (value) => {
    if (!value) return "Not specified";

    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === "object") {
      return (
        <ul>
          {Object.entries(value).map(([key, val]) => (
            <li key={key}>
              <strong>{formatKey(key)}:</strong> {renderValue(val)}
            </li>
          ))}
        </ul>
      );
    }

    return value;
  };

  useEffect(() => {
    if (!name) {
      setError("Invalid garden name.");
      return;
    }

    const fetchGarden = async () => {
      try {
        const backendUrl = "https://virtualgrow-server.onrender.com";
        console.log(`🔍 Fetching garden details from: ${backendUrl}/api/ai/garden/${name}`);

        const response = await axios.get(`${backendUrl}/api/ai/garden/${name}`);
        console.log("✅ Fetched Garden Details:", response.data);

        if (!response.data) {
          setError("Garden not found.");
          return;
        }

        setSelectedGarden(response.data);

// ✅ Ensure updated layout suggestions are reflected
if (response.data.gardenPlanOverview?.layoutSuggestions) {
  console.log("🎯 Setting Layout Suggestions:", response.data.gardenPlanOverview.layoutSuggestions);
  setLayoutSuggestions(response.data.gardenPlanOverview.layoutSuggestions);
}

} catch (error) {
        console.error("❌ Error fetching garden:", error);
        setError("Failed to fetch garden details.");
      }
    };

    fetchGarden();
  }, [name]);

  const openImageModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal && selectedGarden?.gardenPlanOverview?.GardenPlanOverview?.LayoutSuggestions) {
      const formattedSuggestions = getFormattedLayoutSuggestions();
      console.log("✅ Setting Layout Suggestions in Modal:", formattedSuggestions);
      setLayoutSuggestions(formattedSuggestions);
    }
  }, [showModal, selectedGarden]);
  

  const generateGardenImage = async () => {
    setLoadingImage(true);
    setImageUrl(null);

    // Create a prompt from layout suggestions
  const prompt = `Layout Suggestions: ${layoutSuggestions}`;
  const encodedPrompt = encodeURIComponent(prompt);

  // Generate the AI image URL
  const apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
  console.log("🔄 Generating image from API:", apiUrl);

  try {
    // Display the image immediately in the UI.
    setImageUrl(apiUrl);

    // Define your backend URL.
    const backendUrl = "https://virtualgrow-server.onrender.com";
    
    // Save the generated image URL to your database by calling the backend endpoint.
    await axios.post(`${backendUrl}/api/ai/saveImage`, {
      gardenName: name,
      imageUrl: apiUrl,
    });

    // Immediately fetch the updated image data.
    fetchSavedImage();

    console.log("✅ Image saved to database");
    if (typeof refreshGardens === "function") {
      await refreshGardens();
    }
  } catch (error) {
    console.error("❌ Error generating/saving image:", error);
  } finally {
    setLoadingImage(false);
    closeModal();
  }
};

useEffect(() => {
  if (!name) {
    // Optionally setError('No garden name provided');
    return;
  }
  const fetchSavedImage = async () => {
    try {
      const backendUrl = "https://virtualgrow-server.onrender.com";
      const response = await axios.get(`${backendUrl}/api/ai/images/${name}`);
      if (response.data && response.data.length > 0) {
        // Assuming you want the most recent image if there are multiple.
        setImageUrl(response.data[0].imageUrl);
      }
    } catch (error) {
      console.error("Error fetching saved image:", error);
    }
  };

  fetchSavedImage();
}, [name]);

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4"
    style={{
      background: " url('/images/nature.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      width: "100vw",
      height: "100vh",
    }}
    >
      <h2 className="text-center text-light">AI Garden Planner</h2>

      {error ? (
        <p className="text-danger">{error}</p>
      ) : selectedGarden ? (
        <div className="card shadow-lg p-4 bg-light rounded" style={{ width: "90vw" }}>
          <div className="row">
            {/* Left Column: Buttons */}
            <div className="col-md-2 d-flex flex-column align-items-start gap-3">
{/* First "Generate Image" button (Outside Modal) */}
<button 
  className="btn btn-success btn-lg w-100"
  onClick={() => {
    setLoadingImage(true);  // 🌀 Show Spinner
    openImageModal();
  }}
  disabled={loadingImage} // Disable button while loading
>
  {loadingImage ? (
    <div className="d-flex align-items-center">
      <div className="spinner-border spinner-border-sm text-light me-2"></div>
      Generating...
    </div>
  ) : (
    "Generate Image"
  )}
</button>
              {/* Image Modal */}
              {showModal && (
  <div className="modal-overlay d-flex align-items-center justify-content-center">
    <div 
      className="modal-content p-3 rounded shadow bg-light"
      style={{ maxWidth: "450px", position: "relative" }}
    >
      {/* 🌀 Spinner & Message (Now Stays Until API Completes) */}
      {loadingImage && (
        <div className="d-flex flex-column align-items-center mb-3">
          <div 
            className="spinner-border text-success" 
            role="status" 
            style={{ width: "2rem", height: "2rem" }}
          ></div>
          <span className="mt-2 text-success fw-bold">AI Prompt...</span>
        </div>
      )}

      {/* 🟢 Auto-Fill Layout Suggestions */}
      <textarea 
        className="form-control"
        rows="3"
        value={layoutSuggestions || "Loading AI-generated layout suggestions..."} 
        onChange={(e) => setLayoutSuggestions(e.target.value)}
        style={{
          width: "100%", 
          fontSize: "14px", 
          padding: "8px", 
          resize: "none"
        }}
      />

      {/* 🔘 Buttons with Proper Alignment */}
      <div className="mt-3 d-flex flex-column align-items-center gap-2">
        
        {/* 📋 Copy to Clipboard */}
        <button 
          className="btn btn-outline-info btn-sm w-100"
          onClick={() => {
            console.log("📌 Copying This Text:", layoutSuggestions);
            copyToClipboard();
          }}
        >
          Copy to Clipboard
        </button>
        
        {copySuccess && <span className="text-success small">✅ Copied!</span>}

        {/* 🔴 Cancel & 🔵 Generate Image (Now Inside the Same Row) */}
        <div className="d-flex w-100 gap-2"> 
          <button 
            className="btn btn-secondary btn-sm w-50"
            onClick={closeModal}
          >
            Cancel
          </button>
          
          <button 
            className="btn btn-primary btn-sm w-50"
            onClick={() => {
              setLoadingImage(true);  // 🔄 Show Spinner Before API Call

              generateGardenImage()
                .then(() => console.log("✅ Image Generation Completed"))
                .catch(error => console.error("❌ Error Generating Image:", error))
                .finally(() => setLoadingImage(false)); // ✅ Spinner stays until API finishes
            }}
          >
            Generate Image
          </button>
        </div>
      </div>
    </div>
  </div>
)}

<div className="d-flex justify-content-center gap-3 my-3">
  <Link to="/gardenscapes" className="btn btn-primary btn-lg flex-fill">
    Back to List
  </Link>
  <Link to="/gardenpicks" className="btn btn-secondary btn-lg flex-fill">
    Back to Picks
  </Link>
</div>
</div>
          

            {/* Center Column: Garden Plan */}
            <div className="col-md-5">
              <h3>{selectedGarden.name}</h3>
              <p><strong>Size:</strong> {selectedGarden.gardenSize?.length}m x {selectedGarden.gardenSize?.breadth}m</p>
              <p><strong>Preferred Plants:</strong> {selectedGarden.preferredPlants?.join(", ")}</p>

              <h4 className="mt-3">Generated Plan</h4>
              <div className="border p-3 rounded bg-light overflow-auto" style={{ maxHeight: "450px" }}>
                {selectedGarden.gardenPlanOverview ? renderValue(selectedGarden.gardenPlanOverview) : <p>Not available</p>}
              </div>
            </div>

            {/* Right Column: Generated Image */}
            <div className="col-md-5 d-flex flex-column align-items-center">
              <h4>Generated Garden Layout</h4>
              {loadingImage && <p className="text-info">Generating image...</p>}
              {imageUrl && <img src={imageUrl} alt="Generated Garden Layout" className="img-fluid rounded shadow" />}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-light">Loading garden details...</p>
      )}
    </div>
  );
}
