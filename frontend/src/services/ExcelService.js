export const ExcelService = {
  getFileById: async (fileId) => {
    try {
      // TODO: Replace with actual API call
      // This is a mock implementation
      return {
        sheets: ['Sheet1', 'Sheet2'],
        data: {
          'Sheet1': [
            { name: 'John', age: 30, salary: 50000 },
            { name: 'Jane', age: 25, salary: 45000 },
            { name: 'Bob', age: 35, salary: 60000 },
            { name: 'Alice', age: 28, salary: 55000 },
            { name: 'Charlie', age: 32, salary: 52000 }
          ],
          'Sheet2': [
            { product: 'Laptop', sales: 120, revenue: 120000 },
            { product: 'Phone', sales: 200, revenue: 100000 },
            { product: 'Tablet', sales: 80, revenue: 40000 },
            { product: 'Monitor', sales: 50, revenue: 25000 },
            { product: 'Keyboard', sales: 150, revenue: 15000 }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }
}; 