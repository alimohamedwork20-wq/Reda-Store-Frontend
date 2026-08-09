// src/components/ContactManagement/ContactManagement.jsx
import React, { useEffect, useState } from "react";
import "./ContactManagement.css";
import { accountService } from "../../../Components/Apis/accountService";
import { showError, showSuccess } from "../../../Components/Helper/toastCustom";

const ContactManagement = () => {
  const [messages, setMessages] = useState([]);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const FetchContacts = async () => {
    try {
      const res = await accountService.GetContacts();
      if (res.data) setMessages(res.data);
    } catch (err) {
      showError("فشل جلب الرسائل");
    }
  };

  useEffect(() => {
    FetchContacts();
  }, []);

  //------------------ handle Toggle Read ------------------//
  const handleToggleRead = async (id, currentIsRead) => {
    try {
      if (!currentIsRead) {
        await accountService.ReadingContact(id);
      } else {
        await accountService.UnReadingContact(id);
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, isRead: !currentIsRead, IsRead: !currentIsRead }
            : m,
        ),
      );

      showSuccess(
        !currentIsRead
          ? "تم تحديد الرسالة كمقروءة"
          : "تم تحديد الرسالة كغير مقروءة",
      );
    } catch (err) {
      showError("حدث خطأ أثناء تغيير حالة الرسالة");
    }
  };

  //------------------ handle Send Reply ------------------//
  const handleSendReply = async (id) => {
    if (!replyText.trim()) return;

    try {
      // 🟢 1. استدعاء API الـ Reply
      await accountService.ReplyContact(id, replyText);

      // 🟢 2. تحديث الـ State مباشرةً لإظهار الرد بدون تحمييل من جديد
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                isReply: replyText,
                IsReply: replyText,
                isRead: true,
                IsRead: true,
              }
            : m,
        ),
      );

      showSuccess("تم إرسال الرد بنجاح");
      setReplyText("");
      setActiveReplyId(null);
    } catch (err) {
      showError("فشل إرسال الرد");
    }
  };

  //------------------ handle Delete Message ------------------//
  const handleDeleteMessage = async (id) => {
    if (window.confirm("هل أنت تأكد من حذف هذه الرسالة؟")) {
      try {
        await accountService.DeleteContact(id);
        setMessages(messages.filter((m) => m.id !== id));
        showSuccess("تم الحذف بنجاح");
      } catch (err) {
        showError("حدث خطا اثناء الحذف");
      }
    }
  };

  const unreadCount = messages.filter((m) => !(m.isRead ?? m.IsRead)).length;

  return (
    <div className="contact-card">
      <div className="card-header">
        <h3>💬 الرسائل والتواصل</h3>
        <span className="unread-count">{unreadCount} غير مقروءة</span>
      </div>

      <div className="message-list">
        {messages.map((msg) => {
          const isMsgRead = msg.isRead ?? msg.IsRead ?? false;
          const replyContent = msg.isReply ?? msg.IsReply; // 🟢 جلب نص الرد إن وجد

          return (
            <div
              key={msg.id}
              className={`message-item ${!isMsgRead ? "unread" : ""}`}
            >
              <div className="message-main-info">
                <div className="message-header">
                  <h4>{msg.name}</h4>
                  <span className="date">{msg.date}</span>
                </div>
                <p className="subject">{msg.email}</p>
                <p className="content-text">{msg.message}</p>

                {/* 🟢 عرض نص الرد تحت الرسالة فقط إذا كان الرد موجوداً */}
                {replyContent && (
                  <div className="reply-display-box">
                    <strong>↩️ الرد المرسل:</strong>
                    <p>{replyContent}</p>
                  </div>
                )}
              </div>

              <div className="message-actions">
                <button
                  className="btn-msg"
                  onClick={() => handleToggleRead(msg.id, isMsgRead)}
                >
                  {!isMsgRead ? "تحديد كـ مقروء" : "تحديد كـ غير مقروء"}
                </button>
                <button
                  className="btn-msg reply"
                  onClick={() => {
                    setActiveReplyId(activeReplyId === msg.id ? null : msg.id);
                    setReplyText(""); // تفريغ النص عند الفتح/الإغلاق
                  }}
                >
                  {activeReplyId === msg.id ? "إلغاء" : "رد"}
                </button>
                <button
                  className="btn-msg delete"
                  onClick={() => handleDeleteMessage(msg.id)}
                >
                  حذف
                </button>
              </div>

              {/* مربع كتابة الرد */}
              {activeReplyId === msg.id && (
                <div className="reply-box">
                  <textarea
                    rows="3"
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button
                    className="btn-send-reply"
                    onClick={() => handleSendReply(msg.id)}
                  >
                    إرسال الرد
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactManagement;
