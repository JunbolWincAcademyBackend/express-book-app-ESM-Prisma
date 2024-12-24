import { Router } from 'express'; // Import Router from Express
import notFoundErrorHandler from '../middleware/notFoundErrorHandler.js'; // Middleware to handle 404 errors
import getUserOrders from '../services/users/getUserOrders.js'; // 🚩 Import the service function to fetch user orders
import { PrismaClient } from '@prisma/client'; // 🚩 Import Prisma Client

const prisma = new PrismaClient(); // 🚩 Initialize Prisma Client
const router = Router();

// 🚩 Add a route to fetch all users
router.get('/', async (req, res, next) => {
  try {
    console.log('Fetching all users'); // Debug log
    const users = await prisma.user.findMany(); // Fetch all users from the database
    res.status(200).json(users); // Respond with all users as JSON
  } catch (error) {
    console.error('Error fetching users:', error.message); // Log the error
    next(error); // Pass errors to the error-handling middleware
  }
});

// Existing route to get orders for a specific user
router.get('/:id/orders', async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the user ID from the URL
    const userOrders = await getUserOrders(id); // 🚩 Call the service function to fetch user orders
    res.status(200).json(userOrders); // Respond with the user and their orders
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
}, notFoundErrorHandler); // Attach the not-found error handler as a fallback

export default router; // Export the router for use in the main app

