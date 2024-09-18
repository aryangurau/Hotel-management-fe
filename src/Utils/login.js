import moment from "moment";
import { jwtDecode } from "jwt-decode";

import { getToken, setCurrentUser, removeAll } from "./session";

export const isLoggedIn = () => {
  try {
    // Check if token exists or not
    const token = getToken();
    if (!token) return false;
    const { exp } = jwtDecode(token);
    if (!exp) return false;
    const now = moment().unix();
    // Check if token has expired or not
    const timeDiff = moment(exp).diff(moment(now));
    if (timeDiff <= 0) return false;
    return true;
  } catch (e) {
    console.log(e);
    removeAll();
  }
};

export const setLoggedInUser = () => {
  const token = getToken();
  const { name, email, roles } = jwtDecode(token);
  setCurrentUser({ name, email, roles });
};