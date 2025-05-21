#!/bin/bash

# Wait for DynamoDB Local to start
until curl -s http://localstack:4566 > /dev/null; do
  echo "Waiting for DynamoDB Local to start..."
  sleep 2
done

# Create a table using AWS CLI
aws dynamodb create-table \
  --table-name Payments \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --endpoint-url http://localstack:4566 \
  --region us-east-1 \
  --debug

echo "DynamoDB setup complete."