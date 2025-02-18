import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authcontext.jsx";
import Signup from "./components/signup.jsx"; 
import Homepage from "./components/Homepage.jsx";
import Login from "./components/login.jsx"; 
import Logout from "./components/logout.jsx"; 
import Navbar from "./components/Navbar.jsx"; 
import Dashboard from "./components/UserProfile.jsx"; 
import NotFound from "./components/Notfound.jsx"; 
import ForgotPassword from "./components/forgotPassword.jsx";
import ResetPassword from "./components/resetPassword.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Footer from "./components/Footer.jsx";
import CreateGarden from "./components/creategarden.jsx";
import Gardenscapes from "./components/gardenscapes.jsx";
import GardenList from "./components/gardenlist.jsx";
import GardenPicks from "./components/gardenpicks.jsx";  // ✅ FIXED IMPORT
import EditGarden from "./components/editgarden.jsx";

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
