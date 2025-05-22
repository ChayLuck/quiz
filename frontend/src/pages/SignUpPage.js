import './SignUpPage.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already authenticated
        const isAuthorised = sessionStorage.getItem("isAuthorised") === "true";
        if (isAuthorised) {
            navigate("/Home");
        }
    }, [navigate]);

    const validatePassword = (password) => {
        if (password.length < 6) return "weak";
        if (password.length < 8) return "medium";
        if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
            return "strong";
        }
        return "medium";
    };

    const validateForm = () => {
        const errors = {};

        if (isSignUpActive) {
            if (!userInfo.username.trim()) {
                errors.username = "Username is required";
            } else if (userInfo.username.includes(" ")) {
                errors.username = "Username cannot contain spaces";
            } else if (userInfo.username.length < 3) {
                errors.username = "Username must be at least 3 characters";
            }

            if (!userInfo.email.trim()) {
                errors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
                errors.email = "Email is invalid";
            }

            if (!userInfo.password) {
                errors.password = "Password is required";
            } else if (userInfo.password.length < 6) {
                errors.password = "Password must be at least 6 characters";
            }

            if (!userInfo.password_confirmation) {
                errors.password_confirmation = "Please confirm your password";
            } else if (userInfo.password !== userInfo.password_confirmation) {
                errors.password_confirmation = "Passwords do not match";
            }
        } else {
            if (!userInfo.username.trim()) {
                errors.username = "Username is required";
            }
            if (!userInfo.password) {
                errors.password = "Password is required";
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const response = await fetch("http://localhost:5001/api/Users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userInfo.username,
                    password: userInfo.password,
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                sessionStorage.setItem("isAuthorised", "true");
                sessionStorage.setItem("username", result.username);
                navigate("/Home");
            } else {
                setError(result.message || "Invalid username or password");
            }
        } catch (error) {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:5001/api/Users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userInfo.username,
                    password: userInfo.password,
                    email: userInfo.email,
                })
            });
            
            const result = await response.json();
            
            if (result.success || !result.message?.includes("error")) {
                sessionStorage.setItem("isAuthorised", "true");
                sessionStorage.setItem("username", userInfo.username);
                navigate("/Home");
            } else {
                setError(result.message || "Registration failed");
            }
        } catch (error) {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithub = () => {
        window.open("http://localhost:5001/api/Auth/github", "_self");
    };

    const resetForm = () => {
        setUserInfo({
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
        setError("");
        setValidationErrors({});
        setPasswordStrength("");
    };

    const switchMode = (mode) => {
        setIsSignUpActive(mode);
        resetForm();
    };

    const handleInputChange = (field, value) => {
        setUserInfo({...userInfo, [field]: value});
        
        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors({...validationErrors, [field]: ""});
        }
        
        // Update password strength
        if (field === 'password' && isSignUpActive) {
            setPasswordStrength(validatePassword(value));
        }
    };

    const getPasswordStrengthColor = () => {
        switch(passwordStrength) {
            case 'weak': return '#e74c3c';
            case 'medium': return '#f39c12';
            case 'strong': return '#27ae60';
            default: return '#dee2e6';
        }
    };

    const getPasswordStrengthText = () => {
        switch(passwordStrength) {
            case 'weak': return 'Weak';
            case 'medium': return 'Medium';
            case 'strong': return 'Strong';
            default: return '';
        }
    };

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
                        disabled={isLoading}
                    >
                        Login
                    </button>
                    <button 
                        className={`auth-tab ${isSignUpActive ? 'active' : ''}`}
                        onClick={() => switchMode(true)}
                        disabled={isLoading}
                    >
                        Sign Up
                    </button>
                </div>
                
                <div className="auth-form-container">
                    {isSignUpActive ? (
                        <form className="auth-form" onSubmit={handleSignUp}>
                            <div className="form-group">
                                <label htmlFor="signup-username">Username</label>
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        id="signup-username"
                                        type="text"
                                        placeholder="Choose a username (no spaces)"
                                        value={userInfo.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        className={validationErrors.username ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                </div>
                                {validationErrors.username && (
                                    <div className="field-error">{validationErrors.username}</div>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-email">Email</label>
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        id="signup-email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={userInfo.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={validationErrors.email ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                </div>
                                {validationErrors.email && (
                                    <div className="field-error">{validationErrors.email}</div>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-password">Password</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={userInfo.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={validationErrors.password ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {passwordStrength && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div 
                                                className="strength-fill" 
                                                style={{ 
                                                    width: passwordStrength === 'weak' ? '33%' : 
                                                           passwordStrength === 'medium' ? '66%' : '100%',
                                                    backgroundColor: getPasswordStrengthColor()
                                                }}
                                            ></div>
                                        </div>
                                        <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                )}
                                {validationErrors.password && (
                                    <div className="field-error">{validationErrors.password}</div>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="signup-confirm">Confirm Password</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        id="signup-confirm"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={userInfo.password_confirmation}
                                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                        className={validationErrors.password_confirmation ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {validationErrors.password_confirmation && (
                                    <div className="field-error">{validationErrors.password_confirmation}</div>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="auth-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="spinner" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="login-username">Username</label>
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        id="login-username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={userInfo.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        className={validationErrors.username ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                </div>
                                {validationErrors.username && (
                                    <div className="field-error">{validationErrors.username}</div>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="login-password">Password</label>
                                <div className="input-wrapper">
                                    <FaLock className="input-icon" />
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={userInfo.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={validationErrors.password ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <div className="field-error">{validationErrors.password}</div>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="auth-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="spinner" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>
                    )}
                    
                    {error && <div className="auth-error">{error}</div>}
                    
                    <div className="auth-divider">
                        <span>Or</span>
                    </div>
                    
                    <button 
                        onClick={handleGithub} 
                        className="auth-social-btn"
                        disabled={isLoading}
                    >
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
                            onClick={() => !isLoading && switchMode(!isSignUpActive)}
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