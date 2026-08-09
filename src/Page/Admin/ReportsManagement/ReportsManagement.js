import React, { useEffect, useState } from "react";
import "./ReportsManagement.css";
import { accountService } from "../../../Components/Apis/accountService";
import { showError, showSuccess } from "../../../Components/Helper/toastCustom";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // للبلاغ المختار للعرض في الـ Modal

  const fetchReports = async () => {
    try {
      const res = await accountService.GetAllReports();
      if (res.data) setReports(res.data);
    } catch (err) {
      showError("فشل جلب البلاغات");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // --- القبول ---
  const handleAccept = async (id) => {
    try {
      await accountService.AcceptReport(id);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 1 } : r)),
      );
      showSuccess("تم قبول البلاغ بنجاح");
    } catch (err) {
      showError("حدث خطأ أثناء قبول البلاغ");
    }
  };

  // --- الرفض ---
  const handleReject = async (id) => {
    try {
      await accountService.RejectReport(id);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 2 } : r)),
      );
      showSuccess("تم رفض البلاغ بنجاح");
    } catch (err) {
      showError("حدث خطأ أثناء رفض البلاغ");
    }
  };

  // --- الحذف ---
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت تأكد من حذف هذا البلاغ؟")) {
      try {
        await accountService.DeleteReport(id);
        setReports((prev) => prev.filter((r) => r.id !== id));
        showSuccess("تم حذف البلاغ بنجاح");
      } catch (err) {
        showError("حدث خطأ أثناء الحذف");
      }
    }
  };

  // --- دالة مساعدة لتحديد شارة الحالة ---
  const renderStatusBadge = (status) => {
    if (status === 1) return <span className="badge active">مقبول</span>;
    if (status === 2) return <span className="badge rejected">مرفوض</span>;
    return <span className="badge pending">معلق</span>;
  };

  return (
    <div className="report-card">
      <div className="card-header">
        <h3>🚨 إدارة البلاغات والشكاوى</h3>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>رقم البلاغ</th>
            <th>المُبلّغ</th>
            <th>القسم (Category)</th>
            <th>الموضوع</th>
            <th>التاريخ</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={report.id}>
              <td>#REP-{index + 1}</td>
              <td>{report.user?.name || report.user?.email || "مستخدم"}</td>
              <td>{report.category}</td>
              <td>{report.subject}</td>
              <td>{new Date(report.sentAt).toLocaleDateString("ar-EG")}</td>
              <td>{renderStatusBadge(report.status)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-action details"
                    onClick={() => setSelectedReport(report)}
                  >
                    عرض التفاصيل
                  </button>
                  {report.status === 0 && (
                    <>
                      <button
                        className="btn-action accept"
                        onClick={() => handleAccept(report.id)}
                      >
                        قبول
                      </button>
                      <button
                        className="btn-action reject"
                        onClick={() => handleReject(report.id)}
                      >
                        رفض
                      </button>
                    </>
                  )}
                  <button
                    className="btn-action delete"
                    onClick={() => handleDelete(report.id)}
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Modal عرض تفاصيل البلاغ --- */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>📋 تفاصيل البلاغ #REP-{selectedReport.id}</h4>

            <div className="report-details-body">
              <p>
                <strong>اسم المُبلّغ:</strong>{" "}
                {selectedReport.user?.name || "غير محدد"}
              </p>
              <p>
                <strong>البريد الإلكتروني:</strong>{" "}
                {selectedReport.user?.email || "غير محدد"}
              </p>
              <p>
                <strong>القسم:</strong> {selectedReport.category}
              </p>
              <p>
                <strong>الموضوع:</strong> {selectedReport.subject}
              </p>
              <p>
                <strong>التاريخ:</strong>{" "}
                {new Date(selectedReport.sentAt).toLocaleString("ar-EG")}
              </p>
              <p>
                <strong>الوصف التفصيلي:</strong>
              </p>
              <div className="description-box">
                {selectedReport.description}
              </div>

              {/* عرض الصورة إذا كانت موجودة */}
              {selectedReport.screenshot ? (
                <div className="screenshot-container">
                  <strong>الصورة المرفقة (Screenshot):</strong>
                  <img
                    src={selectedReport.screenshot}
                    alt="تفاصيل البلاغ"
                    className="report-img"
                  />
                </div>
              ) : (
                <p className="no-img">⚠️ لا توجد صورة مرفقة مع هذا البلاغ</p>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setSelectedReport(null)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
