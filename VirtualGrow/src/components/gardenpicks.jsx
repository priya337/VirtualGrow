import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const backendUrl = "https://virtualgrow-server.onrender.com/api/ai/garden"; // ✅ Correct API URL

export default function GardenPicks() {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // If a garden was just picked from somewhere else, it might be passed in location.state
  const selectedGarden = location.state?.selectedGarden || null;

  const [favoriteGardens, setFavoriteGardens] = useState([]);
  const [gardenToRemove, setGardenToRemove] = useState(null);
  const [gardenDetails, setGardenDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!name) return;

    const fetchGardenDetails = async () => {
      try {
        setLoading(true);
        console.log(`🔍 Fetching garden details from: ${backendUrl}/${name}`);
        const response = await fetch(`${backendUrl}/${name}`);
        if (!response.ok) {
          throw new Error("Failed to fetch garden details.");
        }

        const data = await response.json();
        console.log("✅ Fetched Garden Data:", data);
        setGardenDetails(data);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError("Failed to fetch garden details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGardenDetails();
  }, [name]);


  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteGardens")) || [];
    setFavoriteGardens(storedFavorites);

 
    if (selectedGarden && !storedFavorites.some((g) => g.name === selectedGarden.name)) {
      const updatedFavorites = [...storedFavorites, selectedGarden];
      setFavoriteGardens(updatedFavorites);
      localStorage.setItem("favoriteGardens", JSON.stringify(updatedFavorites));
    }
  }, [selectedGarden]); 


  // 3️⃣ Remove a favorite garden
  const confirmRemoveFavorite = (gardenName) => {
    setGardenToRemove(gardenName);
  };

  const removeFavorite = () => {
    if (!gardenToRemove) return;
    const updatedFavorites = favoriteGardens.filter((garden) => garden.name !== gardenToRemove);
    setFavoriteGardens(updatedFavorites);
    localStorage.setItem("favoriteGardens", JSON.stringify(updatedFavorites));
    setGardenToRemove(null);
  };


  const handleBackToList = () => {
    if (location.state?.fromGardenPicks) {
      navigate("/gardenpicks");
    } else {
      navigate("/gardenscapes");
    }
  };

  // 5️⃣ Fetch the *latest* version of each favorite from the server
  //    so we get updated imageUrl, etc.
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteGardens")) || [];

    const fetchFavoriteGardens = async () => {
      const updatedFavoriteGardens = [];
      for (const fav of storedFavorites) {
        try {
          // If we stored entire objects in localStorage, 'fav' might be an object.
          // If you only stored names, you'd do fetch(`${backendUrl}/${fav}`)
          const res = await fetch(`${backendUrl}/${fav.name || fav}`);
          if (res.ok) {
            const data = await res.json();
            updatedFavoriteGardens.push(data);
          } else {
            console.warn(`Garden "${fav.name || fav}" not found in DB. Removing from favorites...`);
          }
        } catch (err) {
          console.error(`Error fetching garden "${fav.name || fav}":`, err);
        }
      }
      setFavoriteGardens(updatedFavoriteGardens);
      // Now the newest imageUrl is in favoriteGardens
    };

    fetchFavoriteGardens();
  }, []); // Runs once on mount, so we have the updated docs

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4"
      style={{
        background: "url('/images/basket.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <h2 className="text-center fw-bold">Your Garden Picks</h2>

      {/* ✅ Show loading/error messages */}
      {loading && <p className="text-dark text-center">Loading garden details...</p>}
      {error && <p className="text-danger text-center">Error: {error}</p>}

      {/* ✅ Display fetched garden details (for the single garden, if we have one) */}
      {gardenDetails && (
        <div className="container mt-4 text-center">
          <h3>{gardenDetails.name}</h3>
          <p>{gardenDetails.description || "No description available."}</p>
          <button className="btn btn-secondary mt-3" onClick={handleBackToList}>
            Back to List
          </button>
        </div>
      )}

      <div className="container mt-4">
        {favoriteGardens.length === 0 ? (
          <p className="text-dark text-center">No favorite garden picks added yet.</p>
        ) : (
          <div className="row">
            {favoriteGardens.map((garden) => (
              <div key={garden.name} className="col-md-4 mb-4">
                <div className="card shadow-lg border-0">
                  {garden.imageUrl ? (
                    <img
                      src={garden.imageUrl}
                      alt={garden.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="text-center p-5 bg-light">No Image Available</div>
                  )}
                  <div className="card-body text-center">
                    <h5 className="card-title">{garden.name}</h5>
                    <div className="d-flex justify-content-center gap-2">
                      <Link
                        to={`/gardenscapes/${garden.name}`}
                        className="btn btn-primary"
                        state={{ fromGardenPicks: true }}
                      >
                        View Garden Plan
                      </Link>
                      <button className="btn btn-danger" onClick={() => confirmRemoveFavorite(garden.name)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Confirmation Modal */}
      {gardenToRemove && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "lightgreen" }}>Confirm Removal</h5>
                <button type="button" className="btn-close" onClick={() => setGardenToRemove(null)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to remove "<strong>{gardenToRemove}</strong>" from your favorites?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setGardenToRemove(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={removeFavorite}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
