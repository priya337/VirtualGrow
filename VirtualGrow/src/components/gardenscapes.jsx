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

  // Form fields for modal
  const [layoutSuggestions, setLayoutSuggestions] = useState("");
  const [recommendedPlants, setRecommendedPlants] = useState("");
  const [plantsPlacementThroughoutYear, setplantsPlacementThroughoutYear] = useState("");

  const getFormattedLayoutSuggestions = () => {
    if (!selectedGarden?.gardenPlanOverview?.GardenPlanOverview?.LayoutSuggestions) {
      console.warn("⚠️ No Layout Suggestions found in selectedGarden!");
      return "";
    }
    const { GardenShape, Pathways, RelaxationZone } =
      selectedGarden.gardenPlanOverview.GardenPlanOverview.LayoutSuggestions;
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
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          console.log("📋 Copied to Clipboard!");
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch((err) => console.error("❌ Clipboard API Error:", err));
    } else {
      // Fallback method
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

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
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

        // (B1) If the garden has an imageUrl, set it in local state
        if (response.data.imageUrl) {
          setImageUrl(response.data.imageUrl);
        }

        // Ensure updated layout suggestions
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


  useEffect(() => {
    if (!name) return;
    fetchSavedImage();
  }, [name]);

  const openImageModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Auto-fill the layout suggestions in the modal
  useEffect(() => {
    if (showModal && selectedGarden?.gardenPlanOverview?.GardenPlanOverview?.LayoutSuggestions) {
      const formattedSuggestions = getFormattedLayoutSuggestions();
      console.log("✅ Setting Layout Suggestions in Modal:", formattedSuggestions);
      setLayoutSuggestions(formattedSuggestions);
    }
  }, [showModal, selectedGarden]);


  const generateGardenImage = async () => {
    setLoadingImage(true);
    // Do NOT reset imageUrl to null here; keep the old image until new is ready

    try {
      const prompt = `Layout Suggestions: ${layoutSuggestions}`;
      const encodedPrompt = encodeURIComponent(prompt);
      const apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
      console.log("🔄 Generating image from API:", apiUrl);

      // (D1) Immediately display the new image
      setImageUrl(apiUrl);

      // (D2) Save to the backend (POST /api/ai/saveImage) which overwrites the garden doc
      const backendUrl = "https://virtualgrow-server.onrender.com";
      await axios.post(`${backendUrl}/api/ai/saveImage`, {
        gardenName: name,
        imageUrl: apiUrl,
      });

      console.log("✅ Image saved to database");
      // No need to re-fetch if we trust the new imageUrl in local state
    } catch (error) {
      console.error("❌ Error generating/saving image:", error);
    } finally {
      setLoadingImage(false);
      closeModal();
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4 text-white"
      style={{
        background: "url('/images/nature.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <h2 className="text-center fw-bold">AI Garden Planner</h2>

      {error ? (
        <p className="text-danger">{error}</p>
      ) : selectedGarden ? (
        <div className="card shadow-lg p-4 bg-light rounded mt-3" style={{ width: "90vw" }}>
          <div className="row">
            {/* Left Column: Buttons */}
            <div className="col-md-2 d-flex flex-column align-items-start gap-3">
              {/* Generate Image Button (Outside Modal) */}
              <button
                className="btn btn-success btn-lg w-100"
                onClick={() => {
                  setLoadingImage(true);
                  openImageModal();
                }}
                disabled={loadingImage}
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
                    {/* 🌀 Spinner & Message */}
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

                    {/* Auto-Fill Layout Suggestions */}
                    <textarea
                      className="form-control"
                      rows="3"
                      value={layoutSuggestions || "Loading AI-generated layout suggestions..."}
                      onChange={(e) => setLayoutSuggestions(e.target.value)}
                      style={{
                        width: "100%",
                        fontSize: "14px",
                        padding: "8px",
                        resize: "none",
                      }}
                    />

                    {/* Buttons */}
                    <div className="mt-3 d-flex flex-column align-items-center gap-2">
                      {/* Copy to Clipboard */}
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

                      {/* Cancel & Generate Image */}
                      <div className="d-flex w-100 gap-2">
                        <button className="btn btn-secondary btn-sm w-50" onClick={closeModal}>
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary btn-sm w-50"
                          onClick={() => {
                            setLoadingImage(true);
                            generateGardenImage()
                              .then(() => console.log("✅ Image Generation Completed"))
                              .catch((err) => console.error("❌ Error Generating Image:", err))
                              .finally(() => setLoadingImage(false));
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
  <Link to="/gardenscapes" className="btn btn-primary btn-sm px-3">
    Back to List
  </Link>
  <Link to="/gardenpicks" className="btn btn-secondary btn-sm px-3">
    Back to Picks
  </Link>
</div>
            </div>

            {/* Center Column: Garden Plan */}
            <div className="col-md-5">
              <h3 className="fw-bold">{selectedGarden.name}</h3>
              <p className="mb-1">
                <strong>Size:</strong> {selectedGarden.gardenSize?.length}m x{" "}
                {selectedGarden.gardenSize?.breadth}m
              </p>
              <p className="mb-1">
                <strong>Preferred Plants:</strong> {selectedGarden.preferredPlants?.join(", ")}
              </p>

              <h4 className="mt-3">Generated Plan</h4>
              <div className="border p-3 rounded bg-light overflow-auto" style={{ maxHeight: "450px" }}>
                {selectedGarden.gardenPlanOverview ? (
                  renderValue(selectedGarden.gardenPlanOverview)
                ) : (
                  <p>Not available</p>
                )}
              </div>
            </div>

            {/* Right Column: Generated Image */}
            <div className="col-md-5 d-flex flex-column align-items-center">
              <h4 className="fw-bold">Generated Garden Layout</h4>
              {loadingImage && <p className="text-info">Generating image...</p>}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Generated Garden Layout"
                  className="img-fluid rounded shadow mt-2"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-light">Loading garden details...</p>
      )}
    </div>
  );
}
