// src/Components/Helper/cookieUtils.js
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_COOKIE_SECRET || "Reda_Secret_Key_123";
const isDevelopment = process.env.NODE_ENV === "development";

const safeStringify = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

export const setSecureCookie = (key, value, options = {}) => {
  const stringValue = safeStringify(value);
  const defaultOptions = { path: "/", expires: 1, ...options };

  if (isDevelopment) {
    Cookies.set(key, stringValue, defaultOptions);
    return;
  }

  try {
    const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
    Cookies.set(key, encrypted, {
      ...defaultOptions,
      secure: true,
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Cookie Encryption Failed:", error);
    Cookies.set(key, stringValue, defaultOptions);
  }
};

export const getSecureCookie = (key, parseJson = false) => {
  const value = Cookies.get(key);
  if (!value) return null;

  let resultValue = value;

  if (!isDevelopment) {
    try {
      const decrypted = CryptoJS.AES.decrypt(value, SECRET_KEY).toString(
        CryptoJS.enc.Utf8,
      );
      if (decrypted) {
        resultValue = decrypted;
      }
    } catch {
      resultValue = value;
    }
  }

  if (parseJson) {
    try {
      return JSON.parse(resultValue);
    } catch {
      return resultValue;
    }
  }

  return resultValue;
};

export const removeSecureCookie = (key, options = {}) => {
  Cookies.remove(key, { path: "/", ...options });
};

// Identity is taken from the JWT on the backend. There is intentionally no
// separate user-id cookie here.
const USER_FIELDS = [
  "tth_1854",
  "nth_1854",
  "eth_1854",
  "rth_1854",
  "pth_1854",
  "ath_1854",
  "tfh_1854",
];

export const setUserCookies = (userData = {}) => {
  USER_FIELDS.forEach((field) => {
    if (userData[field] !== undefined && userData[field] !== null) {
      setSecureCookie(field, userData[field]);
    }
  });
};

export const getUserCookies = () => {
  return USER_FIELDS.reduce((acc, field) => {
    acc[field] = getSecureCookie(field);
    return acc;
  }, {});
};

export const clearUserCookies = () => {
  USER_FIELDS.forEach((field) => removeSecureCookie(field));

  // Remove the legacy user-id cookie left by older versions.
  removeSecureCookie("ith_1854");
};
