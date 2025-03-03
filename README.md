# Worknest

Worknest is a platform where customers can discover and connect with skilled artisans in their vicinity. Customers can browse a variety of artisans, chat with them, and book their services seamlessly. Artisans undergo a thorough identity verification process before being onboarded to ensure trust and reliability.

## Features

- **Customer Features:**
  - Search for artisans based on skills and location
  - Chat with artisans in real-time
  - Book artisan services easily
  
- **Artisan Features:**
  - Register and verify identity
  - Receive service bookings
  - Communicate with potential customers

## Tech Stack

- **Frontend:** React.js, TypeScript
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Real-time Messaging:** Socket.io
- **Cloudinary for file and image uploads

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (Latest LTS version)
- MongoDB (Local or Cloud instance)

## Running the Project

### Backend

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/worknest.git
   cd worknest/backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables in a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SOCKET_IO_PORT=5000
   CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
   ```

4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the frontend development server:
   ```sh
   npm start
   ```

## Contributing

Feel free to fork the repository and make contributions via pull requests.

## License

This project is licensed under the MIT License.
