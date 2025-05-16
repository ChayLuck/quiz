import './SignUpPage.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

function SignUpPage() {
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUpActive, setIsSignUpActive] = useState(false);

    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        
        if(!userInfo.username || !userInfo.password) {
            setError("Username and password are required");
            setIsLoading(false);
            return;
        }
        
        fetch("http://localhost:5001/api/Users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userInfo.username,
                password: userInfo.password,
            })
        }).then(res => res.json())
            .then(result => {
                setIsLoading(false);
                if (result.success) {
                    sessionStorage.setItem("isAuthorised", "true");
                    sessionStorage.setItem("username", result.username);
                    navigate("/Home");
                } else {
                    setError(result.message || "Login failed");
                }
            })
            .catch(error => {
                setIsLoading(false);
                setError(error.message || "An error occurred. Please try again.");
            });
    }

    function handleGithub() {
        window.open("http://localhost:5001/api/Auth/github", "_self")
    }

    function handleSignUp(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        
        if(!userInfo.username || !userInfo.email || !userInfo.password || !userInfo.password_confirmation) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }
        
        if(userInfo.password !== userInfo.password_confirmation) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }
        
        fetch('http://localhost:5001/api/Users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userInfo.username,
                password: userInfo.password,
                email: userInfo.email,
            })
        }).then(res => res.json())
            .then(result => {
                setIsLoading(false);
                if (result.success || !result.message.includes("error")) {
                    sessionStorage.setItem("isAuthorised", "true");
                    sessionStorage.setItem("username", userInfo.username);
                    navigate("/Home");
                } else {
                    setError(result.message || "Registration failed");
                }
            })
            .catch(error => {
                setIsLoading(false);
                setError(error.message || "An error occurred. Please try again.");
            });
    }

    const resetForm = () => {
        setUserInfo({
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
        setError("");
    }

    const switchMode = (mode) => {
        setIsSignUpActive(mode);
        resetForm();
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>{isSignUpActive ? "Create Account" : "Welcome Back"}</h2>
                    <p>{isSignUpActive ? "Join our quiz community today" : "Sign in to continue your quiz journey"}</p>
                </div>
                
                <div className="auth-tabs">
                    <button 
                        className={`auth-tab ${!isSignUpActive ? 'active' : ''}`} 
                        onClick={() => switchMode(false)}
                    >
                        Login
                    </button>
                    <button 
                        className={`auth-tab ${isSignUpActive ? 'active' : ''}`}
                        onClick={() => switchMode(true)}
                    >
                        Sign Up
                    </button>
                </div>
                
                <div className="auth-form-container">
                    {isSignUpActive ? (
                        <form className="auth-form" onSubmit={handleSignUp}>
                            <div className="form-group">
                                <label htmlFor="signup-username">Username</label>
                                <div className="input-group">
                                    <input
                                        id="signup-username"
                                        type="text"
                                        placeholder="Choose a username (no spaces)"
                                        value={userInfo.username}
                                        onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-email">Email</label>
                                <div className="input-group">
                                    <input
                                        id="signup-email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={userInfo.email}
                                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-password">Password</label>
                                <div className="input-group">
                                    <input
                                        id="signup-password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={userInfo.password}
                                        onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-confirm">Confirm Password</label>
                                <div className="input-group">
                                    <input
                                        id="signup-confirm"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={userInfo.password_confirmation}
                                        onChange={(e) => setUserInfo({...userInfo, password_confirmation: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="auth-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Sign Up"}
                            </button>
                            
                            {error && <div className="auth-error">{error}</div>}
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="login-username">Username</label>
                                <div className="input-group">
                                    <input
                                        id="login-username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={userInfo.username}
                                        onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="login-password">Password</label>
                                <div className="input-group">
                                    <input
                                        id="login-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={userInfo.password}
                                        onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="auth-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing In..." : "Login"}
                            </button>
                            
                            {error && <div className="auth-error">{error}</div>}
                        </form>
                    )}
                    
                    <div className="auth-divider">
                        <span>Or</span>
                    </div>
                    
                    <button onClick={handleGithub} className="auth-social-btn">
                        <FaGithub />
                        Continue with GitHub
                    </button>
                    
                    <div className="auth-switch">
                        {isSignUpActive
                            ? "Already have an account? "
                            : "Don't have an account? "
                        }
                        <span 
                            className="auth-switch-link"
                            onClick={() => switchMode(!isSignUpActive)}
                        >
                            {isSignUpActive ? "Login" : "Sign Up"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;