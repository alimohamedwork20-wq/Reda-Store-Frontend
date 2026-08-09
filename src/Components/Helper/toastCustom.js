import toast from "react-hot-toast";

// الستايل الأساسي المشترك للبوب أب
const baseStyle = {
  minWidth: "350px",
  maxWidth: "500px",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "500",
  borderRadius: "12px",
  padding: "14px 20px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
};

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-center",
    duration: 4000,
    style: baseStyle,
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: "top-center",
    duration: 4000,
    style: {
      ...baseStyle,
      borderLeft: "6px solid #ff4b4b", // إضافة الخط الأحمر الخاص بالخطأ
    },
  });
};
