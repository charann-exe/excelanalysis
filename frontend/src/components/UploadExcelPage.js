import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Navbar from './Navbar';
import './UserDashboard.css';
import './DataMapping.css';

const UploadExcelPage = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Please select an Excel file (.xls or .xlsx)');
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError('');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange({ target: { files: [droppedFile] } });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUploadAndContinue = () => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
            navigate('/data-mapping', { state: { data: json, sheetName } });
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: 32 }}>
                <h2>Upload Excel File</h2>
                <p>Upload an Excel file to generate charts and visualizations</p>
                <div className="dashboard-upload-card">
                    <div className="dashboard-upload-title">Upload File</div>
                    <div className="dashboard-upload-desc">
                        Supported formats: <b>.xls, .xlsx</b> (Excel files)
                    </div>
                    {!file ? (
                        <div
                            style={{
                                border: '2px dashed #d1d5db',
                                borderRadius: 12,
                                padding: 48,
                                textAlign: 'center',
                                marginBottom: 24,
                                background: '#fcfdff',
                                cursor: 'pointer'
                            }}
                            onClick={() => fileInputRef.current.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <div style={{ fontSize: 40, marginBottom: 12, color: '#38bdf8' }}>⬆️</div>
                            <div style={{ fontWeight: 600, marginBottom: 6 }}>Drag & drop your Excel file here</div>
                            <div style={{ color: '#6c757d', fontSize: 15 }}>or click to browse files</div>
                            <div style={{ color: '#adb5bd', fontSize: 13, marginTop: 6 }}>
                                Support for .xls and .xlsx formats
                            </div>
                            <input
                                type="file"
                                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div
                            style={{
                                background: '#f8fafc',
                                borderRadius: 8,
                                padding: 18,
                                marginBottom: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <span style={{ fontSize: 22, color: '#38bdf8', marginRight: 12 }}>📄</span>
                                <span style={{ fontWeight: 600 }}>{file.name}</span>
                                <span style={{ color: '#6c757d', marginLeft: 10, fontSize: 14 }}>
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#dc3545',
                                    fontSize: 20,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setFile(null)}
                                title="Remove file"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                    <button
                        className="upload-btn-full"
                        style={{ marginTop: 16 }}
                        onClick={handleUploadAndContinue}
                        disabled={!file}
                    >
                        <span role="img" aria-label="upload">📤</span> Upload and Continue
                    </button>
                </div>
            </div>
        </>
    );
};

export default UploadExcelPage; 