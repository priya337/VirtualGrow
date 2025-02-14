import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditGarden = () => {
  const { gardenName } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    length: "",
    breadth: "",
    preferredPlants: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGarden = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5006";
        const response = await axios.get(`${backendUrl}/api/ai/garden/${gardenName}`);

        if (response.data) {
          setFormData({
            name: response.data.name || "",
            length: response.data.gardenSize?.length || "",
            breadth: response.data.gardenSize?.breadth || "",
            preferredPlants: response.data.preferredPlants?.join(", ") || "",
          });
        }
      } catch (error) {
        console.error("Error fetching garden details:", error);
      }
    };

    fetchGarden();
  }, [gardenName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5006";

      // ✅ Make a single `PUT` request to update the garden and regenerate AI plan
      const response = await axios.put(`${backendUrl}/api/ai/garden/${gardenName}`, {
        name: formData.name,
        gardenSize: { length: formData.length, breadth: formData.breadth },
        preferredPlants: formData.preferredPlants.split(",").map((plant) => plant.trim()),
      });

      console.log("✅ Garden details updated successfully!", response.data);

      // ✅ Redirect to updated garden page
      navigate(`/gardenscapes/${formData.name}`);
    } catch (error) {
      console.error("❌ Error regenerating AI Garden:", error);
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(rgba(0, 50, 0, 0.8), rgba(0, 50, 0, 0.8)), url('/src/images/green-planet_12829583.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
        padding: "20px",
        position: "relative",
      }}
    >
      <h2 className="text-light text-center">Edit AI Garden</h2>

      <form onSubmit={handleRegenerate} className="p-4 bg-light rounded shadow" style={{ width: "400px" }}>
        <div className="mb-3">
          <label className="form-label">Garden Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Length (m)</label>
          <input
            type="number"
            name="length"
            value={formData.length}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Breadth (m)</label>
          <input
            type="number"
            name="breadth"
            value={formData.breadth}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Plants (comma separated)</label>
          <input
            type="text"
            name="preferredPlants"
            value={formData.preferredPlants}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/gardenscapes`)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Regenerating..." : "Regenerate AI Garden"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGarden;
