import { randomUUID } from 'crypto';
import { createPayment, listTables } from '../../src/lib/payments';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../src/handlers/createPayment';

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

  it('should write to DynamoDB payments table', async () => {
    try {
      const payment = {
        id: randomUUID(),
        amount: 100,
        currency: 'USD',
      };
      const resultPayment = await createPayment(payment);
      console.log('Payment created:', resultPayment); // Log the result of the payment creation

      // const resultReadPayment = await getPayment(payment.id);
      // console.log('Payment read:', resultReadPayment); // Log the result of the payment read
    } catch (error) {
      console.error('Error reading / writing to table', error);
      throw error; // Fail the test if an error occurs
    }
  });

  it('should insert a payment into DynamoDB via the handler', async () => {
    const input = {
      body: {
        amount: 100,
        currency: 'USD',
      }
    }

    const result = await handler({
      body: JSON.stringify(input),
      headers: {
        'Content-Type': 'application/json',
      },
      httpMethod: 'POST',
    } as unknown as APIGatewayProxyEvent);

  });
});