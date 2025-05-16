import './SignUpPage.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function SignUpPage() {
    const [UserInfo, setUserInfo] = useState({
        username: '',
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [Error, setError] = useState("");

    const [isSignUpPart, setIsSignUpPart] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("isAuthorised") === "false") return;

        const timer = setTimeout(() => {
            fetch("http://localhost:5001/api/Auth/login/success", {
                method: "GET",
                credentials: "include"
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        sessionStorage.setItem("isAuthorised", "true");
                        sessionStorage.setItem("username", data.user.username || data.user.displayName);
                        navigate("/Home");
                    }
                })
                .catch(err => console.log("Github login error:", err));
        },300)
    }, []);


    function handleLogin(e){
        setError("");
        if(!UserInfo.email && !UserInfo.password){
            setError("Input field is required.");
        }else{
            fetch("http://localhost:5001/api/Users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: UserInfo.username,
                    password: UserInfo.password,
                })
            }).then(res => res.json())
                .then(result => {
                    if (result.success) {
                        sessionStorage.setItem("isAuthorised", "true");
                        sessionStorage.setItem("username", result.username);
                        navigate("/Home");
                    }else {
                        setError(result.message || "Login failed");
                    }
                })
                .catch(error => setError(error.message));
        }
    }

    function handleGithub(){
        window.open("http://localhost:5001/api/Auth/github", "_self")
    }

    function handleSignUp(){
        setError("");
        if(!UserInfo.username && UserInfo.email && !UserInfo.password && !UserInfo.password_confirmation){
            setError("Input field is required");
        }else if(UserInfo.password !== UserInfo.password_confirmation){
            setError("Passwords do not match");
        }else{
            fetch('http://localhost:5001/api/Users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: UserInfo.username,
                    password: UserInfo.password,
                    email: UserInfo.email,
                })
            }).then(res => res.json())
                .then(result => {
                    setError(result.message);
                    sessionStorage.setItem("isAuthorised", "true");
                    sessionStorage.setItem("username", UserInfo.username);
                    navigate("/Home");
                })
                .catch(error => setError(error.message));
        }
    }

    const resetPage = (booleanType) => {
        setIsSignUpPart(booleanType);
        setError("");
        setUserInfo({
            username: '',
            email: '',
            password: '',
            password_confirmation: '',
        });
    }

    return (
        <div className={"SignUpPage"}>
            <div className={"Button-Section"}>
                <button onClick={() => resetPage(true)}>SignUp</button>
                <button onClick={() => resetPage(false)}>Login</button>
            </div>

            {isSignUpPart ? (
                <>
                    <h2>SignUp</h2>
                    <input
                        placeholder={"Username (No space)"}
                        value={UserInfo.username}
                        onChange={(e) => setUserInfo({...UserInfo, username: e.target.value})}
                    />
                    <input
                        placeholder={"Email"}
                        value={UserInfo.email}
                        onChange={(e) => setUserInfo({...UserInfo, email: e.target.value})}
                    />
                    <input
                        type="password"
                        value={UserInfo.password}
                        placeholder={"Password"}
                        onChange={(e) => setUserInfo({...UserInfo, password: e.target.value})}
                    />
                    <input
                        type="password"
                        value={UserInfo.password_confirmation}
                        placeholder={"Confirm Password"}
                        onChange={(e) => setUserInfo({...UserInfo, password_confirmation: e.target.value})}
                    />
                    <button onClick={handleSignUp} className={"Confirm-Button"}>SignUp</button>
                    <h3>{Error}</h3>
                </>
            ) : (
                <>
                    <h2>Login</h2>
                    <input
                        placeholder={"Username"}
                        value={UserInfo.username}
                        onChange={(e) => setUserInfo({...UserInfo, username: e.target.value})}
                    />
                    <input
                        type="password"
                        placeholder={"Password"}
                        value={UserInfo.password}
                        onChange={(e) => setUserInfo({...UserInfo, password: e.target.value})}
                    />
                    <button onClick={handleLogin} className={"Confirm-Button"}>Login</button>
                    <h3>{Error}</h3>
                </>
            )}

            <button onClick={handleGithub} className={"Confirm-Button"}>Login with Github</button>
        </div>
        )
}

export default SignUpPage;