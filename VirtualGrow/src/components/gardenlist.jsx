import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function GardenList() {
  const [gardens, setGardens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [gardenToDelete, setGardenToDelete] = useState(null);

  // ✅ Fetch Gardens (Fixed)
  const fetchGardens = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5006";
      console.log(`Fetching gardens from: ${backendUrl}/api/ai/gardens`);

      const response = await axios.get(`${backendUrl}/api/ai/gardens`);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 200 && Array.isArray(response.data)) {
        setGardens(response.data.length === 0 ? [] : response.data);
      } else {
        console.error("Unexpected response format:", response);
        setError("Failed to fetch gardens.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch gardens.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Ensures fetchGardens is called only once when the component mounts
  useEffect(() => {
    fetchGardens();
  }, []);

  // ✅ Confirm Delete (Opens confirmation modal)
  const confirmDelete = (gardenName) => {
    setGardenToDelete(gardenName);
  };

  // ✅ Handle Delete Request
  const handleDelete = async () => {
    if (!gardenToDelete) {
      console.log("No garden selected for deletion.");
      return;
    }

    console.log(`Attempting to delete: "${gardenToDelete}"`); // ✅ Debugging log

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5006";
      const response = await axios.delete(`${backendUrl}/api/ai/garden/${encodeURIComponent(gardenToDelete)}`);

      console.log(`Response from server:`, response.data);

      setDeleteMessage(`AI Garden "${gardenToDelete}" has been deleted successfully!`);
      setTimeout(() => setDeleteMessage(null), 3000);

      // ✅ Remove deleted garden from state to update UI immediately
      setGardens(prevGardens => prevGardens.filter(garden => garden.name !== gardenToDelete));

      setGardenToDelete(null); // ✅ Close modal after deletion
    } catch (error) {
      console.error("Failed to delete:", error);
      setError("Failed to delete garden.");
    }
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
      {/* Add Garden Button */}
      <div style={{ position: "absolute", top: "120px", left: "50px" }}>
        <Link to="/create-garden" className="btn btn-success btn-lg shadow px-4 py-2">
          ➕ Add Garden
        </Link>
      </div>

      {/* Title */}
      <h2 className="text-center text-white fw-bold mt-5">Available Gardens</h2>

      {/* Delete Message */}
      {deleteMessage && <div className="alert alert-success text-center">{deleteMessage}</div>}

      {/* Garden List */}
      <div className="container mt-3">
        {loading ? (
          <p className="text-info text-center">Loading gardens...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : gardens.length === 0 ? (
          <p className="text-warning text-center">No gardens available.</p>
        ) : (
          <div className="row">
            {gardens.map((garden) => (
              <div key={garden.name} className="col-md-4 mb-4">
                <div className="card shadow-lg border-0">
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
                    <h5 className="card-title">{garden.name}</h5>

                    {/* Buttons for View, Edit, and Delete */}
                    <div className="d-flex justify-content-center gap-2">
                      <Link to={`/gardenscapes/${garden.name}`} className="btn btn-primary">
                        View
                      </Link>

                      <Link to={`/edit-garden/${garden.name}`} className="btn btn-warning">
                        <FaEdit />
                      </Link>

                      <button className="btn btn-danger" onClick={() => confirmDelete(garden.name)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Confirmation Modal */}
      {gardenToDelete && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="close" onClick={() => setGardenToDelete(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the garden "<strong>{gardenToDelete}</strong>"?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setGardenToDelete(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
