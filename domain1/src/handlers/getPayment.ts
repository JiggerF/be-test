import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment } from '../lib/payments';
import { buildResponse } from '../lib/apigateway';
import { validate as isUUID } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const paymentId = event.pathParameters?.id;

    // Validate the paymentId
    if (!paymentId || !isUUID(paymentId)) {
        const errorMessage = !paymentId ? 'PaymentId is required' : 'PaymentId is not valid';
        return buildResponse(400, {
            message: errorMessage,
            code: 'INVALID_INPUT',
        })
    }

    try {
        const result = await getPayment(paymentId);
        return result
            ? buildResponse(200, result)
            : buildResponse(404, {
                message: 'Payment not found',
                code: 'NOT_FOUND'
            });
    } catch (error) {
        console.error(`Error fetching payment with ID ${paymentId}:`, error);
        return buildResponse(500, { 
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR' 
        });
    }

};
