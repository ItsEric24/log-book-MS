import "./AdminLogbookView.css";
// import { myLogBook as logbook } from "../../utils/data";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ApproveModal from "../../components/ApproveModal/ApproveModal";
import { ToastContainer, toast } from "react-toastify";

function AdminLogbookView() {
  const [logbook, setLogbook] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const naviagte = useNavigate();

  useEffect(() => {
    const fetchLogbook = async () => {
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
          throw new Error("Failed to fetch logbook. Please try again.");
        }
        const data = await response.json();
        setLogbook(data.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLogbook();
  }, [id, token]);

  const handleApproval = async (approvalData) => {
    const response = await fetch(
      `http://localhost:8000/api/logbooks/admin/logbook/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(approvalData),
      }
    );

    if (!response.ok) {
      toast.error("Failed to approve logbook. Please try again.");
    }

    setIsOpen(false);
    toast.success("Logbook approved successfully");

    setTimeout(() => {
      naviagte("/dashboard/logbooks");
    }, 3000);
  };

  if (!logbook || Object.keys(logbook).length === 0) {
    return (
      <p style={{ color: "#525252", textAlign: "center" }}>
        No Logbook to view, submit one to view
      </p>
    );
  }

  return (
    <div className="admin-logbook-document">
      <header className="admin-logbook-header">
        <h1>Logbook Review</h1>
        <p>
          <strong>Student Name:</strong> {logbook.student_name}
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
      </header>

      {/* Daily Logs */}
      <section className="admin-daily-logs">
        <h2>Daily Logs</h2>
        {logbook.daily_logs ? (
          logbook.daily_logs.map((dailyLog) => (
            <div key={dailyLog.id} className="admin-daily-log">
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
      <section className="admin-weekly-summary">
        <h2>Weekly Summary</h2>
        <p>{logbook.weekly_summary}</p>
      </section>

      {/* Footer (Optional Supervisor Comments) */}
      <footer className="admin-logbook-footer">
        <p>
          <strong>Supervisor Comments:</strong>{" "}
          {logbook.supervisor_comments || "No comments yet."}
        </p>
      </footer>

      {/* Admin Action Buttons */}
      <div className="admin-logbook-action-buttons">
        <button
          className="admin-approve-button"
          onClick={() => setIsOpen(true)}
          disabled={logbook.is_approved ? true : false}
        >
          Approve
        </button>
      </div>
      <ApproveModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApprove={handleApproval}
      />
      <ToastContainer />
    </div>
  );
}

export default AdminLogbookView;
