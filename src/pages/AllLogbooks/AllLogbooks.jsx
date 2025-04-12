import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import "./AllLogbooks.css";
import { useEffect } from "react";
import { fetchLogBooks } from "../../features/logBooks/logBooks";
import Loader from "../../components/Loader/Loader";

function AllLogbooks() {
  const navigate = useNavigate();
  const { loading, logBooks } = useSelector((state) => state.logbook);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchLogBooks({ token, id: user.id }));
  }, [dispatch, token, user.id]);

  function handleNavigate(id) {
    navigate(`/dashboard/logbook/${id}`);
  }

  if (loading) {
    return <Loader color="black" width="100" height="100" />;
  }

  return (
    <div className="manage-logbooks">
      <h1>Manage Logbooks</h1>
      <div className="logbook-list">
        {logBooks.length > 0 ? (
          logBooks.map((logbook) => (
            <div
              className="logbook-item"
              key={logbook.id}
              onClick={() => handleNavigate(logbook.id)}
            >
              <div className="logbook-details">
                <p>
                  <strong>Logbook ID:</strong> {logbook.id}
                </p>
                <p>
                  <strong>Week Number:</strong> {logbook.week_number}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(logbook.date).toDateString()}
                </p>
                <p>
                  <strong>Department:</strong> {logbook.department}
                </p>
                <p>
                  <strong>Approval:</strong>{" "}
                  {logbook.is_approved ? "Approved" : "Pending"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#ffffff", textAlign: "center" }}>
            No logbooks at the moment, you can create one at the &apos;submit
            logbook section&apos;
          </p>
        )}
      </div>
    </div>
  );
}

export default AllLogbooks;
