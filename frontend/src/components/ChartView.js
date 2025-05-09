import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas';
import Navbar from './Navbar';
import './UserDashboard.css';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, ArcElement);

const ChartView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const chartRef = useRef();

  if (!state) {
    navigate('/data-mapping');
    return null;
  }

  const { data, xAxis, yAxis, chartType, sheetName } = state;
  const fileName = sheetName;

  // Prepare chart data
  const labels = data.map(row => row[xAxis]);
  const values = data.map(row => Number(row[yAxis]));

  const chartData = {
    labels,
    datasets: [
      {
        label: yAxis,
        data: values,
        backgroundColor: 'rgba(56, 189, 248, 0.5)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: chartType !== 'pie', position: 'top' },
      title: { display: false },
    },
    scales: chartType === 'pie' ? {} : {
      x: { title: { display: true, text: xAxis } },
      y: { title: { display: true, text: yAxis } },
    },
  };

  // Data summary
  const dataPoints = values.length;
  const average = (values.reduce((a, b) => a + b, 0) / dataPoints).toFixed(2);
  const maxValue = Math.max(...values).toFixed(2);

  // Download chart as PNG
  const handleDownload = async () => {
    const chartElement = chartRef.current;
    if (!chartElement) return;
    await html2canvas(chartElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: 0 }}>Chart View</h2>
            <div style={{ color: '#6c757d', fontSize: 16 }}>{fileName} - Visualization</div>
          </div>
          <div>
            <button className="upload-btn-full" style={{ marginRight: 12 }} onClick={() => navigate(-1)}>&larr; Back to Mapping</button>
            <button className="upload-btn-full" style={{ background: '#e2e8f0', color: '#222' }}>View History</button>
          </div>
        </div>
        <div style={{ marginTop: 24, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e5e7eb' }}>
          <h3 style={{ marginBottom: 0 }}>Bar Chart</h3>
          <div style={{ color: '#6c757d', marginBottom: 12 }}>{xAxis} vs. {yAxis}</div>
          <div ref={chartRef} style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16 }}>
            {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
            {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
            {chartType === 'pie' && <Pie data={{
              labels,
              datasets: [{
                data: values,
                backgroundColor: [
                  '#38bdf8', '#818cf8', '#f472b6', '#facc15', '#34d399', '#f87171', '#a3e635', '#fbbf24', '#60a5fa', '#f472b6', '#fcd34d', '#c084fc', '#f87171', '#fbbf24', '#818cf8'
                ]
              }]
            }} options={chartOptions} />}
          </div>
          <button className="upload-btn-full" onClick={handleDownload} style={{ width: 140, marginRight: 8 }}>
            <span role="img" aria-label="download">⬇️</span> Download PNG
          </button>
          <button className="upload-btn-full" style={{ width: 100, background: '#e2e8f0', color: '#222' }} disabled>PDF</button>
        </div>
        <div style={{ marginTop: 32, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #e5e7eb' }}>
          <h3>Data Summary</h3>
          <div style={{ color: '#6c757d', marginBottom: 16 }}>Basic statistics about your data</div>
          <div style={{ display: 'flex', gap: 32 }}>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: 18, minWidth: 120 }}>
              <div style={{ color: '#6c757d', fontSize: 14 }}>Data Points</div>
              <div style={{ fontWeight: 700, fontSize: 28 }}>{dataPoints}</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: 18, minWidth: 120 }}>
              <div style={{ color: '#6c757d', fontSize: 14 }}>Average</div>
              <div style={{ fontWeight: 700, fontSize: 28 }}>{average}</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: 18, minWidth: 120 }}>
              <div style={{ color: '#6c757d', fontSize: 14 }}>Max Value</div>
              <div style={{ fontWeight: 700, fontSize: 28 }}>{maxValue}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartView; 