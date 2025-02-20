import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateGarden() {
  const { name } = useParams(); 
  const navigate = useNavigate();
  const [gardenName, setGardenName] = useState("");
  const [gardenSize, setGardenSize] = useState({ length: "", breadth: "" });
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preferredPlants, setPreferredPlants] = useState("");
  const [invalidPlantCategories, setInvalidPlantCategories] = useState(["Trees", "Test", "Testing", "Tree", "Herbs", "Fruits", "Flowers"]);
  const [existingGardenNames, setExistingGardenNames] = useState([]);

  useEffect(() => {
    const fetchExistingGardens = async () => {
      try {
        const backendUrl = "https://virtualgrow-server.onrender.com";
        const response = await axios.get(`${backendUrl}/api/ai/gardens`);
        setExistingGardenNames(response.data.map(garden => garden.name) || []);
      } catch (error) {
        console.error("❌ Error fetching existing gardens:", error);
      }
    };
    fetchExistingGardens();
  }, []);

  const handleCreateGarden = async () => {
    setError(null);

    if (!gardenName.trim() || !gardenSize.length || !gardenSize.breadth || !preferredPlants.trim()) {
      setError("⚠️ All fields are required!");
      return;
    }

    if (existingGardenNames.includes(gardenName.trim())) {
      setError("⚠️ Garden name already exists! Please choose a different name.");
      return;
    }

    const plantList = preferredPlants.split(",").map((plant) => plant.trim());
    const invalidPlants = plantList.filter((plant) => invalidPlantCategories.includes(plant));

    if (invalidPlants.length > 0) {
      setError(`⚠️ Invalid plant names detected: ${invalidPlants.join(", ")}. Please enter valid plants.`);
      return;
    }

    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5007";
      console.log("🌱 Backend URL:", backendUrl);

      const requestBody = {
        name: gardenName.trim(),
        gardenSize: {
          length: Number(gardenSize.length),
          breadth: Number(gardenSize.breadth),
        },
        preferredPlants: plantList,
      };

      console.log("🚀 Sending Request:", requestBody);

      const aiResponse = await axios.post(`${backendUrl}/api/ai/generate-garden-overview`, requestBody);
      console.log("✅ API Response:", aiResponse.data);

      setExistingGardenNames((prev) => [...prev, aiResponse.data.name]);
      navigate(`/gardenscapes/${aiResponse.data.name}`);
    } catch (error) {
      console.error("❌ Error generating AI garden:", error);
      setError(`⚠️ Failed to generate the garden. Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-3" style={{
      background: "linear-gradient(rgba(0, 50, 0, 0.8), rgba(0, 50, 0, 0.8)), url('/src/images/green-planet_12829583.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      width: "100vw",
      height: "100vh"
    }}>
      <div className="card shadow-lg p-4 bg-light rounded" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center text-dark mb-3">Create Your AI Garden</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <div className="mb-3">
          <input type="text" placeholder="Garden Name" value={gardenName} onChange={(e) => setGardenName(e.target.value)} className="form-control" />
        </div>
        <div className="mb-3">
        <input type="number" placeholder="Garden Length (m)" value={gardenSize.length} 
  onChange={(e) => setGardenSize({ ...gardenSize, length: e.target.value.replace(/[^0-9]/g, '') })} 
  className="form-control" />
        </div>
        <div className="mb-3">
        <input type="number" placeholder="Garden Breadth (m)" value={gardenSize.breadth} 
  onChange={(e) => setGardenSize({ ...gardenSize, breadth: e.target.value.replace(/[^0-9]/g, '') })} 
  className="form-control" />
        </div>
        <div className="mb-3">
          <input type="text" placeholder="Preferred Plants (comma separated)" value={preferredPlants} onChange={(e) => setPreferredPlants(e.target.value)} className="form-control" />
        </div>
        <button onClick={handleCreateGarden} className="btn btn-success w-100" disabled={loading}>{loading ? "Generating..." : "Generate AI Garden"}</button>
      </div>
    </div>
  );
}
