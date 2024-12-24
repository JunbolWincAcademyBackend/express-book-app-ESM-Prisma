import { PrismaClient } from '@prisma/client';
import NotFoundError from '../../errors/NotFoundError.js';

const prisma = new PrismaClient();

const getUserOrders = async (userId) => {
  const userOrders = await prisma.user.findUnique({
    where: { id: userId },
    include: { orders: true },
  });

  if (!userOrders) {
    throw new NotFoundError('User', userId); // Throw an error if user is not found
  }

  return userOrders;
};

export default getUserOrders;


