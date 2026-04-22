import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setTimeout(() => {
        navigate("/");
      }, 100);
    } else {
      navigate("/login?error=oauth_failed");
    }
  }, []);

  return <div>Logging in with Google...</div>;
}
