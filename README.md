# Seller Application 

This is an simple CRUD seller application implemented in Typescript and this involves registering a new seller and dealing with products i.e. performing CRUD operations on products.


## Dependencies 

### 1. Express : -
Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs.

### 2. bcryptjs : -
bcryptjs is a JavaScript implementation of the bcrypt password hashing function. It is designed to be secure and efficient, making it a suitable choice for hashing passwords in Node.js applications.

### 3. express-rate-limit : -
express-rate-limit is a middleware for Express.js applications that helps control the rate at which requests can be made to the server. It is particularly useful for preventing abuse by limiting the number of requests a client can make to your API within a specific time frame. 

### 4. Joi : - 
Joi is a powerful schema validation library for JavaScript applications. It provides a simple and expressive API for defining schemas and validating data against those schemas. 

### 5. JsonWebToken : - 
JsonWebToken is used for authentication purpose by creating tokens.

### 6. Mongoose : -
Mongoose is an ODM used to connect server with database and make modifications in database.

### 7. Nodemailer : -
Nodemailer is used to attach email functionality to the application.

## `.env` File 

### `SERVER_PORT`
The port at which express server will run.

### `MONGO_URI`
Mongo_URI is the connection url of mongoDB database.

### `SMTP_HOST`
SMTP_HOST is the host for sending emails.

### `SMTP_USER`
SMTP_USER is the id of User that will send emails

### `SMTP_PASS`
SMTP_PASS is password for SMTP_USER.

### `JWT_SECRET_KEY`
JWT_SECRET_KEY is the key used to generate tokens with the help of JsonWebToken. JWT Token is used to encrypt and sign the JWT Token so it can not be tempered by any party


## Steps to Run 

1. Firstly install all the dependencies and to do that run the following command `npm install`.
2. Now start the project by running command `npm run dev`.