import "./AdminLogbookView.css";
// import { myLogBook as logbook } from "../../utils/data";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";

function AdminLogbookView() {
  const [logbook, setLogbook] = useState({});
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [supervisorComment, setSupervisorComment] = useState("");
  const [isEditingSignedBy, setIsEditingSignedBy] = useState(false);
  const [isEditingSupervisorPhone, setIsEditingSupervisorPhone] =
    useState(false);
  const [supervisorPhoneNumber, setSupervisorPhoneNumber] = useState("");
  const [signedBy, setSignedBy] = useState("");

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
        setSupervisorComment(data.data[0].supervisor_comments || "");
        setSignedBy(data.data[0].signed_by || "");
        setSupervisorPhoneNumber(data.data[0].supervisor_phone_number || "");
      } catch (error) {
        console.log(error);
      }
    };

    fetchLogbook();
  }, [id, token]);

  const handleApproval = async () => {
    if(supervisorPhoneNumber.length < 10){
      return toast.error("Please check your phone number")
    }
    const response = await fetch(
      `http://localhost:8000/api/logbooks/admin/logbook/approve/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      toast.error("Failed to approve logbook. Please try again.");
    }

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

  const handleCommentClick = () => {
    setIsEditingComment(true);
  };

  const handleCommentChange = (e) => {
    setSupervisorComment(e.target.value);
  };

  const handleCommentBlur = async () => {
    setIsEditingComment(false);

    try {
      const response = await fetch(
        `http://localhost:8000/api/logbooks/admin/logbook/comments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ supervisor_comments: supervisorComment }),
        }
      );

      if (!response.ok) {
        toast.error("Failed to update supervisor comment.");
      } else {
        toast.success("Comment updated.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  const handleSignedByClick = () => {
    setIsEditingSignedBy(true);
  };

  const handleSignedByChange = (e) => {
    setSignedBy(e.target.value);
  };

  const handleSignedByBlur = async () => {
    setIsEditingSignedBy(false);

    try {
      const response = await fetch(
        `http://localhost:8000/api/logbooks/admin/logbook/signedby/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ signed_by: signedBy }),
        }
      );

      if (!response.ok) {
        toast.error("Failed to update signed by field.");
      } else {
        toast.success("Signed by updated successfully.");
      }
    } catch (error) {
      toast.error("An error occurred while updating signed by.");
      console.error(error);
    }
  };

  const handlePhoneClick = () => {
    setIsEditingSupervisorPhone(true);
  };

  const handlePhoneChange = (e) => {
    setSupervisorPhoneNumber(e.target.value);
  };

  const handlePhoneBlur = async () => {
    setIsEditingSupervisorPhone(false);

    if(supervisorPhoneNumber.length < 10){
      return toast.error("Phone number must be 10 digits")
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/logbooks/admin/logbook/supervisor-phone/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            supervisor_phone: supervisorPhoneNumber,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Failed to update phone number.");
      } else {
        toast.success("Phone number updated successfully.");
      }
    } catch (error) {
      toast.error("An error occurred while updating phone number.");
      console.error(error);
    }
  };

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
      <footer className="admin-logbook-footer">
        <p>
          <strong>Supervisor Comments:</strong>{" "}
          {isEditingComment ? (
            <input
              type="text"
              value={supervisorComment}
              onChange={handleCommentChange}
              onBlur={handleCommentBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.target.blur();
              }}
              // autoFocus
              style={{
                padding: "5px",
                width: "100%",
                outline: "none"
              }}
            />
          ) : (
            <span
              onClick={handleCommentClick}
              style={{
                cursor: "pointer",
              }}
            >
              {supervisorComment || "No comments yet. Click to add."}
            </span>
          )}
        </p>
        <p>
          <strong>Signed By:</strong>
          {isEditingSignedBy ? (
            <input
              type="text"
              value={signedBy}
              onChange={handleSignedByChange}
              onBlur={handleSignedByBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.target.blur();
              }}
              className="admin-logbook-signedby-input"
              autoFocus
            />
          ) : (
            <span
              className="admin-logbook-signedby-text"
              onClick={handleSignedByClick}
              style={{
                cursor: "pointer"
              }}
            >
              {signedBy || "Not yet signed. Click to edit."}
            </span>
          )}
        </p>
        <p>
          <strong>Supervisor Phone:</strong>
          {isEditingSupervisorPhone ? (
            <input
              type="tel"
              value={supervisorPhoneNumber}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.target.blur();
              }}
              className="admin-logbook-phone-input"
              autoFocus
            />
          ) : (
            <span
              className="admin-logbook-phone-text"
              onClick={handlePhoneClick}
              style={{
                cursor: "pointer"
              }}
            >
              {supervisorPhoneNumber || "Click to add phone number"}
            </span>
          )}
        </p>
      </footer>

      {/* Admin Action Buttons */}
      <div className="admin-logbook-action-buttons">
        <button
          className="admin-approve-button"
          onClick={handleApproval}
          disabled={logbook.is_approved ? true : false}
        >
          Approve
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminLogbookView;
