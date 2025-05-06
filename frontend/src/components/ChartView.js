import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from './Navbar';
import './ChartView.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const chartRef = useRef();

  const { sheetName, xAxis, yAxis, chartType, data } = location.state || {};

  if (!data || !xAxis || !yAxis) {
    return (
      <div style={{ padding: 32, color: 'red' }}>
        No chart data found! Please go back and generate a chart.
        <button onClick={() => navigate('/data-mapping')} style={{ marginLeft: 16 }}>
          Back to Mapping
        </button>
      </div>
    );
  }

  // Prepare chart data
  const labels = data.map(row => row[xAxis]);
  const values = data.map(row => Number(row[yAxis]));

  const chartData = {
    labels,
    datasets: [
      {
        label: yAxis,
        data: values,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: chartType !== 'bar' ? true : false },
      title: { display: false },
    },
    scales: chartType === 'pie' ? {} : {
      x: { title: { display: true, text: xAxis } },
      y: { title: { display: true, text: yAxis } },
    },
  };

  // Data summary
  const count = values.length;
  const avg = (values.reduce((a, b) => a + b, 0) / count).toFixed(2);
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Download chart as PNG/JPEG
  const handleDownload = async (type) => {
    if (!chartRef.current) return;
    const canvas = chartRef.current.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL(type === 'jpeg' ? 'image/jpeg' : 'image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `chart.${type}`;
    link.click();
  };

  return (
    <>
      <Navbar />
      <div className="chartview-container">
        <div className="chartview-header">
          <div>
            <div className="chartview-title">Chart View</div>
            <div className="chartview-subtitle">{sheetName} - Visualization</div>
          </div>
          <div>
            <button className="chartview-back" onClick={() => navigate('/data-mapping')}>
              &larr; Back to Mapping
            </button>
            <button className="chartview-history" style={{ marginLeft: 12 }}>
              View History
            </button>
          </div>
        </div>
        <div className="chartview-card">
          <div className="chartview-card-title">{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</div>
          <div className="chartview-card-desc">{xAxis} vs. {yAxis}</div>
          <div ref={chartRef} className="chartview-canvas">
            {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
            {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
            {chartType === 'pie' && <Pie data={{
              labels,
              datasets: [{ ...chartData.datasets[0], backgroundColor: [
                '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#f1f5f9'
              ] }]
            }} options={chartOptions} />}
          </div>
          <div className="chartview-download-row">
            <button className="chartview-download-btn" onClick={() => handleDownload('png')}>PNG</button>
            <button className="chartview-download-btn" onClick={() => handleDownload('jpeg')}>JPEG</button>
          </div>
        </div>
        <div className="chartview-summary">
          <div className="chartview-summary-title">Data Summary</div>
          <div className="chartview-summary-desc">Basic statistics about your data</div>
          <div className="chartview-summary-row">
            <div className="chartview-summary-card">
              <div className="chartview-summary-label">Data Points</div>
              <div className="chartview-summary-value">{count}</div>
            </div>
            <div className="chartview-summary-card">
              <div className="chartview-summary-label">Average</div>
              <div className="chartview-summary-value">{avg}</div>
            </div>
            <div className="chartview-summary-card">
              <div className="chartview-summary-label">Max Value</div>
              <div className="chartview-summary-value">{max}</div>
            </div>
            <div className="chartview-summary-card">
              <div className="chartview-summary-label">Min Value</div>
              <div className="chartview-summary-value">{min}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartView; 