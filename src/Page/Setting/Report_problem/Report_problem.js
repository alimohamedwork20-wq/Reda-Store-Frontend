import React, { useState } from "react";
import { accountService } from "../../../Components/Apis/accountService.js";
import "./Report_problem.css";
import {
  showSuccess,
  showError,
} from "../../../Components/Helper/toastCustom.js";
import { getSecureCookie } from "../../../Components/Helper/cookieUtils";

export default function Report_problem() {
  const [problemData, setProblemData] = useState({
    category: "",
    subject: "",
    description: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const handleInputChange = (e) => {
    setProblemData({ ...problemData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return showError("File size is too large! Maximum is 5MB.");
      }
      setScreenshot(file);
      showSuccess(`File "${file.name}" attached!`);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!problemData.category) {
      return showError("Please select a problem category!");
    }

    accountService
      .report(
        problemData.category,
        problemData.subject,
        problemData.description,
        screenshot,
        Number(getSecureCookie("ith_1854")),
      )
      .then(() => {
        showSuccess("Your report has been submitted. We will review it soon!");
      });

    setProblemData({ category: "", subject: "", description: "" });
    setScreenshot(null);
  };

  return (
    <div className="report-container">
      <h2>Report a Problem</h2>
      <p className="subtitle">
        Found a bug or facing an issue? Let us know, and we'll fix it right
        away.
      </p>

      <form onSubmit={handleSubmit} className="report-form-card">
        {/* اختر نوع المشكلة */}
        <div className="input-group">
          <label>Problem Category</label>
          <select
            name="category"
            value={problemData.category}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select what best describes the issue
            </option>
            <option value="account">Account & Login Issues</option>
            <option value="payment">Payment & Checkout Problems</option>
            <option value="shipping">Shipping & Delivery Tracking</option>
            <option value="bug">Technical Bug / Website Glitch</option>
            <option value="other">Other Issue</option>
          </select>
        </div>

        {/* عنوان المشكلة */}
        <div className="input-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={problemData.subject}
            onChange={handleInputChange}
            placeholder="Briefly summarize the issue"
            required
          />
        </div>

        {/* تفاصيل المشكلة */}
        <div className="input-group">
          <label>Detailed Description</label>
          <textarea
            name="description"
            value={problemData.description}
            onChange={handleInputChange}
            placeholder="Please explain the problem you encountered in detail..."
            rows="6"
            required
          ></textarea>
        </div>

        {/* رفع اسكرين شوت */}
        <div className="input-group upload-screenshot-group">
          <label>Attach Screenshot (Optional)</label>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload" className="file-upload-label">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              {screenshot ? (
                <span>{screenshot.name}</span>
              ) : (
                <span>Click to upload image (Max 5MB)</span>
              )}
            </label>
          </div>
        </div>

        {/* زرار الإرسال */}
        <div className="form-actions">
          <button type="submit" className="submit-report-btn">
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
