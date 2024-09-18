export const setToken = (data) => localStorage.setItem("access_token", data);
export const getToken = () => localStorage.getItem("access_token");
export const removeToken = () => localStorage.removeItem("access_token");

export const setCurrentUser = (data) =>
  localStorage.setItem("currentUser", JSON.stringify(data));
export const getCurrentUser = () => localStorage.getItem("currentUser");
export const removeCurrentUser = () => localStorage.removeItem("currentUser");

export const removeAll = () => localStorage.clear();