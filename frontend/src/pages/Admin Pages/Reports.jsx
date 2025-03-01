import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format } from "date-fns"; // Date formatting
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  const handleDownloadPDF = () => {
    const reportElement = document.getElementById("report-container");

    html2canvas(reportElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("report.pdf");
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Reports</h2>

      <button 
        onClick={handleDownloadPDF} 
        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md mb-4"
      >
        Export as PDF
      </button>

      <div id="report-container" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Total Cost and Budget Over Time</h3>
          {lineData && <Line data={lineData} />}
        </div>
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Total Projects Over Time</h3>
          {projectData && <Line data={projectData} />}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
