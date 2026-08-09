// src/components/UserManagement/UserManagement.jsx
import React, { useEffect, useState } from "react";
import "./UserManagement.css";
import { showError, showSuccess } from "../../../Components/Helper/toastCustom";
import { accountService } from "../../../Components/Apis/accountService";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "User",
    status: true,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsersFromApi();
  }, []);

  // ------------------- Get Users -------------------//
  const fetchUsersFromApi = async () => {
    try {
      const res = await accountService.GetAllUsers();
      if (res && res.data) setUsers(res.data);
    } catch (error) {
      showError("حدث خطأ أثناء جلب المستخدمين");
    }
  };

  // ------------------- Change User -------------------//
  const handleSaveUser = async (e) => {
    e.preventDefault();

    // ------------------- Update User -------------------//
    if (editingId) {
      try {
        const userDto = {
          id: editingId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        };

        const res = await accountService.UpdateUser(userDto);

        if (res) {
          setUsers(
            users.map((u) => (u.id === editingId ? { ...u, ...userDto } : u)),
          );
          if (showSuccess) showSuccess("تم تعديل بيانات المستخدم بنجاح");
        }
      } catch (error) {
        // 🟢 معالجة آمنة للخطأ لمنع الكراش
        const apiError = error.response?.data;
        const errorMsg =
          typeof apiError === "string"
            ? apiError
            : apiError?.title || "فشل تعديل البيانات";

        showError(errorMsg);
      }
    }

    // ------------------- Add User -------------------//
    else {
      try {
        const res = await accountService.AddUser(formData);
        if (res) {
          if (showSuccess) showSuccess("تمت إضافة المستخدم بنجاح");
          fetchUsersFromApi();
        }
      } catch (error) {
        const apiError = error.response?.data;
        let errorMsg = "فشل إضافة المستخدم";
        if (typeof apiError === "string") {
          errorMsg = apiError;
        } else if (apiError?.errors) {
          const firstKey = Object.keys(apiError.errors)[0];
          errorMsg = apiError.errors[firstKey][0];
        } else if (apiError?.title) {
          errorMsg = apiError.title;
        }

        showError(errorMsg);
      }
    }

    closeModal();
  };

  // ------------------- Delete User -------------------//

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "Delete Account",
      text: "Are you sure? You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const res = accountService.DeleteUser(id);
          setUsers(users.filter((u) => u.id !== id));
          if (showSuccess) showSuccess("تم حذف المستخدم بنجاح");
        } catch (error) {
          showError("حدث خطأ أثناء الحذف");
        }
      }
    });
  };

  // --- Modal Helpers ---
  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      id: null,
      name: "",
      email: "",
      password: "",
      role: "User",
      status: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.id);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "", // لا نعرض كلمة المرور القديمة لأسباب أمنية
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="user-card">
      <div className="card-header">
        <h3>👥 إدارة المستخدمين</h3>
        <button className="btn-add" onClick={openAddModal}>
          + إضافة مستخدم
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>الدور</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className="role-badge">{user.role}</span>
              </td>
              <td>
                <span
                  className={`status-badge ${user.status ? "active" : "inactive"}`}
                >
                  {user.status ? "نشط" : "معطل"}
                </span>
              </td>
              <td>
                <button
                  className="btn-action edit"
                  onClick={() => openEditModal(user)}
                >
                  تعديل
                </button>
                <button
                  className="btn-action delete"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal إضافة/تعديل */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{editingId ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}</h4>
            <form onSubmit={handleSaveUser}>
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              {/* حقل كلمة المرور مطلوب فقط عند الإضافة جديدة */}
              {!editingId && (
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              )}

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>

              <select
                value={formData.status ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value === "true",
                  })
                }
              >
                <option value="true">نشط</option>
                <option value="false">معطل</option>
              </select>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  حفظ
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
