// Import PrismaClient
import { PrismaClient } from '@prisma/client';

// Instantiate PrismaClient outside the function
// WHY: By creating a single instance of PrismaClient here, we avoid creating a new database connection every time `getBooks` is called. This improves performance and avoids connection leaks.
const prisma = new PrismaClient();

// Define the getBooks function
// This function retrieves a list of books from the database, optionally filtering by genre and availability.
const getBooks = async (genre, available) => {//  🚩use async to create async await promises
  console.log('Querying database with Prisma...');

  // Create a base query object
  // WHY: This object will store any filters (like genre or availability) that are provided. Starting with an empty `where` ensures flexibility for optional filters.
  const query = {
    where: {}, // Initialize an empty filter
  };

  // Add a genre filter if specified
  // HOW: If `genre` is provided, it gets added to the `where` object. This ensures only books with the specified genre are retrieved.
  if (genre) {
    query.where.genre = genre;
  }

  // Add an availability filter if specified
  // HOW: The `available` parameter is a string (from query params in most cases), so we convert it to a boolean using `JSON.parse`.
  // EXAMPLE: If available is "true", this adds `available: true` to the query.
  if (available !== undefined) {
    query.where.available = JSON.parse(available); // Convert string to boolean
  }

  console.log('Generated query:', query); // Log the dynamically built query for debugging.

  // Execute the query using Prisma
  // HOW: Prisma's `findMany` method fetches all records that match the filters defined in the `query` object.
  const books = await prisma.book.findMany(query);

  console.log('Books fetched from database:', books); // Log the results for debugging.

  // Return the filtered list of books
  // WHY: This makes the data available to the caller (e.g., an API endpoint or another function).
  return books;
};

// Export the function for use in other parts of the application
// WHY: Keeping this function modular allows it to be reused in services, APIs, or other parts of the project.
export default getBooks;

//NOTES:

/* Detailed Commentary on Each Section

PrismaClient Instantiation: PrismaClient is instantiated once outside the function to ensure efficient connection management.
Avoids opening and closing connections repeatedly, which can lead to performance bottlenecks in production.
Dynamic Query Building:

A where object starts as empty.
Filters (e.g., genre and available) are added dynamically based on the input parameters.
This makes the code more flexible and extensible—e.g., adding more filters (like author or pages) in the future is straightforward.

Handling available: Query parameters are usually strings (e.g., "true", "false").
Using JSON.parse to convert the string to a boolean ensures compatibility with the database schema, which expects a Boolean value.

Logging: Added multiple console.log statements to log the query object and results for debugging.
WHY: This helps during development to understand how the function behaves with different inputs.

Returning Data: Returning the results of the Prisma query (books) allows the function to be modular and reusable.
E.g., It can be used in an API route, another service, or even a unit test.


*****------- Why This Approach Is Better ---------****
Performance: By reusing a single PrismaClient instance, you minimize overhead and avoid connection limits in your database.

Flexibility: Dynamic query building with the where object makes it easier to add or modify filters without rewriting the entire query.

Scalability: This approach can be easily extended to handle more filters, pagination, or sorting in the future.

Debugging: Clear logging makes it easier to understand what’s happening at each step, which is invaluable when things don’t work as expected. */






