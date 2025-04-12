import { useEffect, useState } from "react";
import "./DailyModal.css";

// eslint-disable-next-line react/prop-types
const DailyModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    weekNumber: "",
    day: "",
    date: "",
    description: "",
    skillsLearnt: "",
  });
  const [formErrors, setFormErrors] = useState("");
  const student = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "weekNumber") {
      const weekNumber = Number(value);
      if (weekNumber < 1 || weekNumber > 12) {
        setFormErrors("Week number must be between 1 and 12");
      } else {
        setFormErrors("");
      }
    }
    setFormData({ ...formData, [name]: name === "weekNumber" ? Number(value) : value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ studentId: student.id, ...formData });
    onClose();
    setFormData({
      weekNumber: "",
      day: "",
      date: "",
      description: "",
      skillsLearnt: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="daily-modal-overlay">
      <div className="daily-modal-content">
        <button className="daily-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Work Details for week {formData.weekNumber ? formData.weekNumber : "1"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          <div className="daily-modal-form-group">
            <label htmlFor="weekNumber">Week</label>
            <select
              id="weekNumber"
              name="weekNumber"
              value={formData.weekNumber}
              onChange={handleChange}
              required
            >
            <option defaultValue={true} value="">--Select Week--</option>
              {[...Array(12).keys()].map((week) => (
                <option key={week + 1} value={week + 1}>
                  Week {week + 1}
                </option>
              ))}
            </select>
          </div>
          {formErrors && (
            <p style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}>
              {formErrors}
            </p>
          )}
          <div className="daily-modal-form-group">
            <label htmlFor="day">Day</label>
            <input
              type="text"
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              required
            />
          </div>
          <div className="daily-modal-form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="daily-modal-form-group">
            <label htmlFor="description">Description of Work</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="daily-modal-form-group">
            <label htmlFor="skills">Skills Learnt</label>
            <textarea
              id="skills"
              name="skillsLearnt"
              value={formData.skillsLearnt}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="daily-modal-save"
            disabled={!!formErrors}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyModal;
