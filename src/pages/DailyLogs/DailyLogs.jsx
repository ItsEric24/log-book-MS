import { useNavigate } from "react-router";
import { useState } from "react";
import "./DailyLogs.css";
import DailyModal from "../../components/DailyModal/DailyModal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyLogs } from "../../features/dailyLogs/dailyLogs";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

function DailyLogs() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [weekNumber, setWeekNumber] = useState(1);
  const {dailyLogs, loading} = useSelector((state) => state.dailyLog);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchDailyLogs({ token, id: user.id }));
  }, [dispatch, token, user.id]);

  function handleClick(id) {
    navigate(`/dashboard/daily-log/${id}`);
  }

  async function handleSave(formData) {
    const response = await fetch("http://localhost:8000/api/daily-logs/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const logExists = await response.json();

    if (response.status === 200) {
      dispatch(fetchDailyLogs({ token, id: user.id }));
      toast.success("Daily log saved");
    }

    if (logExists.message === "Log already exists") {
      return toast.error("Log already exists");
    }

    if (response.status === 400) {
      return toast.error("There was an error saving the log");
    }
  }

  if (loading) {
    return <Loader color="black" width="100" height="100" />
  }
  return (
    <div className="daily-logs-list-container">
      <div className="daily-logs-header">
        <h1>Daily Logs</h1>
        <div>
          <label id="dailyLogsFilter">Filter By:</label>
          <select
            id="weekNumber"
            value={weekNumber}
            onChange={(e) => setWeekNumber(Number(e.target.value))}
          >
            {[...Array(12).keys()].map((week) => (
              <option key={week + 1} value={week + 1}>
                Week {week + 1}
              </option>
            ))}
          </select>
        </div>
        <button className="daily-logs-btn" onClick={() => setIsOpen(true)}>
          Create Daily Log
        </button>
      </div>
      <div className="daily-logs-list">
        {dailyLogs.length > 0 ? (
          dailyLogs.filter((log) => Number(log.week_number) === weekNumber)
            .length > 0 ? (
            dailyLogs
              .filter((log) => Number(log.week_number) === weekNumber)
              .map((log) => (
                <div
                  className="daily-log-item"
                  key={log.id}
                  onClick={() => handleClick(log.id)}
                >
                  <p>
                    <strong>Week Number:</strong> {log.week_number}
                  </p>
                  <p>
                    <strong>Day:</strong> {log.day}
                  </p>
                  <p>
                    <strong>Log ID:</strong> {log.id}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(log.date).toDateString()}
                  </p>
                </div>
              ))
          ) : (
            <p style={{ color: "#ffffff", textAlign: "center" }}>
              No logs for this week
            </p>
          )
        ) : (
          <p style={{ color: "#ffffff", textAlign: "center" }}>
            No daily logs available, create one to get started.
          </p>
        )}
      </div>
      <DailyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
      />
      <ToastContainer />
    </div>
  );
}

export default DailyLogs;
