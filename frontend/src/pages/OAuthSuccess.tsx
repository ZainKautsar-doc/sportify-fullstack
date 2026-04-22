import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setStoredToken, setStoredUser, setStoredRole } from "@/src/lib/storage";
import type { User, UserRole } from "@/src/types/domain";

interface JwtPayload {
  id: number;
  name?: string;
  email: string;
  role: UserRole;
}

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      console.warn("[OAuthSuccess] No token found in URL");
      navigate("/login?error=oauth_failed");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("[OAuthSuccess] Decoded JWT:", decoded);

      // Validate required fields
      if (!decoded.id || !decoded.email || !decoded.role) {
        throw new Error("JWT payload is missing required fields");
      }

      const user: User = {
        id: decoded.id,
        name: decoded.name ?? decoded.email.split("@")[0], // fallback to email prefix
        email: decoded.email,
        role: decoded.role,
      };

      // ✅ Use proper storage helpers (keys: sportify_token, sportify_user, sportify_role)
      setStoredToken(token);
      setStoredUser(user);
      setStoredRole(decoded.role);

      console.log("[OAuthSuccess] Auth stored. Redirecting to /...");
      // Full page reload so useAuth re-reads localStorage on mount
      window.location.href = "/";
    } catch (err) {
      console.error("[OAuthSuccess] Failed to decode token:", err);
      navigate("/login?error=oauth_failed");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500 text-sm animate-pulse">Logging in with Google...</p>
    </div>
  );
}
