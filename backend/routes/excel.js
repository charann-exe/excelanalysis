const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { processExcelFile, ExcelProcessingError } = require('../utils/excelProcessor');

// Configure multer for Excel file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Excel files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload and process Excel file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Process Excel file with options
        const options = {
            trimStrings: true,
            convertNumbers: true,
            removeEmptyStrings: true
        };

        const processedData = await processExcelFile(req.file.path, options);

        // Store in MongoDB
        const user = await User.findById(req.user._id);
        user.uploadHistory.push({
            fileName: req.file.filename,
            originalName: req.file.originalname,
            uploadDate: new Date(),
            fileSize: req.file.size,
            sheets: processedData.headers,
            data: processedData.data,
            totalRows: processedData.totalRows,
            totalColumns: processedData.totalColumns,
            status: 'success'
        });
        await user.save();

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: 'File uploaded and processed successfully',
            metadata: {
                user: req.user._id,
                filename: req.file.originalname,
                uploadDate: new Date(),
                totalRows: processedData.totalRows,
                totalColumns: processedData.totalColumns
            },
            data: processedData
        });

    } catch (error) {
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        
        if (error instanceof ExcelProcessingError) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message || 'Error processing file' });
    }
});

// Get upload history for current user
router.get('/history', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.uploadHistory);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching upload history' });
    }
});

module.exports = router; 