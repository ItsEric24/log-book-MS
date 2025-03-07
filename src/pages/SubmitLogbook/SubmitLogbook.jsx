import { useState, useEffect } from "react";
import "./SubmitLogbook.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyLogs } from "../../features/dailyLogs/dailyLogs";
import { ToastContainer, toast } from "react-toastify";
import { sendEmail } from "../../utils/helperFunc";

function SubmitLogbook() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [weekNumber, setWeekNumber] = useState(1);
  const [weekSummary, setWeekSummary] = useState("");
  const { dailyLogs } = useSelector((state) => state.dailyLog);

  // Fetch daily logs for the selected week
  useEffect(() => {
    dispatch(fetchDailyLogs({ token, id: user.id }));
  }, [dispatch, token, user.id]);

  // Handle weekly log submission
  const logBookEmailMessage = `Dear Supervisor,

This is to inform you that ${user.name} from the ${
    user.department
  } department has submitted their logbook on ${new Date().toDateString()}.

Please review the submission at your earliest convenience.

Best regards,  
LogBookMS`;

  const handleSubmit = async () => {
    const weeklyLogData = {
      studentId: user.id,
      department: user.department,
      studentName: user.name,
      weekNumber: String(weekNumber),
      weekSummary,
      dailyLogs: dailyLogs.filter(
        (log) => Number(log.week_number) === weekNumber
      ),
    };

    if (weeklyLogData.dailyLogs.length === 0) {
      return toast.error("There are no daily logs for this week");
    }

    const response = await fetch("http://localhost:8000/api/logbooks/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(weeklyLogData),
    });

    if (response.ok) {
      toast.success("Weekly log submitted successfully");
      sendEmail(
        "eddiesolentai@gmail.com",
        "chewbaccam200@gmail.com",
        "LogBookSubmission",
        logBookEmailMessage,
        token
      );
    } else {
      toast.error("Failed to submit weekly log. Please Check inputs");
    }
  };

  return (
    <div className="submit-weekly-log-container">
      <h1>Submit Weekly Log</h1>

      {/* Week Selector */}
      <div className="week-selector">
        <label htmlFor="weekNumber">Select Week:</label>
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

      {/* Daily Logs for the Selected Week */}
      <div className="daily-logs-list">
        <h2>Daily Logs for Week {weekNumber}</h2>
        {dailyLogs
          .filter((log) => Number(log.week_number) === weekNumber) // Filter logs for the selected week
          .map((log) => (
            <div key={log.id} className="daily-log-item">
              <p>
                <strong>Day:</strong> {log.day}
              </p>
              <p>
                <strong>Log Id:</strong> {log.id}
              </p>
              <p>
                <strong>Date:</strong> {new Date(log.date).toDateString()}
              </p>
            </div>
          ))}
        {dailyLogs.filter((log) => Number(log.week_number) === weekNumber)
          .length === 0 && (
          <p style={{ color: "#525252", textAlign: "center" }}>
            No Logs for week {weekNumber}
          </p>
        )}
      </div>

      {/* Weekly Summary */}
      <div className="weekly-summary">
        <h2>Write Week Summary</h2>
        <textarea
          placeholder="Write your week summary here..."
          value={weekSummary}
          onChange={(e) => setWeekSummary(e.target.value)}
        ></textarea>
      </div>

      {/* Submit Button */}
      <button className="submit-button" onClick={handleSubmit}>
        Submit Weekly Log
      </button>

      <ToastContainer />
    </div>
  );
}

export default SubmitLogbook;
