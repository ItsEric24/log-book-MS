import "./SingleDailyLog.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DailyModal from "../../components/DailyModal/DailyModal";

function SingleDailyLog() {
  const [dailyLog, setDailylog] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState(null);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/daily-logs/daily-log/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch daily log. Please try again.");
        }
        const data = await response.json();
        setDailylog(data.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLog();
  }, [id, token]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/daily-logs/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete daily log. Please try again.");
      }
      setIsDeleteModalOpen(false);
      toast.success("Daily log deleted successfully, redirecting...");

      setTimeout(() => {
        navigate("/dashboard/daily-logs");
      }, 2000);

    } catch (error) {
      toast.error(error || "Failed to delete daily log. Please try again.");
    }
  };

  const handleUpdate = () => {
    setUpdateFormData({
      weekNumber: dailyLog.week_number,
      day: dailyLog.day,
      date: dailyLog.date,
      description: dailyLog.description_of_work,
      skillsLearnt: dailyLog.skills_learnt,
    });
    setIsUpdateModalOpen(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/daily-logs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update daily log. Please try again.");
      }

      setIsUpdateModalOpen(false);
      toast.success("Daily log updated successfully. Redirecting...");

      setTimeout(() => { 
        navigate("/dashboard/daily-logs");
      }, 3000);
    } catch (error) {
      toast.error(error || "Failed to update daily log. Please try again.");
    }
  };

  return (
    <div className="log-document-container">
      <header className="log-header">
        <h1>Daily Log Details</h1>
        <p>
          <strong>Week Number:</strong> {dailyLog.week_number}
        </p>
        <p>
          <strong>Day:</strong> {dailyLog.day}
        </p>
        <p>
          <strong>Date:</strong> {new Date(dailyLog.date).toDateString()}
        </p>
        <p>
          <strong>Log ID:</strong> {dailyLog.id}
        </p>
      </header>

      <section className="log-details">
        <h2>Description of Work</h2>
        <p>{dailyLog.description_of_work}</p>
      </section>

      <section className="log-details">
        <h2>Skills Learned</h2>
        <p>{dailyLog.skills_learnt}</p>
      </section>

      <section className="log-actions">
        <button className="delete-button" onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
        <button className="update-button" onClick={handleUpdate}>Update</button>
      </section>

      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onDelete={handleDelete} />

      <DailyModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSave={handleSave}
        initialData={updateFormData}
      />

      <ToastContainer />
    </div>
  );
}

export default SingleDailyLog;
