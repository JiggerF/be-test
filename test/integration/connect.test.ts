import { listTables } from '../../src/lib/payments'; 

describe('DynamoDB Local Integration Test', () => {
  it('should connect to DynamoDB Local and list tables', async () => {
    try {
      const tables = await listTables();
      console.log('Tables:', tables); // Log the table names
      expect(tables).toBeDefined(); // Ensure the response is defined
      expect(Array.isArray(tables)).toBe(true); // Ensure the response is an array
    } catch (error) {
      console.error('Error listing tables:', error);
      throw error; // Fail the test if an error occurs
    }
  });
});