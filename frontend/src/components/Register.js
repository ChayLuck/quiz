import { useState } from "react";
import API from "../api";

export default function Register({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await API.post("/auth/register", { username, password });
      alert("Registration successful!");
      onSwitch();
    } catch (err) {
      alert("Registration failed.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
      <p onClick={onSwitch} style={{ cursor: "pointer", color: "blue" }}>Already have an account? Login</p>
    </div>
  );
}
