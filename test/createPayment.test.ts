import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../src/createPayment';

describe('When the user requests a payment to be created', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('returns 201 success for the created payment', async () => {
        // GIVEN a valid payment request and a mock response
        const payment = {
            currency: 'AUD',
            amount: 200.00,
        }
        const successResponse = {
            "$metadata": {
                "httpStatusCode": 200, // Indicates success
                "requestId": "12345-abcde", // Unique ID for the request
                "attempts": 1, // Number of retry attempts
                "totalRetryDelay": 0 // Total delay due to retries
            },
        };

        // AND the createPayment service is mocked to return success
        const createPaymentMock = jest.spyOn(payments, 'createPayment').mockResolvedValueOnce(successResponse);

        // WHEN the handler is invoked with the payment request
        const result = await handler({
            body: JSON.stringify(payment),
            headers: {
                'Content-Type': 'application/json',
            },
            httpMethod: 'POST',
        } as unknown as APIGatewayProxyEvent);

        // THEN it should return success
        expect(result.statusCode).toBe(201);

        const resultBody = JSON.parse(result.body)
        expect(resultBody.paymentId).not.toBeNull();
        expect(createPaymentMock).toHaveBeenCalledWith(
            expect.objectContaining({
                amount: payment.amount,
                currency: payment.currency,
        }));
    });
    it('returns 400 for invalid payment request', async () => {
        // GIVEN an invalid payment request and a mock response
        const payment = {}
        const mockReponse = {
            "$metadata": {},
        };

        // AND the createPayment service is mocked to return success
        const createPaymentMock = jest.spyOn(payments, 'createPayment').mockResolvedValueOnce(mockReponse);

        // WHEN the handler is invoked with the payment request
        const result = await handler({
            body: JSON.stringify(payment),
            headers: {
                'Content-Type': 'application/json',
            },
            httpMethod: 'POST',
        } as unknown as APIGatewayProxyEvent);

        // THEN it should return success
        expect(result.statusCode).toBe(400);

        const resultBody = JSON.parse(result.body)
        expect(resultBody.paymentId).not.toBeNull();
    });
});
