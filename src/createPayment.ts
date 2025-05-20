import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { randomUUID } from 'crypto';
import { isValidAmount } from './lib/validators';
import * as currencyCodes from 'currency-codes';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payment = parseInput(event.body || '{}') as Payment;

    // Validate amount and currency 
    if (!payment?.amount || !payment?.currency) {
        return buildResponse(400, {
            message: 'Invalid request. Payment must contain amount and currency.',
            code: 'INVALID_REQUEST'
        });
    }

    // Validate currency in ISO 4217 format
    if (!currencyCodes.code(payment.currency)) {
        return buildResponse(400, {
            message: 'Invalid currency code.',
            code: 'INVALID_REQUEST'
        });
    }

    // Validate amount format
    if (!isValidAmount(payment.amount)) {
        return buildResponse(400, {
            message: 'Invalid amount format. Amount must be a number with up to two decimal places.',
            code: 'INVALID_REQUEST'
        });
    }

    try {
        payment.id = randomUUID();
        const result = await createPayment(payment)
        return result?.$metadata.httpStatusCode === 200
            ? buildResponse(201, {
                message: 'Payment created successfully',
                paymentId: payment.id,
                requestId: result.$metadata.requestId ?? 'unknown-request-id'
            })
            : buildResponse(500, {
                message: 'Failed to create payment',
                code: 'PAYMENT_CREATION_FAILED'
            });
    } catch (error) {
        return buildResponse(500, {
            message: 'An error occurred while creating the payment',
            code: 'INTERNAL_SERVER_ERROR'
        });
    }
}

