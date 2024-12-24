// Import Prisma Client
import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient();

const updateBookById = async (id, title, author, isbn, pages, available, genre) => {
  console.log(`Attempting to update book with ID: ${id}...`);

  // Check if the book exists
  const existingBook = await prisma.book.findUnique({
    where: { id },
  });

  if (!existingBook) {
    // Throw an error if the book is not found
    throw new Error(`Book with id ${id} was not found!`);
  }

  // Update the book using Prisma's `update` method
  const updatedBook = await prisma.book.update({
    where: { id },
    data: {
      title: title ?? existingBook.title,       // Use nullish coalescing to preserve existing values
      author: author ?? existingBook.author,
      isbn: isbn ?? existingBook.isbn,
      pages: pages ?? existingBook.pages,
      available: available ?? existingBook.available,
      genre: genre ?? existingBook.genre,
    },
  });

  console.log('Updated book:', updatedBook);
  return updatedBook; // Return the updated book
};

export default updateBookById;





