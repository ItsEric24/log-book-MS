import "./MainContent.css"
import StatusCard from "../../components/StatusCard/StatusCard"
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader"

function MainContent() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [logbookSum, setLogbookSum] = useState(0);
  const [approvedLogbookSum, setApprovedLogbookSum] = useState(0);
  const [unapprovedLogbookSum, setUnapprovedLogbookSum] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogbookSum = async () => {
      setLoading(true);
      try {

        //* Sum all logbooks for a particular student
        const response = await fetch(`http://localhost:8000/api/logbooks/total/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setLogbookSum(data.data[0].count);

        //* Sum all approved logbooks for a particular student
        const response2 = await fetch(`http://localhost:8000/api/logbooks/approved/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data2 = await response2.json();
        setApprovedLogbookSum(data2.data[0].count);

        //* Sum all unapproved logbooks for a particular student
        const response3 = await fetch(`http://localhost:8000/api/logbooks/unapproved/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data3 = await response3.json();
        setUnapprovedLogbookSum(data3.data[0].count);

      } catch (error) {
        console.error("Error fetching logbook sum:", error);
      }finally{
        setLoading(false);
      }
    };
    fetchLogbookSum();
  }, [token, user.id]);
  

  return (
    <div className="main-content">
        <StatusCard title="Total Submissions" value={loading ? <Loader /> : logbookSum} icon="📄" />
        <StatusCard title="Pending Reviews" value={loading ? <Loader /> : unapprovedLogbookSum} icon="⏳" />
        <StatusCard title="Approved Logs" value={loading ? <Loader /> : approvedLogbookSum} icon="✅" />
        <StatusCard title="Rejected Logs" value="0" icon="❌" />
    </div>
  );
}

export default MainContent;
