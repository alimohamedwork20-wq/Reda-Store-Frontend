// src/Services/accountService.js
import ResetPassword from "../../Page/Auth/CheckCodeToResetPassword";
import { showSuccess, showError } from "../Helper/toastCustom";
import apiClient from "./apiClient";

export const accountService = {
  changeName: (id, name) =>
    apiClient.post("Account/change-name", { Name: name, userId: id }),

  //------------------------------------------------------------------------------//
  sendOtp: (email) => apiClient.post("Auth/send-otp", { Email: email }),

  //------------------------------------------------------------------------------//
  changeEmail: (userId, newEmail, code) =>
    apiClient.post(`Account/change-email`, {
      userId: userId,
      NewEmail: newEmail,
      Code: code,
    }),

  //------------------------------------------------------------------------------//
  savePhone: (userId, phone, email, code) =>
    apiClient.post(`Account/add-phone`, {
      userId: userId,
      Phone: phone,
      Email: email,
      Code: code,
    }),

  changePassword: (userId, oldPassword, newPassword) =>
    apiClient.post(`Account/change-password`, {
      userId: userId,
      OldPassword: oldPassword,
      NewPassword: newPassword,
    }),
  //------------------------------------------------------------------------------//
  login: (email, password) =>
    apiClient.post("Auth/login", {
      Email: email,
      Password: password,
    }),

  //------------------------------------------------------------------------------//
  register: (email, password, name) =>
    apiClient.post("Auth/register", {
      Email: email,
      Password: password,
      Name: name,
    }),

  //------------------------------------------------------------------------------//
  contact: (name, email, message) =>
    apiClient.post("WebServices/submit-contact-form", {
      Email: email,
      Message: message,
      Name: name,
    }),

  //------------------------------------------------------------------------------//
  report: (category, subject, description, screenshot, userId) => {
    const formData = new FormData();
    formData.append("Category", category);
    formData.append("Subject", subject);
    formData.append("Description", description);
    formData.append("UserId", userId);
    if (screenshot) {
      formData.append("Screenshot", screenshot);
    }
    return apiClient.post("WebServices/submit-report", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  //------------------------------------------------------------------------------//
  ImageProfile: (image, id) => {
    const formData = new FormData();
    formData.append("Image", image);
    return apiClient.post(`Account/add-profile-image/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  //------------------------------------------------------------------------------//
  RemoveImageProfile: (userId) =>
    apiClient.delete(`Account/remove-profile-image`, {
      data: { userId: userId },
    }),

  //------------------------------------------------------------------------------//
  deleteAccount: (userId) =>
    apiClient.delete(`Account/delete-account`, { data: { userId: userId } }),

  //------------------------------------------------------------------------------//
  AddToCart: (userId, productId) =>
    apiClient.post(`Products/product/${productId}/add-to-cart`, {
      userId: userId,
    }),

  //------------------------------------------------------------------------------//
  GetProductsInCart: (userId) =>
    apiClient.get(`Products/cart`, { params: { userId } }),

  //------------------------------------------------------------------------------//
  RemoveFromCart: (userId, productId) =>
    apiClient.delete(`Products/cart/delete/${productId}`, {
      data: { userId: userId },
    }),

  //------------------------------------------------------------------------------//
  RemoveAllProductsFromCart: (userId) =>
    apiClient.delete(`Products/cart/delete-all`, { data: { userId: userId } }),

  //------------------------------------------------------------------------------//
  AddToFavorite: (userId, productId) => {
    return apiClient
      .post(`Products/product/${productId}/add-to-favorite`, { userId: userId })
      .then(() => {
        showSuccess("Product added to Favorite successfully");
      })
      .catch((error) => {
        showError("An error occurred during the update");
      });
  },
  //------------------------------------------------------------------------------//
  RemoveFromFavorIte: (userId, productId) => {
    return apiClient
      .delete(`Products/product/${productId}/remove-from-favorite`, {
        data: { userId: userId },
      })
      .then((data) => showSuccess("Removed Product from Favorite successfully"))
      .catch((error) => {
        showError("An error occurred during deletion.");
      });
  },

  //------------------------------------------------------------------------------//
  GetProductsFromFavorite: (userId) => {
    return apiClient.get(`Products/product/show-favoriteItems`, {
      params: { userId },
    });
  },

  //------------------------------------------------------------------------------//
  ForgotPassword: (email) => {
    return apiClient.post(`Auth/forgot-password`, { Email: email });
  },

  //------------------------------------------------------------------------------//
  CheckCodeToResetPassword: (email, code) => {
    return apiClient.post("Auth/check-code", { Email: email, Code: code });
  },

  //------------------------------------------------------------------------------//
  ResetPassword: (email, password) => {
    return apiClient.post("Auth/reset-password", {
      Email: email,
      NewPassword: password,
    });
  },

  //------------------------------------------------------------------------------//
  GetProductWithSearch: (term) => {
    return apiClient.get(`Products/products/search?term=${term}`);
  },

  //------------------------------------------------------------------------------//
  GetProducts: (api) => {
    return apiClient.get(`Products/products/category/${api}`);
  },
  //------------------------------------------------------------------------------//
  GetAddresses: (userId) => {
    return apiClient.get(`Account/get-user-addresses`, { params: { userId } });
  },
  //------------------------------------------------------------------------------//
  AddAddress: (address) => {
    return apiClient.post(`Account/add-address`, address);
  },
  //------------------------------------------------------------------------------//
  DeleteAddress: (addressId, userId) => {
    return apiClient.delete(`Account/delete-address`, {
      data: { addressId, userId },
    });
  },
  //------------------------------------------------------------------------------//
  SetDefaultAddress: (addressId, userId) => {
    return apiClient.post(`Account/set-default-address`, {
      addressId: addressId,
      userId: userId,
    });
  },
  //------------------------------------------------------------------------------//
  TurnOnTwoFactor: (userId) => {
    return apiClient.post(`Auth/turn-on-two-factor`, { userId: userId });
  },
  //------------------------------------------------------------------------------//
  TurnOffTwoFactor: (userId) => {
    return apiClient.post(`Auth/turn-off-two-factor`, { userId: userId });
  },
  //------------------------------------------------------------------------------//
  GetUserById: (userId) => {
    return apiClient.get(`Auth/get-user`, { params: { userId } });
  },
  //------------------------------------------------------------------------------//
  GetProductById: (productId) => {
    return apiClient.get(`Products/product/${productId}`);
  },
  //------------------------------------------------------------------------------//
  GetAllCategories: (lastPart) => {
    return apiClient.get(`Products/products/category/${lastPart}`);
  },
  //------------------------------------------------------------------------------//
  GetAllUsers: () => {
    return apiClient.get(`WebServices/get-users`);
  },
  //------------------------------------------------------------------------------//
  UpdateUser: (formData) => {
    return apiClient.put(`WebServices/update-user`, formData);
  },
  //------------------------------------------------------------------------------//
  DeleteUser: (id) => {
    return apiClient.delete(`WebServices/delete-user/${id}`);
  },
  //------------------------------------------------------------------------------//
  AddUser: (formData) => {
    return apiClient.post(`WebServices/add-user`, {
      Name: formData.name,
      Status: formData.status,
      Email: formData.email,
      Password: formData.password,
      Role: formData.role,
    });
  },
  //------------------------------------------------------------------------------//
  GetContacts: () => {
    return apiClient.get("WebServices/get-contacts", {});
  },
  //------------------------------------------------------------------------------//
  DeleteContact: (id) => {
    return apiClient.delete(`WebServices/delete-contact/${id}`, {});
  },
  //------------------------------------------------------------------------------//
  ReadingContact: (id) => {
    return apiClient.post("WebServices/read-contact", { idContact: id });
  },
  //------------------------------------------------------------------------------//
  UnReadingContact: (id) => {
    return apiClient.post("WebServices/unread-contact", { idContact: id });
  },
  //------------------------------------------------------------------------------//
  ReplyContact: (id, message) => {
    return apiClient.post("WebServices/reply-contact", {
      idContact: id,
      messageReply: message,
    });
  },
  //------------------------------------------------------------------------------//
  GetAllReports: () => {
    return apiClient.get("WebServices/get-all-reports");
  },
  //------------------------------------------------------------------------------//
  AcceptReport: (id) => {
    return apiClient.post(`WebServices/accept-report/${id}`);
  },
  //------------------------------------------------------------------------------//
  RejectReport: (id) => {
    return apiClient.post(`WebServices/reject-report/${id}`);
  },
  //------------------------------------------------------------------------------//
  DeleteReport: (id) => {
    return apiClient.delete(`WebServices/delete-report/${id}`);
  },
};
