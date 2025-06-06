import { DocumentClient } from './dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { MetadataBearer } from '@aws-sdk/types';
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { Payment } from '../models/payment.model';

export const getPayment = async (paymentId: string): Promise<Payment | null> => {
    const result = await DocumentClient.send(
        new GetCommand({
            TableName: 'Payments',
            Key: { id: paymentId },
        })
    );

    return (result.Item as Payment) || null;
};

export const listPayments = async (): Promise<Payment[]> => {
    const result = await DocumentClient.send(
        new ScanCommand({
            TableName: 'Payments',
        })
    );

    return (result.Items as Payment[]) || [];
};

export const createPayment = async (payment: Payment): Promise<MetadataBearer> => {
    if (!payment.id) {
        throw new Error("The 'Id' field is required for the Payments table.");
      }
    const result = await DocumentClient.send(
        new PutCommand({
            TableName: 'Payments',
            Item: payment,
        })
    );

    return result;
};

export const listTables = async (): Promise<string[]> => {
    const result = await DocumentClient.send(new ListTablesCommand({}));
    return result.TableNames || [];
  };
