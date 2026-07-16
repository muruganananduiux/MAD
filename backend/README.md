# MAD NGO Donation Platform Backend

This is the Node.js backend for the MAD donation platform built with Express, MongoDB, JWT authentication, Cloudinary, Razorpay, and Nodemailer.

## Features

- JWT authentication with refresh tokens
- Email verification, forgot password, reset password, change password
- User profile management
- NGO registration and approval flow
- Campaign CRUD operations, search, filter, popular, featured, latest
- Donation order creation and verification with Razorpay
- Cloudinary uploads for profile, NGO documents, campaign images
- Admin dashboard statistics
- Swagger API documentation
- Input validation and global error handling

## Project Structure

```
backend/
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
├── utils
├── validators
├── uploads
├── app.js
├── server.js
├── package.json
└── .env.example
```

## Setup

1. Copy `.env.example` to `.env`
2. Update values in `.env`
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start development server:

```bash
npm run dev
```

5. Open API docs at:

```bash
http://localhost:5000/api/docs
```

## Seed Data

```bash
npm run seed
```
