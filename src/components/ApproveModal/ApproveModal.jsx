/* eslint-disable react/prop-types */
import { useState } from "react";
import "./ApproveModal.css";

const ApproveModal = ({ isOpen, onClose, onApprove }) => {
  const [formData, setFormData] = useState({
    supervisor_comments: "",
    signed_by: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleApprove = () => {
    onApprove(formData);
    onClose();
    setFormData({
      supervisor_comments: "",
      signed_by: "",
    });
  };

  return (
    <div className="approve-modal-overlay">
      <div className="approve-modal-container">
        <div className="approve-modal-header">
          <h2>Approve Document</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="approve-modal-body">
          <form className="approve-modal-form" onSubmit={handleApprove}>
            <label>
              Supervisor Comments:
              <textarea
                name="supervisor_comments"
                value={formData.supervisor_comments}
                onChange={handleChange}
                placeholder="Enter comments"
              />
            </label>
            <label>
              Signed By:
              <input
                type="text"
                name="signed_by"
                value={formData.signed_by}
                onChange={handleChange}
                placeholder="Enter your name"
                required={true}
              />
            </label>
            <div className="approve-modal-footer">
              <button className="approve-button">Approve</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
