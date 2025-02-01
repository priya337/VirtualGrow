import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Signup</Link>
      <Link to="/login">Login</Link>
      <Link to="/logout">Logout</Link>
    </nav>
  );
};

export default Navbar;
