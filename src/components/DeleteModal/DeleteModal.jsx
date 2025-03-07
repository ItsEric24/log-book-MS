/* eslint-disable react/prop-types */
import "./DeleteModal.css"; // Optional: Add custom styles

const DeleteModal = ({ isOpen, onClose, onDelete }) => {

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>

        <div className="delete-modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
