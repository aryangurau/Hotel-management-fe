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
export const isValidRole = (role = []) => {
  // Check the token validity
  const isValidLogin = isLoggedIn();
  if (!isValidLogin) return false;
  // check if there is no roles to check
  if (role === "") return true;
  // check user detail from token
  const token = getToken();
  const user = jwtDecode(token);
  // compare the role from the token to that of the user sent
  const isValidRole = role.some((r) => user.roles.includes(r));
  if (!isValidRole) return false;
  return true;
};