import "./AdminLogbooks.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminLogBooks } from "../../features/adminLogs/adminLogs";
import { useNavigate } from "react-router";

function AdminLogbooks() {
  const { adminLogs } = useSelector((state) => state.adminLog);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // State for filters
  const [selectedWeek, setSelectedWeek] = useState("");

  useEffect(() => {
    dispatch(fetchAdminLogBooks({ token }));
  }, [dispatch, token]);

  const handleNaviagte = (id) => {
    navigate(`/admin/logbook/${id}`);
  };

  // Filter logbooks based on selected department and week
  const filteredLogs = adminLogs
    .filter((logbook) => logbook.school === user.school)
    .filter((logbook) => logbook.department === user.department)
    .filter((logbook) => {
      return !selectedWeek || logbook.week_number === selectedWeek;
    });

  return (
    <div className="approve-logbooks-container">
      <h1>Manage and Approve Logbooks</h1>

      {/* Filter Selectors */}
      <div className="filters">
        <label className="filter-label">
          Week:
          <select
            className="filter-select"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
          >
            <option value="">All Weeks</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Week {i + 1}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Logbook List */}
      <div className="logbook-list">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((logbook) => (
            <div
              className="logbook-card"
              key={logbook.id}
              onClick={() => handleNaviagte(logbook.id)}
            >
              <div className="admin-logbook-details">
                <p>
                  <strong>Logbook ID:</strong> {logbook.id}
                </p>
                <p>
                  <strong>Student Name:</strong> {logbook.student_name}
                </p>
                <p>
                  <strong>Week:</strong> {logbook.week_number}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(logbook.date).toDateString()}
                </p>
                <p>
                  <strong>Is Signed:</strong>{" "}
                  {logbook.is_approved ? "Signed" : "Not Signed"}
                </p>
                <p>
                  <strong>School:</strong> {logbook.school}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#ffffff", textAlign: "center" }}>
            No logbooks at the moment
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminLogbooks;
