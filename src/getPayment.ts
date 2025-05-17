import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment } from './lib/payments';
import { buildResponse } from './lib/apigateway';
import { validate as isUUID } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const paymentId = event.pathParameters?.id;

    if (!paymentId || !isUUID(paymentId)) {
        const errorMessage = !paymentId ? 'PaymentId is required' : 'PaymentId is not valid';
        return buildResponse(400, { message: errorMessage })
    }

    try {
        const result = await getPayment(paymentId);
        return result
            ? buildResponse(200, result)
            : buildResponse(404, { message: 'Payment not found' });
    } catch (error) {
        console.error('Error fetching payment', { paymentId, error });
        return buildResponse(500, { message: 'Internal server error' });
    }

};
