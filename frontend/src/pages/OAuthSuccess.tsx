import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // 🔥 decode token
      const decoded: any = jwtDecode(token);

      // simpan user
      localStorage.setItem("user", JSON.stringify(decoded));

      // redirect
      window.location.href = "/"; // ⬅️ pakai ini biar full reload
    } else {
      navigate("/login?error=oauth_failed");
    }
  }, []);

  return <div>Logging in with Google...</div>;
}
