// Import Prisma Client
import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient();

const getBookById = async (id) => {// 🚩use async to create async await promises
  console.log('Fetching book data from database...');

  // Fetch the book from the database using Prisma's `findUnique` method
  // WHY: `findUnique` is optimized for queries that fetch a single record by a unique field.
  // HOW: This method uses the `where` attribute to find a record by ID.
  //Prisma's findUnique method is asynchronous, so you need to use await to resolve the Promise and retrieve the book.
  const book = await prisma.book.findUnique({
    where: { id },
  });

  console.log('Book fetched:', book);
  return book;
};

export default getBookById;


