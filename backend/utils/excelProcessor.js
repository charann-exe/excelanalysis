const XLSX = require('xlsx');

class ExcelProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ExcelProcessingError';
    }
}

const validateExcelData = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        throw new ExcelProcessingError('Invalid Excel data format');
    }

    // Check if headers exist
    if (!data[0] || !Array.isArray(data[0])) {
        throw new ExcelProcessingError('Missing headers in Excel file');
    }

    // Remove empty rows instead of throwing an error
    const nonEmptyRows = data.filter(row => row.some(cell => cell !== null && cell !== ''));
    if (nonEmptyRows.length === 0) {
        throw new ExcelProcessingError('Excel file contains no data');
    }

    return nonEmptyRows;
};

const transformExcelData = (data, options = {}) => {
    try {
        // Validate and get non-empty rows
        const cleanData = validateExcelData(data);
        const headers = cleanData[0];
        const rows = cleanData.slice(1);

        // Transform data based on options
        const transformedData = rows.map(row => {
            const transformedRow = {};
            headers.forEach((header, index) => {
                let value = row[index];

                // Apply transformations based on options
                if (options.trimStrings && typeof value === 'string') {
                    value = value.trim();
                }

                if (options.convertNumbers && !isNaN(value)) {
                    value = Number(value);
                }

                if (options.removeEmptyStrings && value === '') {
                    value = null;
                }

                transformedRow[header] = value;
            });
            return transformedRow;
        });

        return {
            headers,
            data: transformedData,
            totalRows: transformedData.length,
            totalColumns: headers.length
        };
    } catch (error) {
        throw new ExcelProcessingError(`Error transforming Excel data: ${error.message}`);
    }
};

const processExcelFile = async (filePath, options = {}) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetNames = workbook.SheetNames;
        const firstSheetName = sheetNames[0];
        const firstSheet = workbook.Sheets[firstSheetName];
        
        // Read with empty cells as null
        const rawData = XLSX.utils.sheet_to_json(firstSheet, { 
            header: 1,
            defval: null,
            blankrows: false
        });

        return transformExcelData(rawData, options);
    } catch (error) {
        throw new ExcelProcessingError(`Error processing Excel file: ${error.message}`);
    }
};

module.exports = {
    processExcelFile,
    transformExcelData,
    validateExcelData,
    ExcelProcessingError
}; 