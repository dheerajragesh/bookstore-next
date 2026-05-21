export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  }

  return null;
};

// ================= ROLE =================

export const getRole = () => {
  const user = getUser();

  return user?.role || null;
};

// ================= ROLE CHECKS =================

export const isAdmin = () => {
  return getRole() === "admin";
};

export const isSeller = () => {
  return getRole() === "seller";
};

export const isUser = () => {
  return getRole() === "user";
};

// ================= LOGOUT =================

export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};