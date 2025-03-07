import { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format } from "date-fns"; // Date formatting
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

Chart.register(...registerables);

const ReportsPage = () => {
  const [lineData, setLineData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [contractorData, setContractorData] = useState(null);
  const [ratingsData, setRatingsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/project/reports-data`, { withCredentials: true });
        const { projects, contractorProjects } = response.data;

        const labels = projects.map(item => {
          const day = item._id?.day;
          const month = item._id?.month;
          const year = item._id?.year;
          if (day && month && year) {
            const date = new Date(year, month - 1, day);
            return format(date, "MMMM dd, yyyy"); // Format: "April 12, 2025"
          }
          return "Unknown";
        });

        const totalProjects = projects.map(item => item.totalProjects ?? 0);
        const totalBudget = projects.map(item => item.totalBudget ?? 0);
        const totalCost = projects.map(item => item.totalCost ?? 0);

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

        const contractorLabels = contractorProjects.map(item => item.contractorName);
        const contractorProjectsData = contractorProjects.map(item => item.totalProjects);

        setContractorData({
          labels: contractorLabels,
          datasets: [
            {
              label: "Projects per Contractor",
              data: contractorProjectsData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error("Error fetching reports data:", error);
        setError(error.message);
      }
    };
    const fetchRatingsData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/testimonials/ratings`, { withCredentials: true });
        const ratings = response.data;

        const labels = ratings.map(item => `${item._id} Star`);
        const counts = ratings.map(item => item.count);

        setRatingsData({
          labels,
          datasets: [
            {
              label: "Number of Ratings",
              data: counts,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching ratings data:", error);
        setError(error.message);
      }
    };

    fetchReportsData();
    fetchRatingsData();
  }, []);

  const handleDownloadPDF = () => {
    const reportElement = document.getElementById("report-container");

    setTimeout(() => {
        html2canvas(reportElement, { scale: 3 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            let currentY = margin;

            // **Logo**
            const logoPath = '/images/CiviModeler - NBG.png';
            const logoWidth = 40;
            const logoHeight = 40;
            pdf.addImage(logoPath, 'PNG', margin, currentY, logoWidth, logoHeight);

            // **Title Beside Logo**
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(20);
            pdf.setTextColor(102, 51, 153);
            pdf.text("CiviModeler Project Report", margin + logoWidth + 15, currentY + 20);

            currentY += 50;

            // **Header Line**
            pdf.setLineWidth(0.8);
            pdf.setDrawColor(102, 51, 153);
            pdf.line(margin, currentY, pageWidth - margin, currentY);
            currentY += 12;

            // **Date Below Header**
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(0, 0, 0);
            const date = new Date().toLocaleDateString();
            pdf.text(`Generated on: ${date}`, margin, currentY);
            currentY += 15;

            // **Convert Report Content to Image**
            const imgWidth = pageWidth - 2 * margin;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (currentY + imgHeight > pageHeight - margin) {
                pdf.addPage();
                currentY = margin;
            }

            pdf.addImage(imgData, "PNG", margin, currentY, imgWidth, imgHeight);
            pdf.save("Admin_ChartReport.pdf");
        });
    }, 500);
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
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Projects per Contractor</h3>
          {contractorData && <Bar data={contractorData} />}
        </div>
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Ratings Distribution</h3>
          {ratingsData && <Bar data={ratingsData} />}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;