const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
    }

    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: 'File Upload Error',
            details: err.message
        });
    }

    // Handle Excel processing errors
    if (err.name === 'ExcelProcessingError') {
        return res.status(400).json({
            error: 'Excel Processing Error',
            details: err.message
        });
    }

    // Default error
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

module.exports = errorHandler; 