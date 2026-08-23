import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config";

const AuthContext = createContext();

const DEMO_USERS = [
  {
    _id: "u-admin",
    name: "Laishram Admin",
    email: "admin@emung.org",
    role: "admin",
    family: {
      _id: "fam-1",
      name: "Emung Family Heritage",
      familyCode: "EMUNG-MAIN",
      settings: { allowMemberAddMember: true, allowMemberCreateEvent: true },
    },
    memberProfile: "m5",
    token: "demo-admin-token",
  },
  {
    _id: "u-member",
    name: "Yaiphaba Member",
    email: "member@emung.org",
    role: "member",
    family: {
      _id: "fam-1",
      name: "Emung Family Heritage",
      familyCode: "EMUNG-MAIN",
      settings: { allowMemberAddMember: true, allowMemberCreateEvent: true },
    },
    memberProfile: "m7",
    token: "demo-member-token",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("emung_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("emung_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // Check demo tokens first for offline static mode
      if (token.startsWith("demo-")) {
        const found = DEMO_USERS.find((u) => u.token === token);
        if (found) {
          setUser(found);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("emung_user", JSON.stringify(data));
        } else {
          // Keep saved user if backend offline
          console.warn("Backend auth offline, using static user state");
        }
      } catch (err) {
        console.warn("Auth check using offline fallback user:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    // Check static demo users first
    const demo = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (password === "admin123" || password === "member123")
    );

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("emung_token", data.token);
        localStorage.setItem("emung_user", JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return data;
      }
    } catch {
      // Offline fallback
    }

    if (demo) {
      localStorage.setItem("emung_token", demo.token);
      localStorage.setItem("emung_user", JSON.stringify(demo));
      setToken(demo.token);
      setUser(demo);
      return demo;
    }

    throw new Error("Invalid email or password");
  };

  const register = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("emung_token", data.token);
        localStorage.setItem("emung_user", JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return data;
      }
    } catch {
      // Offline fallback registration
    }

    const newUser = {
      _id: `u-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.familyName ? "admin" : "member",
      family: {
        _id: "fam-1",
        name: formData.familyName || "Emung Family Heritage",
        familyCode: formData.familyCode || "EMUNG-MAIN",
        settings: { allowMemberAddMember: true, allowMemberCreateEvent: true },
      },
      token: `demo-token-${Date.now()}`,
    };

    localStorage.setItem("emung_token", newUser.token);
    localStorage.setItem("emung_user", JSON.stringify(newUser));
    setToken(newUser.token);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("emung_token");
    localStorage.removeItem("emung_user");
    setToken(null);
    setUser(null);
  };

  // Helper permissions
  const isAdmin = user && user.role === "admin";
  const isLoggedIn = !!user;

  const canAddMember = () => {
    if (!user) return true; // Allowed by default in static mode
    if (user.role === "admin") return true;
    return user.family?.settings?.allowMemberAddMember !== false;
  };

  const canCreateEvent = () => {
    if (!user) return true;
    if (user.role === "admin") return true;
    return user.family?.settings?.allowMemberCreateEvent !== false;
  };

  const canEditMember = (member) => {
    if (!user || !member) return true;
    if (user.role === "admin") return true;

    const memberProfileId = user.memberProfile?._id || user.memberProfile;
    if (memberProfileId && String(memberProfileId) === String(member._id)) {
      return true;
    }
    if (member.user && String(member.user) === String(user._id)) {
      return true;
    }
    return false;
  };

  const canDeleteMember = () => {
    return isAdmin;
  };

  const canEditStory = (story) => {
    if (!user || !story) return true;
    if (user.role === "admin") return true;
    return String(story.authorUser) === String(user._id);
  };

  const canDeleteStory = (story) => {
    if (!user || !story) return true;
    if (user.role === "admin") return true;
    return String(story.authorUser) === String(user._id);
  };

  const canEditMemory = (memory) => {
    if (!user || !memory) return true;
    if (user.role === "admin") return true;
    return String(memory.authorUser) === String(user._id);
  };

  const canDeleteMemory = (memory) => {
    if (!user || !memory) return true;
    if (user.role === "admin") return true;
    return String(memory.authorUser) === String(user._id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isLoggedIn,
        canAddMember,
        canCreateEvent,
        canEditMember,
        canDeleteMember,
        canEditStory,
        canDeleteStory,
        canEditMemory,
        canDeleteMemory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
