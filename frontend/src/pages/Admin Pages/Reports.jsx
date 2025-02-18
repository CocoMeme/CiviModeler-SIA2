import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format } from "date-fns"; // Date formatting

Chart.register(...registerables);

const ReportsPage = () => {
  const [lineData, setLineData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/project/reports-data`, { withCredentials: true });
        const data = response.data;

        console.log("API Response:", JSON.stringify(data, null, 2)); // Debugging

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No data received from the API");
        }

        const labels = data.map(item => {
          const day = item._id?.day;
          const month = item._id?.month;
          const year = item._id?.year;
          if (day && month && year) {
            const date = new Date(year, month - 1, day);
            return format(date, "MMMM dd, yyyy"); // Format: "April 12, 2025"
          }
          return "Unknown";
        });

        const totalProjects = data.map(item => item.totalProjects ?? 0);
        const totalBudget = data.map(item => item.totalBudget ?? 0);
        const totalCost = data.map(item => item.totalCost ?? 0);

        setLineData({
          labels,
          datasets: [
            {
              label: "Total Budget",
              data: totalBudget,
              borderColor: "#1f77b4",
              backgroundColor: "rgba(31, 119, 180, 0.2)",
              pointBackgroundColor: "#1f77b4",
              borderWidth: 2,
              tension: 0.4,
            },
            {
              label: "Total Cost",
              data: totalCost,
              borderColor: "#ff7f0e",
              backgroundColor: "rgba(255, 127, 14, 0.2)",
              pointBackgroundColor: "#ff7f0e",
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        });

        setProjectData({
          labels,
          datasets: [
            {
              label: "Total Projects",
              data: totalProjects,
              borderColor: "#ff6384",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching reports data:", error);
        setError(error.message);
      }
    };

    fetchReportsData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Reports</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-gray-300 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Cost and Budget Over Time</h3>
          {lineData && <Line data={lineData} />}
        </div>
        <div className="border-2 border-gray-300 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Projects Over Time</h3>
          {projectData && <Line data={projectData} />}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;