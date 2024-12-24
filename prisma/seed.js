// Import dependencies
// We need Prisma Client, and the two JSON files, which we import the exact same way as we imported it to our services back then. Instead of using "assert" use instead "with", assert is deprecated.
import { PrismaClient } from '@prisma/client';

/* Prisma Client" refers to the PrismaClient that you use to interact with your database. And you're correct that this is the same PrismaClient you import in your seed.js file.

What is the Prisma Client?
The Prisma Client is an auto-generated, type-safe database client that allows you to:

Query your database (e.g., fetch data).
Perform CRUD operations (create, read, update, delete).
Execute raw SQL if needed.
After running npx prisma generate, Prisma creates the client in the node_modules/@prisma/client folder. This is the client you import in your code. */


import booksData from '../data/books.json' with { type: 'json' };
import usersData from '../data/users.json' with { type: 'json' };
import orderData from '../data/orders.json' assert { type: 'json' }// new added line to import orders


// because I was getting an ERROR on 'books' on: import books from '../data/books.json' with { type: 'json' }; 
/* ERROR: TypeError: books is not iterable because books is an object:The name you give in the import statement, like books or booklist, is just a local variable or placeholder for the imported data. It is not tied to the books key inside the JSON file.

The issue here is that your books.json file wraps the actual list of books inside a property called "books". As a result, when you import the JSON, you're getting an object like this:
{
  books: [ ... ] // The array of books
}


Since the seeding code directly attempts to iterate over books, it's trying to iterate over the object, which isn't iterable.
Solution: We need to adjust your seeding script to destructure the books and users arrays correctly after importing them.*/


//Destructure the arrays from the imported JSON data
const { books } = booksData; // Extract the `books` array from the JSON object. You are destructuring the bookData object to extract the value associated with the key "books", which in this case is the array.
const { users } = usersData; // Extract the `users` array from the JSON object

const { orders } = orderData;// Extract the `orders` array by destructuring the orders JSON object

console.log("Seeding users:", users); // Add this to check users array
console.log('Seeding orders:', orders);

// Create Prisma client
// Next, we create the PrismaClient with a bit of configuration - we define all log levels to be able to log meaningful information to the console when running this script.
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });


// Implement the main function
/* 
Loads books and users from the imported JSON modules.

Loops through both collections and executes the upsert function for each element. 
Upsert stands for update and insert. We use this function because we might want to use this script to reset the database to the original state. 
Also, we don’t want it to fail in case we try to insert a non-unique ID. 
*/

async function main() {
  // Loop through books and insert or update each record
  for (const book of books) {
    await prisma.book.upsert({
      where: { id: book.id }, // This is the first condition where Prisma Check if a record with this `id` exists
      update: {},            // What to do if it exists (empty here, so no changes)
      create: book,          // What to do if it doesn’t exist (create the book) iN case a programmer added an new book to the json file. The command npx prisma db seed will add that new book to the database
    });
  }

  // Loop through users and insert or update each record
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id }, // Check if a record with this `id` exists
      update: {},            // What to do if it exists (empty here, so no changes)
      create: user,          // What to do if it doesn’t exist (create the user)
    });
  }

  // Loop through orders and insert or update each order
for (const order of orders) {
  await prisma.order.upsert({
    where: { id: order.id },
    update: {},
    create: order
  })
}


  console.log('Database seeded successfully!');
}

/* What Happens Behind the Scenes?
Here’s the workflow Prisma follows when you run the seed script:

For each book, Prisma executes a SELECT query to check if a record with the specified id exists in the database (this is the where block).

Based on the result of the query:

If a record exists, Prisma executes an UPDATE query (if update is specified).
If no record exists, Prisma executes an INSERT query (using the create block). */

// Calling the function
/* 
Right after the definition, we call the main function adding a couple of Promise handlers to it 
(disconnect the client when done and log out the error if there is any). 
*/



main()
  .then(async () => {
    await prisma.$disconnect(); // Disconnect Prisma client after seeding
  })
  .catch(async (e) => {
    console.error(e); // Log any errors
    await prisma.$disconnect();
    process.exit(1); // Exit with a non-zero status on error
  });


