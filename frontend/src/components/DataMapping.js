import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './DataMapping.css';

const DataMapping = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const excelData = location.state?.data || [];
  const sheetName = location.state?.sheetName || 'Sheet1';
  // For future: support multiple sheets
  const [selectedSheet] = useState(sheetName);

  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    if (excelData.length > 0) {
      setHeaders(Object.keys(excelData[0]));
    }
  }, [excelData]);

  if (!location.state) {
    return <div style={{padding: 32, color: 'red'}}>No data passed! Try uploading again.</div>;
  }

  const handleGenerateChart = () => {
    const chartConfig = {
      sheetName: selectedSheet,
      xAxis,
      yAxis,
      chartType,
      data: excelData.slice(0, 15),
    };
    navigate('/chart-view', { state: chartConfig });
  };

  if (!excelData.length) {
    return (
      <div style={{ padding: 32 }}>
        <h2>No Excel data found</h2>
        <button onClick={() => navigate('/upload-excel')}>Go back to upload</button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{padding: '32px 0 0 0'}}>
        <div className="datamapping-header">
          <div className="datamapping-title">Data Mapping</div>
        </div>
        <div className="datamapping-worksheet">
          <label htmlFor="worksheet-select">Choose Worksheet</label>
          <div style={{ color: '#6c757d', marginBottom: 12 }}>Select a sheet from your Excel file</div>
          <select id="worksheet-select" className="datamapping-select" value={selectedSheet} disabled>
            <option value={selectedSheet}>{selectedSheet}</option>
          </select>
        </div>
        <div className="datamapping-main">
          {/* Left: Chart Setup */}
          <div className="datamapping-setup">
            <h2 style={{ marginBottom: 8 }}>Simple Chart Setup</h2>
            <div style={{ color: '#6c757d', marginBottom: 24 }}>Select data columns and chart type</div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Step 1: Select X-Axis (Categories)</div>
              <select
                className="datamapping-select"
                value={xAxis}
                onChange={e => setXAxis(e.target.value)}
              >
                <option value="">Select column for X-Axis</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <div style={{ color: '#adb5bd', fontSize: 13, marginTop: 4 }}>
                This will be used for labels on the chart
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Step 2: Select Y-Axis (Values)</div>
              <select
                className="datamapping-select"
                value={yAxis}
                onChange={e => setYAxis(e.target.value)}
              >
                <option value="">Select column for Y-Axis</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <div style={{ color: '#adb5bd', fontSize: 13, marginTop: 4 }}>
                This will be used for the values on the chart
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Step 3: Select Chart Type</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <label>
                  <input
                    type="radio"
                    name="chartType"
                    value="bar"
                    checked={chartType === 'bar'}
                    onChange={() => setChartType('bar')}
                  />{' '}
                  Bar
                </label>
                <label>
                  <input
                    type="radio"
                    name="chartType"
                    value="line"
                    checked={chartType === 'line'}
                    onChange={() => setChartType('line')}
                  />{' '}
                  Line
                </label>
                <label>
                  <input
                    type="radio"
                    name="chartType"
                    value="pie"
                    checked={chartType === 'pie'}
                    onChange={() => setChartType('pie')}
                  />{' '}
                  Pie
                </label>
              </div>
            </div>
            <button
              className="generate-button"
              onClick={handleGenerateChart}
              disabled={!xAxis || !yAxis}
            >
              Generate Chart &rarr;
            </button>
            <div style={{
              background: '#f8fafc',
              borderRadius: 6,
              padding: 12,
              color: '#6c757d',
              fontSize: 14
            }}>
              <span role="img" aria-label="info">ℹ️</span> For best results, ensure your Y-Axis column contains numeric values.
            </div>
          </div>

          {/* Right: Data Preview */}
          <div className="datamapping-preview">
            <h2 style={{ marginBottom: 8 }}>Preview Data</h2>
            <div style={{ color: '#6c757d', marginBottom: 16 }}>Sample from selected sheet</div>
            <div className="datamapping-table-container">
              <table className="datamapping-table">
                <thead>
                  <tr>
                    {headers.map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.slice(0, 15).map((row, idx) => (
                    <tr key={idx}>
                      {headers.map(h => (
                        <td key={h}>{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataMapping;
