import { showSuccess, showError } from "../Helper/toastCustom";
import apiClient from "./apiClient";

export const accountService = {
  // =========================
  // AUTH
  // =========================

  sendOtp: (email, action) =>
    apiClient.post("Auth/send-otp", { Email: email, Action: action }),

  login: (emailOrPhone, password) =>
    apiClient.post("Auth/login", {
      EmailOrPhone: emailOrPhone,
      Password: password,
    }),

  register: (email, password, name) =>
    apiClient.post("Auth/register", {
      Email: email,
      Password: password,
      Name: name,
    }),

  ForgotPassword: (email) =>
    apiClient.post("Auth/forgot-password", { Email: email }),

  CheckCodeToResetPassword: (email, code, action) =>
    apiClient.post("Auth/check-code", {
      Email: email,
      Code: code,
      Action: action,
    }),

  ResetPassword: (email, password) =>
    apiClient.post("Auth/reset-password", {
      Email: email,
      NewPassword: password,
    }),

  TurnOnTwoFactor: () => apiClient.post("Auth/turn-on-two-factor"),

  TurnOffTwoFactor: () => apiClient.post("Auth/turn-off-two-factor"),

  GetUserById: () => apiClient.get("Auth/get-user"),

  // =========================
  // ACCOUNT
  // =========================

  changeName: (name) => apiClient.post("Account/change-name", { Name: name }),

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

  contact: (name, email, message) =>
    apiClient.post("Account/submit-contact-form", {
      Email: email,
      Message: message,
      Name: name,
    }),

  ImageProfile: (image) => {
    const formData = new FormData();
    formData.append("Image", image);

    return apiClient.post("Account/add-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  RemoveImageProfile: () => apiClient.delete("Account/remove-profile-image"),

  deleteAccount: () => apiClient.delete("Account/delete-account"),

  GetAddresses: () => apiClient.get("Account/get-user-addresses"),

  AddAddress: (address) => apiClient.post("Account/add-address", address),

  DeleteAddress: (addressId) =>
    apiClient.delete("Account/delete-address", {
      data: { addressId },
    }),

  SetDefaultAddress: (addressId) =>
    apiClient.post("Account/set-default-address", { addressId }),

  report: (category, subject, description, screenshot) => {
    const formData = new FormData();

    formData.append("Category", category);
    formData.append("Subject", subject);
    formData.append("Description", description);

    if (screenshot) {
      formData.append("Screenshot", screenshot);
    }

    return apiClient.post("Account/submit-report", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // =========================
  // ADMIN
  // =========================

  GetAllUsers: () => apiClient.get("Admin/get-users"),

  UpdateUser: (formData) => apiClient.put("Admin/update-user", formData),

  DeleteUser: (id) => apiClient.delete(`Admin/delete-user/${id}`),

  AddUser: (formData) =>
    apiClient.post("Admin/add-user", {
      Name: formData.name,
      Status: formData.status,
      Email: formData.email,
      Password: formData.password,
      Role: formData.role,
    }),

  GetContacts: () => apiClient.get("Admin/get-contacts"),

  DeleteContact: (id) => apiClient.delete(`Admin/delete-contact/${id}`),

  ReadingContact: (id) =>
    apiClient.post("Admin/read-contact", {
      idContact: id,
    }),

  UnReadingContact: (id) =>
    apiClient.post("Admin/unread-contact", {
      idContact: id,
    }),

  ReplyContact: (id, message) =>
    apiClient.post("Admin/reply-contact", {
      idContact: id,
      messageReply: message,
    }),

  GetAllReports: () => apiClient.get("Admin/get-all-reports"),

  AcceptReport: (id) => apiClient.post(`Admin/accept-report/${id}`),

  RejectReport: (id) => apiClient.post(`Admin/reject-report/${id}`),

  DeleteReport: (id) => apiClient.delete(`Admin/delete-report/${id}`),

  // =========================
  // PRODUCTS
  // =========================

  AddToCart: (productId) =>
    apiClient.post(`Products/product/${productId}/add-to-cart`),

  GetProductsInCart: () => apiClient.get("Products/cart"),

  UpdateCartQuantity: (productId, quantity) =>
    apiClient.put(`Products/cart/${productId}/quantity/${quantity}`),

  RemoveFromCart: (productId) =>
    apiClient.delete(`Products/cart/delete/${productId}`),

  RemoveAllProductsFromCart: () => apiClient.delete("Products/cart/delete-all"),

  AddToFavorite: (productId) =>
    apiClient
      .post(`Products/product/${productId}/add-to-favorite`)
      .then(() => showSuccess("Product added to Favorite successfully"))
      .catch((error) => {
        showError(
          error.response?.data || "An error occurred during the update",
        );
        return Promise.reject(error);
      }),

  RemoveFromFavorIte: (productId) =>
    apiClient
      .delete(`Products/product/${productId}/remove-from-favorite`)
      .then(() => showSuccess("Removed Product from Favorite successfully"))
      .catch((error) => {
        showError(error.response?.data || "An error occurred during deletion.");
        return Promise.reject(error);
      }),

  GetProductsFromFavorite: () =>
    apiClient.get("Products/product/show-favoriteItems"),

  GetProductWithSearch: (term) =>
    apiClient.get(`Products/products/search?term=${encodeURIComponent(term)}`),

  GetProducts: (api) =>
    apiClient.get(`Products/products/category/${encodeURIComponent(api)}`),

  GetProductById: (productId) => apiClient.get(`Products/product/${productId}`),

  GetAllCategories: (lastPart) =>
    apiClient.get(`Products/products/category/${encodeURIComponent(lastPart)}`),
};
