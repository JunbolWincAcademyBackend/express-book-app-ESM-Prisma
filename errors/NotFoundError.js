/* NotFoundError.js is located in the errors folder because it’s a custom error class, not middleware. It's just defining the structure of a specific error (404), and you use it when needed. */

class NotFoundError extends Error {//The extends keyword is used to create a class that is a child of another class. It means that the new class will inherit the properties and methods of the parent class.
    constructor (resourceType, id) {//The constructor is a special method in a class that is automatically called when an instance of the class is created.The constructor method is used to set up the initial state of the object. In the case of NotFoundError, the constructor takes resourceType and id as arguments to create a meaningful error message.
      super(`${resourceType} with id ${id} was not found!`)// super is a function that calls the constructor of the parent class. It’s used within the constructor of a subclass to make sure that the parent class is initialized properly.. super calls the parent class's constructor with a custom message.
      this.name = 'NotFoundError'// Set the error's name to NotFoundError. When creating a custom error class, it’s common to override the name property to reflect the specific type of error. This makes it easier to identify and handle different types of errors in your code. By setting this.name = 'NotFoundError';, you are changing the name property of the NotFoundError instance from 'Error' (the default) to 'NotFoundError'.
      this.statusCode = 404; // Explicitly set the status code to 404
    }
  }
  
  export default NotFoundError

  // EXPLANATION:
/*   This is a custom error class that extends the built-in Error class in JavaScript. It allows you to create a specific type of error when a resource (book or record) cannot be found. This is useful because it encapsulates all the information about the error (like the resource type and ID) in a single place.

NotFoundError.js is a specific error class that represents a 404 Not Found error.

It's used to represent a scenario where a resource in the services folder (like a book or user) is not found. Instead of throwing a generic error, you're defining a specific type of error that is tailored to handle "not found" situations.

It’s implemented as a class because you’re defining a custom error type. Classes give you the ability to create specialized error objects that carry more information and are easier to catch and handle precisely.

Why uses a Class Instead of a Function?

Inheritance and Extensibility:

Classes in JavaScript are often used to create objects that share common functionality. When you use the extends keyword, you're saying that the new class you're defining is a specialized version of another class.
In this case, NotFoundError is a specialized version of the built-in Error class. By extending Error, NotFoundError inherits all the properties and methods of Error, but can also have its own custom behavior.

Clarity and Readability:

Using a class to define a custom error type makes the code more readable and self-explanatory. It clearly defines what kind of error is being created and provides a clean, organized way to manage error types.

Custom Behavior:

Classes allow you to easily add custom behavior to your error types. For example, you can define additional methods or properties in the NotFoundError class that are specific to "not found" errors, making it more powerful than a simple function.

Understanding the Concepts: extends, constructor, super, and this

1. extends:
The extends keyword is used to create a class that is a child of another class. It means that the new class will inherit the properties and methods of the parent class.
In NotFoundError.js, class NotFoundError extends Error means that NotFoundError is a subclass of the built-in Error class. This gives NotFoundError all the functionality of Error, plus anything additional you define in NotFoundError.

2. constructor:
The constructor is a special method in a class that is automatically called when an instance of the class is created.
The constructor method is used to set up the initial state of the object. In the case of NotFoundError, the constructor takes resourceType and id as arguments to create a meaningful error message.

3. super:
super is a function that calls the constructor of the parent class. It’s used within the constructor of a subclass to make sure that the parent class is initialized properly.
In NotFoundError, super is used to call the constructor of the Error class and pass the custom error message (${resourceType} with id ${id} was not found!). This sets up the error message in the Error class.

4. this:
this refers to the current instance of the class. It’s how you access properties and methods within the class.
In NotFoundError, this.name = 'NotFoundError'; sets the name property of the error instance to NotFoundError. This is useful when logging or handling errors, as it clearly identifies the type of error.

Can Functions Do All This?

Basic Error Handling: Yes, you can create custom error types using functions, but it would lack the structure, clarity, and extendability provided by classes.

No Inheritance: Functions can't "inherit" the behavior of another function in the same way classes can. You'd have to manually set up a lot of what extends and super provide automatically.

No Custom Behavior: Adding custom behavior or properties is more cumbersome with functions, while classes make it easy to define and reuse.


The Error Class and the name Property

The built-in Error class in JavaScript has a name property that, by default, is set to 'Error'. This property indicates the type of error. For example, if you create a new Error instance like this: new Error('Something went wrong!'), the name property will be 'Error'.

Customizing the name Property

Why Customize the name Property:

When creating a custom error class, it’s common to override the name property to reflect the specific type of error. This makes it easier to identify and handle different types of errors in your code. By setting this.name = 'NotFoundError';, you are changing the name property of the NotFoundError instance from 'Error' (the default) to 'NotFoundError'.

Practical Use:

This customization helps when you're logging errors or when you want to check the type of error that was thrown. For example, in your custom error handler (notFoundErrorHandler.js), you check if (err.name === 'NotFoundError') to see if the error is specifically a "Not Found" error.


*/