# Payments API

The Payments API is a backend service that allows users to create, retrieve, and manage payments. It is designed to simulate a real-world payments platform, leveraging AWS services such as API Gateway, Lambda, and DynamoDB. This project provides a skeleton implementation of the API, with key functionality implemented as part of the coding test.

## Purpose
The purpose of this application is to:
1. Allow users to create payments with unique IDs and store them in DynamoDB.
2. Retrieve payments by their ID.
3. List all payments or filter payments by currency. (not implemented)
4. Ensure data integrity through validation and error handling.

The application is built to reflect a real-world stack and can be run locally

---
## Limitations
1. Only 2/5 questions were completed
2. Handlers completed: getPayment, createPayment
3. Unit test coverage: Postive and Negative Flows
4. Dokerised Integration test coverage: incomplete
- Integration tests to call the handler which writes data into Dockerised dynamoDB. Maybe some helper functions to interact with DB to verify records


---

## Running the Application Locally
The application can be run locally using Node.js. It uses DynamoDB Local for database operations, so ensure DynamoDB Local is running before executing the application.

### Prerequisites
- Node.js (v16 or higher)
- Docker (for running DynamoDB Local)
- AWS CLI (optional, for deployment)

### Steps to Run Tests Locally
1. Install dependencies:
   ```bash
   npm install

2. Run Unit test
   ```bash
   npm run test:unit

3. Run Integration test
   ```bash
   npm run test:integration