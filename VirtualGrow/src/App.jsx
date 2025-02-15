import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 
import Signup from "./components/Signup"; 
import Homepage from "./components/Homepage";
import Login from "./components/Login"; 
import Logout from "./components/Logout"; 
import Navbar from "./components/Navbar"; 
import Dashboard from "./components/UserProfile"; 
import NotFound from "./components/NotFound"; 
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer";
import CreateGarden from "./components/CreateGarden";
import Gardenscapes from "./components/Gardenscapes";
import GardenList from "./components/GardenList";
import EditGarden from "./components/EditGarden";


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
          <Route path="/gardens" element={<GardenList />} /> {/* ✅ GardenList */}
          <Route path="/gardenscapes/:name" element={<Gardenscapes />} />
          <Route path="/gardenscapes" element={<GardenList />} /> {/* ✅ GardenScape */}
          <Route path="/userprofile" element={<Dashboard />} /> {/* ✅ Add Dashboard route */}
          <Route path="*" element={<NotFound />} /> {/* ✅ Handle unknown routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/aboutus" element={<AboutUs />} />
         
          

        </Routes>
        <Footer/>
        
      </Router>
    </AuthProvider>
  );
}

export default App;
