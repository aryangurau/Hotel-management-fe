export const setToken = (data) => localStorage.setItem("access_token", data);
export const getToken = () => localStorage.getItem("access_token");
export const removeToken = () => localStorage.removeItem("access_token");

export const setCurrentUser = (data) => {
  if (typeof data === 'string') {
    localStorage.setItem("currentUser", data);
  } else {
    localStorage.setItem("currentUser", JSON.stringify(data));
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;
    
    try {
      // Try to parse it as JSON
      return JSON.parse(userStr);
    } catch {
      // If parsing fails, return the string as is
      // (in case it's already stringified JSON)
      return userStr;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeCurrentUser = () => localStorage.removeItem("currentUser");

export const removeAll = () => localStorage.clear();