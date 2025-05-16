
import './NavBar.css';
import { FaRegLightbulb, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();
    const isAuthorized = sessionStorage.getItem("isAuthorised") === "true";
    const username = sessionStorage.getItem("username");

    const handleLogout = () => {
        fetch("http://localhost:5001/api/Auth/logout", {
            method: "GET",
            credentials: "include",
        })
            .catch((err) => {
                console.error("Logout failed", err);
            });

        sessionStorage.setItem("isAuthorised", "false");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("score");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <button 
                    className="navbar-brand" 
                    onClick={() => {
                        isAuthorized ? navigate("/Home") : navigate("/");
                    }}
                >
                    <span>Quiss</span>
                    <FaRegLightbulb />
                </button>
                
                <div className="navbar-auth">
                    {isAuthorized && (
                        <span className="navbar-username">Hello, {username}</span>
                    )}
                    
                    {isAuthorized ? (
                        <button 
                            onClick={handleLogout} 
                            className="navbar-btn navbar-btn-logout"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate("/SignUp")} 
                            className="navbar-btn navbar-btn-login"
                        >
                            <FaSignInAlt />
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;