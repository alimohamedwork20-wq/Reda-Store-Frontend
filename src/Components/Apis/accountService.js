import { showSuccess, showError } from "../Helper/toastCustom";
import apiClient from "./apiClient";

export const accountService = {
  changeName: (name) =>
    apiClient.post("Account/change-name", { Name: name }),

  sendOtp: (email) =>
    apiClient.post("Auth/send-otp", { Email: email }),

  changeEmail: (newEmail, code) =>
    apiClient.post("Account/change-email", {
      NewEmail: newEmail,
      Code: code,
    }),

  savePhone: (phone, email, code) =>
    apiClient.post("Account/add-phone", {
      Phone: phone,
      Email: email,
      Code: code,
    }),

  changePassword: (oldPassword, newPassword) =>
    apiClient.post("Account/change-password", {
      OldPassword: oldPassword,
      NewPassword: newPassword,
    }),

  login: (email, password) =>
    apiClient.post("Auth/login", {
      Email: email,
      Password: password,
    }),

  register: (email, password, name) =>
    apiClient.post("Auth/register", {
      Email: email,
      Password: password,
      Name: name,
    }),

  contact: (name, email, message) =>
    apiClient.post("WebServices/submit-contact-form", {
      Email: email,
      Message: message,
      Name: name,
    }),

  report: (category, subject, description, screenshot) => {
    const formData = new FormData();
    formData.append("Category", category);
    formData.append("Subject", subject);
    formData.append("Description", description);

    if (screenshot) {
      formData.append("Screenshot", screenshot);
    }

    return apiClient.post("WebServices/submit-report", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  ImageProfile: (image) => {
    const formData = new FormData();
    formData.append("Image", image);

    return apiClient.post("Account/add-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  RemoveImageProfile: () =>
    apiClient.delete("Account/remove-profile-image"),

  deleteAccount: () =>
    apiClient.delete("Account/delete-account"),

  AddToCart: (productId) =>
    apiClient.post(`Products/product/${productId}/add-to-cart`),

  GetProductsInCart: () =>
    apiClient.get("Products/cart"),

  RemoveFromCart: (productId) =>
    apiClient.delete(`Products/cart/delete/${productId}`),

  RemoveAllProductsFromCart: () =>
    apiClient.delete("Products/cart/delete-all"),

  AddToFavorite: (productId) =>
    apiClient
      .post(`Products/product/${productId}/add-to-favorite`)
      .then(() => showSuccess("Product added to Favorite successfully"))
      .catch((error) => {
        showError("An error occurred during the update");
        return Promise.reject(error);
      }),

  RemoveFromFavorIte: (productId) =>
    apiClient
      .delete(`Products/product/${productId}/remove-from-favorite`)
      .then(() => showSuccess("Removed Product from Favorite successfully"))
      .catch((error) => {
        showError("An error occurred during deletion.");
        return Promise.reject(error);
      }),

  GetProductsFromFavorite: () =>
    apiClient.get("Products/product/show-favoriteItems"),

  ForgotPassword: (email) =>
    apiClient.post("Auth/forgot-password", { Email: email }),

  CheckCodeToResetPassword: (email, code) =>
    apiClient.post("Auth/check-code", { Email: email, Code: code }),

  ResetPassword: (email, password) =>
    apiClient.post("Auth/reset-password", {
      Email: email,
      NewPassword: password,
    }),

  GetProductWithSearch: (term) =>
    apiClient.get(
      `Products/products/search?term=${encodeURIComponent(term)}`
    ),

  GetProducts: (api) =>
    apiClient.get(
      `Products/products/category/${encodeURIComponent(api)}`
    ),

  GetAddresses: () =>
    apiClient.get("Account/get-user-addresses"),

  AddAddress: (address) => {
    const { userId: _ignoredUserId, ...addressData } = address || {};
    return apiClient.post("Account/add-address", addressData);
  },

  DeleteAddress: (addressId) =>
    apiClient.delete("Account/delete-address", {
      data: { addressId },
    }),

  SetDefaultAddress: (addressId) =>
    apiClient.post("Account/set-default-address", { addressId }),

  // 2FA still uses UserIdDto until the backend 2FA endpoints are migrated to claims.
  TurnOnTwoFactor: (userId) =>
    apiClient.post("Auth/turn-on-two-factor", { userId }),

  TurnOffTwoFactor: (userId) =>
    apiClient.post("Auth/turn-off-two-factor", { userId }),

  // GetUserById is intentionally kept because this endpoint can target a specific user.
  GetUserById: (userId) =>
    apiClient.get("Auth/get-user", { params: { userId } }),

  GetProductById: (productId) =>
    apiClient.get(`Products/product/${productId}`),

  GetAllCategories: (lastPart) =>
    apiClient.get(
      `Products/products/category/${encodeURIComponent(lastPart)}`
    ),

  GetAllUsers: () =>
    apiClient.get("WebServices/get-users"),

  UpdateUser: (formData) =>
    apiClient.put("WebServices/update-user", formData),

  DeleteUser: (id) =>
    apiClient.delete(`WebServices/delete-user/${id}`),

  AddUser: (formData) =>
    apiClient.post("WebServices/add-user", {
      Name: formData.name,
      Status: formData.status,
      Email: formData.email,
      Password: formData.password,
      Role: formData.role,
    }),

  GetContacts: () =>
    apiClient.get("WebServices/get-contacts"),

  DeleteContact: (id) =>
    apiClient.delete(`WebServices/delete-contact/${id}`),

  ReadingContact: (id) =>
    apiClient.post("WebServices/read-contact", {
      idContact: id,
    }),

  UnReadingContact: (id) =>
    apiClient.post("WebServices/unread-contact", {
      idContact: id,
    }),

  ReplyContact: (id, message) =>
    apiClient.post("WebServices/reply-contact", {
      idContact: id,
      messageReply: message,
    }),

  GetAllReports: () =>
    apiClient.get("WebServices/get-all-reports"),

  AcceptReport: (id) =>
    apiClient.post(`WebServices/accept-report/${id}`),

  RejectReport: (id) =>
    apiClient.post(`WebServices/reject-report/${id}`),

  DeleteReport: (id) =>
    apiClient.delete(`WebServices/delete-report/${id}`),
};