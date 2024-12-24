// Import Prisma Client
import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Define the function to create a new book
const createBook = async (title, author, isbn, pages, available, genre) => {
  console.log('Attempting to create a new book...');

  try {
    // Use Prisma's `create` method to add the new book to the database
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        pages,
        available,
        genre,
      },
    });

    console.log('New book successfully created:', newBook); // ✅ Log the new book
    return newBook; // Return the newly created book
  } catch (error) {
    console.error('Error creating new book:', error.message); // Log error
    throw new Error('Failed to create the book.'); // Rethrow error for handling
  }
};

export default createBook;
