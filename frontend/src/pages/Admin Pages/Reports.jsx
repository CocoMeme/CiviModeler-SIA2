import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const lineData = {
  labels: ["Month 1", "Month 2", "Month 3"],
  datasets: [
    {
      label: "Actual Cost",
      data: [40000, 25000, 30000],
      borderColor: "#1f77b4",
      backgroundColor: "rgba(31, 119, 180, 0.2)",
      pointBackgroundColor: "#1f77b4",
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: "Budgeted Cost/Period",
      data: [70000, 30000, 50000],
      borderColor: "#ff7f0e",
      backgroundColor: "rgba(255, 127, 14, 0.2)",
      pointBackgroundColor: "#ff7f0e",
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

const barData = {
  labels: ["Construction", "Procurement", "Design"],
  datasets: [
    {
      label: "Cost",
      data: [450000, 200000, 50000],
      backgroundColor: ["#228B22", "#E06639", "#1E4B8B"],
      borderWidth: 1,
      barThickness: 50,
    },
  ],
};

const options = {
  plugins: {
    legend: {
      labels: {
        color: "#fff",
        font: { size: 14 },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#fff" },
      grid: { color: "rgba(255,255,255,0.2)" },
    },
    y: {
      ticks: { color: "#fff" },
      grid: { color: "rgba(255,255,255,0.2)" },
    },
  },
};

const projectData = {
    labels: ["01-Jan", "15-Jan", "22-Jan", "05-Feb", "19-Feb", "05-Mar", "19-Mar", "02-Apr", "16-Apr", "30-Apr", "14-May"],
    datasets: [
      {
        label: "Total Projects",
        data: [1.5, 1.0, 1.8, 2.2, 1.5, 2.7, 1.9, 3.5, 1.8, 2.1, 2.0],
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

const Reports = () => {
  return (
    <div className="flex text-white ">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-2">Project Cost Over Time</h2>
            <Line data={lineData} options={options} />
          </div>

          <div className="p-6 bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-2">Project Breakdown per Phase</h2>
            <Bar data={barData} options={{ ...options, indexAxis: 'y' }} />
          </div>

          <div className="p-4 bg-gray-800 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-2">Total Projects Over Time</h2>
          <Line data={projectData} />
        </div>

        </div>
      </div>
    </div>
  );
};

export default Reports;
