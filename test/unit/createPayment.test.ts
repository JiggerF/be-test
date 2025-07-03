import * as payments from '../../src/lib/payments';
import { randomUUID } from 'crypto';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../src/handlers/createPayment';
import { vi } from 'vitest';

describe('When the user requests a payment to be created', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    const errorScenariosInvalidRequest = [
        {
            description: 'returns 400 for missing payment amount',
            input: { currency: 'AUD' },
            expectedStatusCode: 400,
            expectedErrorCode: 'INVALID_REQUEST'
        },
        {
            description: 'returns 400 for missing currency amount',
            input: { amount: 200.00 },
            expectedStatusCode: 400,
            expectedErrorCode: 'INVALID_REQUEST'
        },
        {
            description: 'returns 400 for nil payment amount and currency',
            input: {},
            expectedStatusCode: 400,
            expectedErrorCode: 'INVALID_REQUEST'
        },
        {
            description: 'returns 400 invalid currency code',
            input: { currency: 'INVALID', amount: 200.00 },
            expectedStatusCode: 400,
            expectedErrorCode: 'INVALID_REQUEST'
        },
        {
            description: 'returns 400 invalid amount format',
            input: { currency: 'aud', amount: 'invalid' },
            expectedStatusCode: 400,
            expectedErrorCode: 'INVALID_REQUEST'
        }
    ]

    const constSuccessScenarios = [
        {
            description: 'returns success for valid payment request',
            input: { currency: 'AUD', amount: 200.00 }
        },
        {
            description: 'returns success for payment with a small amount',
            input: { currency: 'aud', amount: 0.01 }
        },
        {
            description: 'returns success for payment with a big amount',
            input: { currency: 'aud', amount: 1000000 }
        },
    ]

    test.each(errorScenariosInvalidRequest)('$description', async ({ input, expectedStatusCode, expectedErrorCode }) => {
        // WHEN the handler is invoked with the test case input
        const result = await handler({
            body: JSON.stringify(input),
        } as unknown as APIGatewayProxyEvent);

        // THEN the resulting status code should match the expected status code
        const resultBody = JSON.parse(result.body);
        expect(resultBody.code).toBe(expectedErrorCode);
        expect(result.statusCode).toBe(expectedStatusCode);
    });

    test.each(errorScenariosInvalidRequest)('$description', async ({ input, expectedStatusCode, expectedErrorCode }) => {
        // WHEN the handler is invoked with the test case input
        const result = await handler({
            body: JSON.stringify(input),
        } as unknown as APIGatewayProxyEvent);

        // THEN the resulting status code should match the expected status code
        const resultBody = JSON.parse(result.body);
        expect(resultBody.code).toBe(expectedErrorCode);
        expect(result.statusCode).toBe(expectedStatusCode);
    });

    test.each(constSuccessScenarios)('$description', async ({ input }) => {
        // Given a valid payment request and a mock response
        const requestId = randomUUID();
        const successResponse = {
            "$metadata": {
                "httpStatusCode": 200,
                "requestId": requestId
            }
        };
        const createPaymentMock = vi.spyOn(payments, 'createPayment').mockResolvedValueOnce(successResponse);

        // WHEN the handler is invoked with the test case input
        const result = await handler({
            body: JSON.stringify(input),
        } as unknown as APIGatewayProxyEvent);

        // THEN resulting status code should be 201 with the correct requestId
        const resultBody = JSON.parse(result.body);
        expect(result.statusCode).toBe(201);
        expect(resultBody.requestId).toBe(requestId);
        expect(createPaymentMock).toHaveBeenCalledWith(expect.objectContaining(input));
        expect(createPaymentMock).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
    });

    it('returns 500 when there is an internal server error', async () => {
        // Given a valid payment request and a mock response
        const input = {
            amount: 100,
            currency: 'USD',
        };
        const createPaymentMock = vi.spyOn(payments, 'createPayment').mockImplementation(() => { throw new Error('Database connection failed') });

        // WHEN the handler is invoked with the test case input
        const result = await handler({
            body: JSON.stringify(input),
        } as unknown as APIGatewayProxyEvent);

        // THEN the resulting status code should match the expected status code
        const resultBody = JSON.parse(result.body);
        expect(result.statusCode).toBe(500);
        expect(resultBody.code).toBe('INTERNAL_SERVER_ERROR');
        expect(createPaymentMock).toHaveBeenCalledWith(expect.objectContaining(input));
    });
});
