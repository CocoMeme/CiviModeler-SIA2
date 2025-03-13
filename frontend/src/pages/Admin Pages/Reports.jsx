import { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format } from "date-fns"; // Date formatting
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const ReportsPage = () => {
  const [lineData, setLineData] = useState(null);
  const [totalProjectsData, setTotalProjectsData] = useState(null);
  const [contractorData, setContractorData] = useState(null);
  const [ratingsData, setRatingsData] = useState(null);
  const [genderData, setGenderData] = useState(null);
  const [materialData, setMaterialData] = useState(null);
  const [accountStatusData, setAccountStatusData] = useState(null);
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

        setTotalProjectsData({
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

    const fetchGenderData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/gender-data`, { withCredentials: true });
        const data = response.data.data;

        setGenderData({
          labels: Object.keys(data),
          datasets: [
            {
              label: "Gender Distribution",
              data: Object.values(data),
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching gender data:", error);
        setError(error.message);
      }
    };

    const fetchMaterialData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/project/material-data`, { withCredentials: true });
        const materials = response.data;
    
        const labels = materials.map(item => item._id);
        const quantities = materials.map(item => item.totalQuantity);
    
        setMaterialData({
          labels,
          datasets: [
            {
              label: "Material Quantity",
              data: quantities,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching material data:", error);
        setError(error.message);
      }
    };

    const fetchAccountStatusData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/account-status-data`, { withCredentials: true });
        const data = response.data.data;

        setAccountStatusData({
          labels: Object.keys(data),
          datasets: [
            {
              label: "Account Status",
              data: Object.values(data),
              backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
              hoverBackgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching account status data:", error);
        setError(error.message);
      }
    };

    fetchReportsData();
    fetchRatingsData();
    fetchGenderData();
    fetchMaterialData();
    fetchAccountStatusData();
  }, []);

  const handleDownloadPDF = () => {
    const reportElements = document.querySelectorAll(".chart-container"); // Select each chart separately
  
    setTimeout(() => {
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20; // Keep margins
      let yPosition = 40; // Start position for content below header
  
      // Function to add a header on each page
      const addHeader = () => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(20);
        pdf.setTextColor(102, 51, 153);
        pdf.text("CiviModeler Project Report", 10, 20);
        pdf.setDrawColor(102, 51, 153);
        pdf.line(10, 25, pageWidth - 10, 25); // Underline
      };
  
      addHeader(); // Add header to the first page
  
      reportElements.forEach((element, index) => {
        html2canvas(element, { scale: 3 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
  
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            addHeader(); // Add header to the new page
            yPosition = 40;
          }
  
          pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10; // Space between charts
  
          if (index === reportElements.length - 1) {
            pdf.save("Admin_ChartReport.pdf");
          }
        });
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
        <div className="chart-container bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Total Cost and Budget Over Time</h3>
          {lineData && <Line data={lineData} />}
        </div>
        <div className="chart-container bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Total Projects Over Time</h3>
          {totalProjectsData && <Line data={totalProjectsData} />}
        </div>
        <div className="chart-container bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Projects per Contractor</h3>
          {contractorData && <Bar data={contractorData} />}
        </div>
        <div className="chart-container bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Ratings Distribution</h3>
          {ratingsData && <Bar data={ratingsData} />}
        </div>
        <div className="chart-container bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Gender Distribution</h3>
          {genderData && <Pie data={genderData} options={{ plugins: { datalabels: { formatter: (value, context) => `${context.chart.data.labels[context.dataIndex]}: ${value}`, color: '#fff', font: { weight: 'bold', size: 14 }, align: 'center', anchor: 'center' } } }} />}
        </div>
        <div className="chart-container bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Material Quantity Breakdown</h3>
          {materialData && <Bar data={materialData} />}
        </div>
        <div className="chart-container bg-gray-800 border border-gray-700 p-4 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">Account Status Distribution</h3>
          {accountStatusData && <Pie data={accountStatusData} options={{ plugins: { datalabels: { formatter: (value, context) => `${context.chart.data.labels[context.dataIndex]}: ${value}`, color: '#fff', font: { weight: 'bold', size: 14 }, align: 'center', anchor: 'center' } } }} />}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;