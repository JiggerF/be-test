import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/getPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests the records for a specific payment', () => {
    it('returns the payment matching their input parameter.', async () => {
        // GIVEN a valid payment ID and a matching payment record
        const paymentId = randomUUID();
        const mockPayment = {
            id: paymentId,
            currency: 'AUD',
            amount: 2000,
        };

        // AND the getPayment service is mocked to return that record
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(mockPayment);

       // WHEN the handler is invoked with the paymentId
        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

       // THEN it should return 200 with the expected payment data
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockPayment);
        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });

    it('returns 404 when the payment is not found', async () => {
        // GIVEN a payment ID and no matching payment record
        const paymentId = randomUUID();

        // AND the getPayment service is mocked to return null
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

        // WHEN the handler is invoked with the paymentId
        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        // THEN it should return 404 with a message
        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body)).toEqual({ message: 'Payment not found' });
        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });

    it('returns 400 when the paymentId is not valid', async () => {
        // GIVEN an invalid payment ID
        const paymentId = 'invalid-uuid';

        // WHEN the handler is invoked with the invalid paymentId
        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        // THEN it should return 400 with a message
        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ message: 'PaymentId is not valid' });
    });

    it('returns 400 when the paymentId is missing', async () => {
        // GIVEN a request without a paymentId
        const result = await handler({
            pathParameters: {},
        } as unknown as APIGatewayProxyEvent);

        // THEN it should return 400 with a message
        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ message: 'PaymentId is required' });
    });

    // TODO: Add test for 500 error
});

afterEach(() => {
    jest.resetAllMocks();
});
