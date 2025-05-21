import { randomUUID } from 'crypto';
import { createPayment, listTables } from '../../src/lib/payments';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler as createPaymentHandler } from '../../src/handlers/createPayment';
import { handler as getPaymentHandler } from '../../src/handlers/getPayment';

describe('DynamoDB Local Integration Test', () => {
  it('should create payments successfully via the handler', async () => {
    // Given a valid payment input
    const input = {
      amount: 100,
      currency: 'USD'
    }

    // When the handler is invoked with valid payment input
    const resCreatePaymentHandler = await createPaymentHandler({
      body: JSON.stringify(input)
    } as unknown as APIGatewayProxyEvent);
    console.log('Handler response:', resCreatePaymentHandler);
    expect(resCreatePaymentHandler.statusCode).toBe(201);

    // And the payment is retrieved on the same payment id
    const paymentId = JSON.parse(resCreatePaymentHandler.body).paymentId;

    const resGetPaymentHandler = await getPaymentHandler({
      pathParameters: {
        id: paymentId,
      },
    } as unknown as APIGatewayProxyEvent);

    expect(resGetPaymentHandler.statusCode).toBe(200);
    const resultGetPayment = JSON.parse(resGetPaymentHandler.body);

    // Then expect the created payment matches the retrieved payment
    expect(resultGetPayment.id).toBe(paymentId);
    expect(resultGetPayment.currency).toBe(input.currency);
    expect(resultGetPayment.amount).toBe(input.amount);
  });
});