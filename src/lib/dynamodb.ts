import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const DEFAULT_PARAMS = {
    region: process.env.AWS_REGION || 'ap-southeast-2',
};

const isTest = (process.env.NODE_ENV || '').toLowerCase() === 'test';

const testConfig = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || 'dummy',
        secretAccessKey: process.env.AWS_SECRET_KEY || 'dummy',
    },
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:4566',
    region: process.env.AWS_REGION || 'local',
    sslEnabled: false,
};

export const DynamoDB = new DynamoDBClient({
    ...DEFAULT_PARAMS,
    ...(isTest && testConfig),
});

export const DocumentClient = DynamoDBDocumentClient.from(DynamoDB);
