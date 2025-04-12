// /* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router";
import "./SingleLogbook.css";
import { useEffect, useState } from "react";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";

function SingleLogbook() {
  const [logbook, setLogbook] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchlogbook = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/logbooks/logbook/${id}`,
          {
            method: "GET",
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
        setLogbook(data.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchlogbook();
  }, [id, token]);

  async function handleDelete() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/logbooks/logbook/${id}`,
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

      setIsModalOpen(false);
      toast.success("Logbook deleted successfully, redirecting...");

      setTimeout(() => {
        navigate("/dashboard/logbooks");
      }, 3000);
    } catch (error) {
      toast.error(error || "Failed to delete daily log. Please try again.");
    }
  }

  if (!logbook || Object.keys(logbook).length === 0) {
    return (
      <p style={{ color: "#525252", textAlign: "center" }}>
        No Logbook to view, submit one to view
      </p>
    );
  }

  async function generatePDF() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/logbooks/logbook/pdf/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/pdf",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = await response.blob();

      // Create a URL for the blob
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "weekly-log.pdf";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="logbook-document">
      <header className="logbook-header">
        <h1>Weekly Logbook Entry</h1>
        <p>
          <strong>Name:</strong> {logbook.student_name}
        </p>
        <p>
          <strong>Week Number:</strong> {logbook.week_number}
        </p>
        <p>
          <strong>Student ID:</strong> {logbook.student_id}
        </p>
        <p>
          <strong>Submission Date:</strong>{" "}
          {new Date(logbook.date).toDateString()}
        </p>
        <p>
          <strong>School:</strong>{" "}
          {logbook.school}
        </p>
      </header>

      {/* Daily Logs */}
      <section className="daily-logs">
        <h2>Daily Logs</h2>
        {logbook.daily_logs ? (
          logbook.daily_logs.map((dailyLog) => (
            <div key={dailyLog.id} className="daily-log">
              <h3>Day: {dailyLog.day}</h3>
              <p>
                <strong>Description:</strong> {dailyLog.description_of_work}
              </p>
              <p>
                <strong>Skills Learned:</strong> {dailyLog.skills_learnt}
              </p>
            </div>
          ))
        ) : (
          <p>No Daily logs</p>
        )}
      </section>

      {/* Weekly Log Summary */}
      <section className="weekly-summary">
        <h2>Weekly Summary</h2>
        <p>{logbook.weekly_summary}</p>
      </section>

      {/* Footer (Optional Supervisor Comments) */}
      <footer className="logbook-footer">
        <p>
          <strong>Supervisor Comments:</strong>{" "}
          {logbook.supervisor_comments || "No comments yet."}
        </p>
        <p>
          <strong>Signed By:</strong> {logbook.signed_by || "No signature yet."}
        </p>
        <p>
          <strong>Supervisor Phone:</strong>{" "}
          {logbook.supervisor_phone || "No phone number."}
        </p>
      </footer>
      <div className="logbook-action-buttons">
        <button
          className="delete-button"
          onClick={() => setIsModalOpen(true)}
          disabled={!logbook}
        >
          Delete
        </button>
        <button
          className="generate-button"
          disabled={logbook.is_approved === null ? true : false}
          style={{
            cursor: logbook.is_approved === null ? "not-allowed" : "pointer",
          }}
          onClick={generatePDF}
        >
          Generate PDF
        </button>
      </div>
      <div className="notice">
        <p>
          <strong>Notice:</strong> For you to generate a PDF, the logbook must
          first be approved.
        </p>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
      />
      <ToastContainer />
    </div>
  );
}

export default SingleLogbook;
