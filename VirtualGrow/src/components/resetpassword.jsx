import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UseAuth } from "../context/authcontext.jsx"; // ✅ Import AuthContext
import ClipLoader from "react-spinners/ClipLoader"; // ✅ Spinner component
import backgroundImage from "../public/images/nature.jpg"; // ✅ Import BG image

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Track loading state
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword } = UseAuth(); // ✅ Use AuthContext function

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Show spinner
    const response = await resetPassword(token, newPassword);
    setMessage(response.message);
    setLoading(false); // ✅ Hide spinner
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }} // ✅ Background image
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-green-700 text-center">Reset Password</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Enter a new password for your account.</p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            disabled={loading} // ✅ Disable while loading
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
          </button>
        </form>

        {message && <p className="text-center mt-3 text-green-700">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
