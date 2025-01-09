export const setToken = (token) => {
  if (!token) {
    console.error('Attempted to set null/undefined token');
    return;
  }
  console.log('Setting token in session storage');
  sessionStorage.setItem("token", token);
};

export const getToken = () => {
  const token = sessionStorage.getItem("token");
  console.log('Getting token from session storage:', token ? 'Found' : 'Not found');
  return token;
};

export const removeToken = () => {
  console.log('Removing token from session storage');
  sessionStorage.removeItem("token");
};

export const setCurrentUser = (data) => {
  if (!data) {
    console.error('Attempted to set null/undefined user data');
    return;
  }
  
  try {
    const userData = typeof data === 'string' ? data : JSON.stringify(data);
    console.log('Setting user data in session storage:', {
      id: data._id,
      email: data.email,
      roles: data.roles
    });
    sessionStorage.setItem("user", userData);
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) {
      console.log('No user data found in session storage');
      return null;
    }
    
    const userData = JSON.parse(userStr);
    console.log('Got user data from session storage:', {
      id: userData._id,
      email: userData.email,
      roles: userData.roles
    });
    return userData;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeCurrentUser = () => {
  console.log('Removing user data from session storage');
  sessionStorage.removeItem("user");
};

export const isLoggedIn = () => {
  const user = getCurrentUser();
  const token = getToken();
  const isLoggedInStatus = !!(user && token);
  console.log('Checking login status:', {
    hasUser: !!user,
    hasToken: !!token,
    isLoggedIn: isLoggedInStatus
  });
  return isLoggedInStatus;
};

export const setUserSession = (token, user) => {
  console.log('Setting up user session');
  setToken(token);
  setCurrentUser(user);
};

export const removeUserSession = () => {
  console.log('Removing user session');
  removeToken();
  removeCurrentUser();
};

export const removeAll = () => {
  console.log('Clearing all session storage');
  sessionStorage.clear();
};