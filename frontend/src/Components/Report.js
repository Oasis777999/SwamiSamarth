import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import api from '../apis/api';

const Report = () => {
  const [tableData, setTableData] = useState([]);

  // Fetch data from the backend
  const getData = async () => {
    try {
      const result = await api.get("/data");
      const data = result.data
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Helper to count occurrences of a field (state, gender, etc.)
  const getCounts = (key) => {
    const counts = {};
    tableData.forEach((item) => {
      const value = item[key];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return counts;
  };

  // Generate Pie chart data
  const createPieData = (counts, label) => {
    const labels = Object.keys(counts);
    const values = Object.values(counts);
    const colors = labels.map(() =>
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );

    return {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: colors,
        },
      ],
    };
  };

  // Generate Bar chart data
  const createBarData = (counts) => {
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    return {
      labels,
      datasets: [
        {
          label: "Number of Users",
          data: values,
          backgroundColor: 'rgba(228, 142, 29, 0.93)',
          borderColor: 'rgb(255, 169, 39)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Data preparation
  const stateCounts = getCounts("state");
  const genderCounts = getCounts("gender");

  const statePieData = createPieData(stateCounts, "Distribution by State");
  const genderPieData = createPieData(genderCounts, "Distribution by Gender");
  const stateBarData = createBarData(stateCounts);

  return (
    <div className="container pt-5">
      <h2 className="text-center mb-4">User Demographics Overview</h2>

      {/* Pie Charts Row */}
      <div className="row mb-5">
        <div className="col-md-6 d-flex flex-column align-items-center">
          <h5 className="mb-3">User Distribution by State (Pie Chart)</h5>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <Pie data={statePieData} />
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column align-items-center">
          <h5 className="mb-3">User Distribution by Gender (Pie Chart)</h5>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <Pie data={genderPieData} />
          </div>
        </div>
      </div>

      {/* Bar Chart Row */}
      <div className="row">
        <div className="col-12 d-flex flex-column align-items-center">
          <h5 className="mb-3">User Count per State (Bar Chart)</h5>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <Bar
              data={stateBarData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
