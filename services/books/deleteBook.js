// Import Prisma Client
import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient();

const deleteBook = async (id) => {
  console.log('Attempting to delete book with ID:', id);

  try {
    // Debugging: Test if the book exists in the database
    const testBook = await prisma.book.findUnique({
      where: { id },
    });
    console.log('Test Book:', testBook); // This will log the book if it exists, or `null` if it doesn't.

    // Check if the book exists
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      console.log('Book not found in the database.');
      return null; // No book found
    }

    // If the book exists, delete it
    const deletedBook = await prisma.book.delete({
      where: { id },
    });

    console.log('Successfully deleted book:', deletedBook);
    return deletedBook.id; // Return deleted book's ID
  } catch (error) {
    console.error('Error in deleteBook function:', error.message);
    throw error; // Re-throw the error to propagate it to the calling code
  }
};

export default deleteBook;
