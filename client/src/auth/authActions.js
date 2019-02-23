import base64url from "base64url";
import { HOST_URL } from "../index";
import * as actions from "../store/actions";
import { setFetchHeaders } from "../lib";

const getTokenExpiration = token => {
  const splitToken = token.split(".");
  const parsedToken = JSON.parse(base64url.decode(splitToken[1]));
  return parsedToken.exp;
};

export const fetchTokenPair = (username, password) => async dispatch => {
  const postData = new FormData();
  postData.append("username", username);
  postData.append("password", password);
  const headers = setFetchHeaders("POST", postData, true);
  const response = await fetch(`${HOST_URL}/api/token/`, headers);
  if (response.ok) {
    const responseData = await response.json();
    if (responseData.access && responseData.refresh) {
      localStorage.setItem("accessToken", responseData.access);
      localStorage.setItem("refreshToken", responseData.refresh);
      const accessExp = getTokenExpiration(responseData.access);
      setTimeout(() => {
        refreshTokens();
      }, accessExp * 1000 - Date.now());
      await dispatch(actions.setAuthStatus(true));
    } else {
      dispatch(actions.setAuthStatus(false));
    }
    return response;
  } else {
    return response;
  }
};

const refreshTokens = async () => {
  const postData = new FormData();
  postData.append("refresh", localStorage.getItem("refreshToken"));
  const body = setFetchHeaders("POST", postData, true);
  const response = await fetch(`${HOST_URL}/api/token/refresh/`, body);
  if (response.ok) {
    const responseData = await response.json();
    if (responseData.access) {
      localStorage.setItem("accessToken", responseData.access);
      localStorage.setItem("refreshToken", responseData.refresh);
      const accessExp = getTokenExpiration(responseData.access);
      setTimeout(() => {
        refreshTokens();
      }, accessExp * 1000 - Date.now());
      const refreshExp = getTokenExpiration(responseData.refresh);
      setTimeout(() => {
        if (localStorage.getItem("refreshToken") === responseData.refresh) {
          refreshTokens();
        }
      }, refreshExp * 1000 - Date.now());
    }
  }
  return response;
};

export const readAuthToken = () => async dispatch => {
  let accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    const accessExp = getTokenExpiration(accessToken);
    console.log(accessExp * 1000 <= Date.now());
    if (accessExp * 1000 <= Date.now()) {
      const refreshExp = getTokenExpiration(
        localStorage.getItem("refreshToken")
      );
      if (refreshExp * 1000 > Date.now()) {
        const response = await refreshTokens();
        if (response.ok) {
          await dispatch(actions.setAuthStatus(true));
        }
      }
    } else {
      await dispatch(actions.setAuthStatus(true));
      setTimeout(() => {
        refreshTokens();
      }, accessExp * 1000 - Date.now());
    }
  } else {
    dispatch(actions.setAuthStatus(false));
  }
};

export const logout = () => async dispatch => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  dispatch(actions.setAuthStatus(false));
};
