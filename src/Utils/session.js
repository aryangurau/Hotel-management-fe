export const setToken = (data) => sessionStorage.setItem("token", data);
export const getToken = () => sessionStorage.getItem("token");
export const removeToken = () => sessionStorage.removeItem("token");

export const setCurrentUser = (data) => {
  if (typeof data === 'string') {
    sessionStorage.setItem("user", data);
  } else {
    sessionStorage.setItem("user", JSON.stringify(data));
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from session:', error);
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeCurrentUser = () => sessionStorage.removeItem("user");

export const isLoggedIn = () => {
  const user = getCurrentUser();
  const token = getToken();
  return !!(user && token);
};

export const setUserSession = (token, user) => {
  setToken(token);
  setCurrentUser(user);
};

export const removeUserSession = () => {
  removeToken();
  removeCurrentUser();
};

export const removeAll = () => sessionStorage.clear();