import { Base_url } from "@/utils/base_url";
import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  LOGOUT_REQUEST,
  CLEAR_ERRORS,
} from "../constants/userConstants";
import axios from "axios";

// Login
export const login = (userData) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(`${Base_url}/login`, userData, config);

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    // Store user data in local storage
    localStorage.setItem("user", JSON.stringify(data.user));
  } catch (error) {
    console.log(error);
    dispatch({ type: LOGIN_FAIL, payload: error.response?.data?.message });
  }
};

// Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(`${Base_url}/register`, userData, config);

    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
    localStorage.setItem("user", JSON.stringify(data.user));
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response?.data?.message,
    });
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get(`${Base_url}/me`, {
      withCredentials: true,
    });

    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
    localStorage.setItem("user", JSON.stringify(data.user));
  } catch (error) {
    console.log(error)
    dispatch({ type: LOAD_USER_FAIL, payload: error.response?.data?.message });
  }
};

// Logout User
export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_REQUEST });
    await axios.get(`${Base_url}/logout`, {
      withCredentials: true,
    });
    localStorage.setItem("user", null);
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
  }
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.patch(`${Base_url}/update-my-details`, userData, config);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};
// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
