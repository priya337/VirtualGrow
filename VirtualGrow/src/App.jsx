import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authcontext.jsx";
import Signup from "./components/Signup.jsx"; 
import Homepage from "./components/Homepage.jsx";
import Login from "./components/Login.jsx"; 
import Logout from "./components/Logout.jsx"; 
import Navbar from "./components/Navbar.jsx"; 
import Dashboard from "./components/UserProfile.jsx"; 
import NotFound from "./components/NotFound.jsx"; 
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Footer from "./components/Footer.jsx";
import CreateGarden from "./components/CreateGarden.jsx";
import Gardenscapes from "./components/Gardenscapes.jsx";
import GardenList from "./components/GardenList.jsx";
import GardenPicks from "./components/GardenPicks.jsx";  // ✅ FIXED IMPORT
import EditGarden from "./components/EditGarden.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/create-garden" element={<CreateGarden />} />
          <Route path="/edit-garden/:gardenName" element={<EditGarden />} />
          <Route path="/gardenpicks" element={<GardenPicks />} />  {/* ✅ GardenPicks Route */}
          <Route path="/gardens" element={<GardenList />} />       {/* ✅ GardenList Route */}
          <Route path="/gardenscapes/:name" element={<Gardenscapes />} />
          <Route path="/gardenpicks/:name" element={<GardenPicks />} />
          <Route path="/gardenscapes" element={<GardenList />} />  {/* ✅ Gardenscapes */}
          <Route path="/userprofile" element={<Dashboard />} />    {/* ✅ User Dashboard */}
          <Route path="*" element={<NotFound />} />                {/* ✅ Handle unknown routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
