// Import Prisma Client
import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Function to update a book by ID
const updateBookById = async (id, title, author, isbn, pages, available, genre) => {
  // Fetch the existing book by ID
  const existingBook = await prisma.book.findUnique({ where: { id } });

  // If the book does not exist, throw an error
  if (!existingBook) {
    throw new Error(`Book with id ${id} was not found!`);
  }

  // Update the book using Prisma's update method
  const updatedBook = await prisma.book.update({
    where: { id },
    data: {
      title: title ?? existingBook.title, // Update title if provided, else keep the current title
      author: author ?? existingBook.author, // Update author if provided
      isbn: isbn ?? existingBook.isbn, // Update ISBN if provided
      pages: pages ?? existingBook.pages, // Update pages if provided
      available: available ?? existingBook.available, // Update availability if provided
      genre: genre ?? existingBook.genre, // Update genre if provided
    },
  });

  // Log confirmation of the updated book
  console.log('Updated book:', updatedBook);

  // Return the updated book object
  return updatedBook;
};

export default updateBookById;





