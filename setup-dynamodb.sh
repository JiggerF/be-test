#!/bin/bash

# Wait for DynamoDB Local to start
until curl -s http://dynamodb-local:8000 > /dev/null; do
  echo "Waiting for DynamoDB Local to start..."
  sleep 2
done

# Create a table using AWS CLI
aws dynamodb create-table \
  --table-name Payments \
  --attribute-definitions AttributeName=Id,AttributeType=S \
  --key-schema AttributeName=Id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  --endpoint-url http://dynamodb-local:8000 \
  --region us-east-1 \
  --debug

echo "DynamoDB setup complete."