import mongoose from 'mongoose';
import { Subject } from './models/Subject';
import { Topic } from './models/Topic';
import { Problem } from './models/Problem';
import { connectDB } from './config/db';
import { Recap } from './models/Recap';

const demoData = {
  subjects: [
    { name: 'JS' },
    { name: 'Data Structure' },
    { name: 'Algorithms' },
    { name: 'React' },
    { name: 'DB' },
    { name: 'Python' }
  ],
  topics: [
    { 
      name: 'Promises', 
      subjectName: 'JS',
      difficulty: 'Intermediate',
      prerequisites: ['Callbacks', 'Asynchronous Programming'],
      learningObjectives: [
        'Understand Promise lifecycle and states',
        'Master Promise chaining',
        'Handle errors effectively',
        'Work with Promise combinators',
        'Implement custom Promises'
      ],
      recap: `# Understanding Promises in JavaScript

## Core Concepts

### What is a Promise?
A Promise is an object representing the eventual completion (or failure) of an asynchronous operation. It serves as a proxy for a value that may not be known when the promise is created.

### Promise States
1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed
4. **Settled**: Promise is either fulfilled or rejected (final state)

### Promise Syntax
\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  // Async operation here
  if (success) {
    resolve(value);  // Fulfills the promise
  } else {
    reject(error);   // Rejects the promise
  }
});
\`\`\`

## Working with Promises

### Promise Chaining
\`\`\`javascript
fetchUserData(userId)
  .then(user => fetchUserPosts(user.id))
  .then(posts => {
    return posts.map(post => ({
      ...post,
      timestamp: new Date(post.timestamp)
    }));
  })
  .catch(error => handleError(error));
\`\`\`

### Error Handling Patterns
\`\`\`javascript
// Pattern 1: Catch at the end
promise
  .then(handleSuccess)
  .catch(handleError);

// Pattern 2: Catch and continue
promise
  .then(handleSuccess)
  .catch(handleError)
  .then(cleanup);

// Pattern 3: Catch specific errors
promise
  .then(handleSuccess)
  .catch(NetworkError, handleNetworkError)
  .catch(ValidationError, handleValidationError)
  .catch(handleGenericError);
\`\`\`

### Promise Combinators
1. **Promise.all()**: Parallel execution, fails fast
\`\`\`javascript
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
])
.then(([users, posts, comments]) => {
  // All requests successful
})
.catch(error => {
  // Any request failed
});
\`\`\`

2. **Promise.race()**: First to settle wins
\`\`\`javascript
Promise.race([
  fetch('/api/data'),
  timeout(5000)
])
.then(handleData)
.catch(handleTimeout);
\`\`\`

3. **Promise.allSettled()**: Wait for all to settle
\`\`\`javascript
Promise.allSettled([
  fetch('/api/critical'),
  fetch('/api/optional')
])
.then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      handleSuccess(result.value);
    } else {
      handleError(result.reason);
    }
  });
});
\`\`\`

## Best Practices

1. **Always Return Promises**
   - Maintain chainability
   - Consistent async handling

2. **Error Handling**
   - Use specific error types
   - Handle errors at appropriate levels
   - Avoid swallowing errors

3. **Avoid Promise Hell**
   - Use async/await for cleaner code
   - Break down complex chains
   - Extract reusable Promise-based functions

4. **Memory Management**
   - Clean up resources in finally blocks
   - Don't create unnecessary promises
   - Handle promise rejection

## Common Pitfalls

1. **Forgetting to Handle Rejections**
\`\`\`javascript
// Bad
somePromise().then(handleSuccess);

// Good
somePromise()
  .then(handleSuccess)
  .catch(handleError);
\`\`\`

2. **Nested Promise Chains**
\`\`\`javascript
// Bad
getData().then(data => {
  getMoreData(data).then(moreData => {
    // Nested hell
  });
});

// Good
getData()
  .then(data => getMoreData(data))
  .then(moreData => {
    // Flat chain
  });
\`\`\`

3. **Not Using Promise Combinators**
\`\`\`javascript
// Bad
const results = [];
for (const item of items) {
  results.push(await processItem(item));
}

// Good
const results = await Promise.all(
  items.map(item => processItem(item))
);
\`\`\`

## Related Topics
- Async/Await
- Event Loop
- Callbacks
- Error Handling
- Asynchronous Programming

## Additional Resources
- [MDN Promise Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [JavaScript.info Promises](https://javascript.info/promise-basics)
- [Promise A+ Specification](https://promisesaplus.com/)`
    },
    { 
      name: 'Fetch', 
      subjectName: 'JS',
      difficulty: 'Intermediate',
      prerequisites: ['Promises', 'HTTP Basics', 'JSON'],
      learningObjectives: [
        'Master the Fetch API for making HTTP requests',
        'Handle different types of responses and errors',
        'Work with request and response objects',
        'Implement proper error handling and retry logic',
        'Optimize fetch requests with proper headers and options'
      ],
      recap: `# Working with Fetch API

## Core Concepts

### What is Fetch?
The Fetch API provides a modern interface for making HTTP requests. It returns Promises, making it perfect for async operations and modern JavaScript patterns.

### Key Components
1. **Request Object**
   - URL
   - Method (GET, POST, etc.)
   - Headers
   - Body
   - Credentials
   - Mode (CORS)

2. **Response Object**
   - Status codes
   - Headers
   - Body methods (json(), text(), blob())
   - Response types

## Working with Fetch

### Basic GET Request
\`\`\`javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
\`\`\`

### POST Request with Options
\`\`\`javascript
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({
    title: 'New Post',
    body: 'Content here'
  })
})
.then(handleResponse)
.catch(handleError);
\`\`\`

### Error Handling Patterns
\`\`\`javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
\`\`\`

### Working with Headers
\`\`\`javascript
// Setting headers
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', 'Bearer token');

// Reading headers
fetch(url)
  .then(response => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  });
\`\`\`

## Best Practices

1. **Error Handling**
   - Always check response.ok
   - Handle different types of errors
   - Implement retry logic for transient failures
   - Use proper error messages

2. **Request Configuration**
   - Set appropriate headers
   - Handle CORS properly
   - Manage credentials
   - Set timeouts

3. **Response Handling**
   - Check content type
   - Handle different response types
   - Stream large responses
   - Clean up resources

4. **Performance**
   - Implement caching
   - Use request pooling
   - Handle concurrent requests
   - Optimize payload size

## Common Pitfalls

1. **Not Checking Response Status**
\`\`\`javascript
// Bad
fetch(url).then(response => response.json());

// Good
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return response.json();
  });
\`\`\`

2. **Not Handling Network Errors**
\`\`\`javascript
// Bad
fetch(url).then(handleSuccess);

// Good
fetch(url)
  .then(handleSuccess)
  .catch(error => {
    if (error.name === 'TypeError') {
      // Network error
    } else {
      // Other errors
    }
  });
\`\`\`

3. **Not Cleaning Up Resources**
\`\`\`javascript
// Bad
fetch(url).then(response => response.blob());

// Good
fetch(url)
  .then(response => response.blob())
  .then(blob => {
    // Use blob
    URL.revokeObjectURL(blob);
  });
\`\`\`

## Related Topics
- Promises
- HTTP/HTTPS
- CORS
- JSON
- Error Handling
- Network Requests

## Additional Resources
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Fetch API Specification](https://fetch.spec.whatwg.org/)
- [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
`
    },
    { 
      name: 'Objects', 
      subjectName: 'JS',
      difficulty: 'Fundamental',
      prerequisites: ['Variables', 'Data Types', 'Functions'],
      learningObjectives: [
        'Master object creation and manipulation',
        'Understand object properties and methods',
        'Work with object prototypes and inheritance',
        'Implement object-oriented patterns',
        'Handle object immutability and cloning'
      ],
      recap: `# Working with JavaScript Objects

## Core Concepts

### What are Objects?
Objects in JavaScript are collections of key-value pairs, where keys are strings (or Symbols) and values can be any data type, including other objects, functions, and primitives.

### Key Components
1. **Properties**
   - Data properties
   - Accessor properties (getters/setters)
   - Property descriptors
   - Property attributes (enumerable, configurable, writable)

2. **Methods**
   - Object methods
   - Prototype methods
   - Static methods
   - Instance methods

3. **Prototypes**
   - Prototype chain
   - Inheritance
   - Object.create()
   - Constructor functions

## Working with Objects

### Object Creation
\`\`\`javascript
// Object literal
const person = {
  name: 'John',
  age: 30,
  greet() {
    console.log(\`Hello, my name is \${this.name}\`);
  }
};

// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  console.log(\`Hello, my name is \${this.name}\`);
};

// Class syntax
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  greet() {
    console.log(\`Hello, my name is \${this.name}\`);
  }
}
\`\`\`

### Property Access and Manipulation
\`\`\`javascript
const obj = { a: 1, b: 2 };

// Dot notation
obj.a; // 1

// Bracket notation
obj['b']; // 2

// Dynamic property access
const key = 'a';
obj[key]; // 1

// Property existence
'a' in obj; // true
obj.hasOwnProperty('a'); // true

// Property enumeration
Object.keys(obj); // ['a', 'b']
Object.values(obj); // [1, 2]
Object.entries(obj); // [['a', 1], ['b', 2]]
\`\`\`

### Object Methods
\`\`\`javascript
// Object.assign() - Shallow copy
const target = { a: 1 };
const source = { b: 2 };
Object.assign(target, source); // { a: 1, b: 2 }

// Object.freeze() - Immutable object
const frozen = Object.freeze({ a: 1 });
frozen.a = 2; // Error in strict mode

// Object.seal() - Prevent adding/removing properties
const sealed = Object.seal({ a: 1 });
sealed.b = 2; // Error in strict mode

// Object.defineProperty() - Define property with attributes
Object.defineProperty(obj, 'c', {
  value: 3,
  writable: false,
  enumerable: true,
  configurable: false
});
\`\`\`

## Best Practices

1. **Object Creation**
   - Use object literals for simple objects
   - Use classes for complex objects with methods
   - Consider factory functions for flexible creation
   - Use Object.create() for prototypal inheritance

2. **Property Management**
   - Use meaningful property names
   - Consider using Symbols for private properties
   - Use getters/setters for computed properties
   - Document property types and purposes

3. **Immutability**
   - Use Object.freeze() for constants
   - Implement immutable patterns
   - Use spread operator for shallow copies
   - Consider immutable libraries for complex objects

4. **Performance**
   - Avoid unnecessary object creation
   - Use property access optimization
   - Consider object pooling for frequent creation
   - Use appropriate data structures

## Common Pitfalls

1. **Shallow Copy Issues**
\`\`\`javascript
// Bad
const obj = { a: { b: 1 } };
const copy = { ...obj };
copy.a.b = 2; // Also changes obj.a.b

// Good
const deepCopy = JSON.parse(JSON.stringify(obj));
// Or use a proper deep clone function
\`\`\`

2. **this Binding**
\`\`\`javascript
// Bad
const obj = {
  name: 'John',
  greet: function() {
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 1000);
  }
};

// Good
const obj = {
  name: 'John',
  greet: function() {
    setTimeout(() => {
      console.log(this.name); // 'John'
    }, 1000);
  }
};
\`\`\`

3. **Property Enumeration**
\`\`\`javascript
// Bad
for (const key in obj) {
  console.log(key); // Includes prototype properties
}

// Good
for (const key of Object.keys(obj)) {
  console.log(key); // Only own properties
}
\`\`\`

## Related Topics
- Prototypes
- Classes
- Functions
- Scope and Closures
- this Keyword
- Data Structures

## Additional Resources
- [MDN Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [JavaScript.info Objects](https://javascript.info/object)
- [Object-Oriented JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS)
`
    },
    { 
      name: 'HOFs', 
      subjectName: 'JS',
      difficulty: 'Intermediate',
      prerequisites: ['Functions', 'Closures', 'Arrays'],
      learningObjectives: [
        'Master function composition and higher-order functions',
        'Understand common HOF patterns (map, filter, reduce)',
        'Implement custom higher-order functions',
        'Work with function currying and partial application',
        'Apply functional programming principles'
      ],
      recap: `# Higher Order Functions in JavaScript

## Core Concepts

### What are Higher Order Functions?
Higher Order Functions (HOFs) are functions that either:
1. Take one or more functions as arguments
2. Return a function as their result
3. Both of the above

### Key Components
1. **Function Arguments**
   - Callback functions
   - Function composition
   - Function factories
   - Function decorators

2. **Function Returns**
   - Function generators
   - Curried functions
   - Partial applications
   - Function combinators

3. **Common Patterns**
   - Map/Filter/Reduce
   - Function composition
   - Memoization
   - Throttling/Debouncing

## Working with HOFs

### Basic Examples
\`\`\`javascript
// Function as argument
function applyOperation(x, y, operation) {
  return operation(x, y);
}

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

applyOperation(5, 3, add);      // 8
applyOperation(5, 3, multiply); // 15

// Function as return value
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5); // 10
triple(5); // 15
\`\`\`

### Common HOF Patterns
\`\`\`javascript
// Map
function map(array, transform) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(transform(array[i]));
  }
  return result;
}

// Filter
function filter(array, predicate) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      result.push(array[i]);
    }
  }
  return result;
}

// Reduce
function reduce(array, reducer, initialValue) {
  let accumulator = initialValue;
  for (let i = 0; i < array.length; i++) {
    accumulator = reducer(accumulator, array[i]);
  }
  return accumulator;
}
\`\`\`

### Function Composition
\`\`\`javascript
// Basic composition
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

// Multiple functions
function compose(...functions) {
  return function(x) {
    return functions.reduceRight((value, func) => func(value), x);
  };
}

// Usage
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const composed = compose(square, double, addOne);
composed(2); // ((2 + 1) * 2)² = 36
\`\`\`

### Currying and Partial Application
\`\`\`javascript
// Currying
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// Usage
const add = curry((a, b, c) => a + b + c);

curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6
\`\`\`

## Best Practices

1. **Function Design**
   - Keep functions pure
   - Use meaningful names
   - Document function behavior
   - Handle edge cases
   - Consider performance

2. **Composition**
   - Compose from right to left
   - Keep functions small and focused
   - Use point-free style when appropriate
   - Consider readability
   - Test composed functions

3. **Error Handling**
   - Handle invalid inputs
   - Provide meaningful errors
   - Consider error recovery
   - Use try/catch appropriately
   - Log errors properly

4. **Performance**
   - Avoid unnecessary function creation
   - Use memoization for expensive operations
   - Consider function inlining
   - Profile performance
   - Optimize critical paths

## Common Pitfalls

1. **Callback Hell**
\`\`\`javascript
// Bad
getData(data => {
  processData(data, processed => {
    saveData(processed, saved => {
      // Nested callbacks
    });
  });
});

// Good
getData()
  .then(processData)
  .then(saveData)
  .then(handleSuccess)
  .catch(handleError);
\`\`\`

2. **Memory Leaks**
\`\`\`javascript
// Bad
function createListener() {
  const data = largeData;
  return function() {
    // data is kept in closure
  };
}

// Good
function createListener() {
  const data = largeData;
  return function() {
    // Use data
    data = null; // Clear reference
  };
}
\`\`\`

3. **Incorrect this Binding**
\`\`\`javascript
// Bad
const obj = {
  value: 42,
  getValue: function() {
    return this.value;
  }
};
const getValue = obj.getValue;
getValue(); // undefined

// Good
const obj = {
  value: 42,
  getValue: function() {
    return this.value;
  }
};
const getValue = obj.getValue.bind(obj);
getValue(); // 42
\`\`\`

## Related Topics
- Closures
- Scope
- this Keyword
- Functional Programming
- Callbacks
- Promises
- Async/Await

## Additional Resources
- [MDN Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)
- [JavaScript.info Functions](https://javascript.info/function-basics)
- [Functional Programming in JavaScript](https://eloquentjavascript.net/1st_edition/chapter6.html)
`
    },
    { 
      name: 'Arrow functions', 
      subjectName: 'JS',
      difficulty: 'Fundamental',
      prerequisites: ['Functions', 'this Keyword', 'Scope'],
      learningObjectives: [
        'Understand arrow function syntax and behavior',
        'Master lexical this binding',
        'Work with arrow functions in different contexts',
        'Apply arrow functions appropriately',
        'Avoid common pitfalls'
      ],
      recap: `# Arrow Functions in JavaScript

## Core Concepts

### What are Arrow Functions?
Arrow functions are a concise syntax for writing function expressions in JavaScript. They have a shorter syntax compared to regular functions and do not have their own this, arguments, super, or new.target bindings.

### Key Features
1. **Syntax**
   - Single parameter: \`param => expression\`
   - Multiple parameters: \`(param1, param2) => expression\`
   - Block body: \`(param1, param2) => { statements }\`
   - Return object: \`() => ({ key: value })\`

2. **Lexical this**
   - Inherits this from surrounding scope
   - Cannot be changed with call/apply/bind
   - Useful in callbacks and event handlers

3. **Other Characteristics**
   - No arguments object
   - Cannot be used as constructors
   - No prototype property
   - Cannot be used as generator functions

## Working with Arrow Functions

### Basic Examples
\`\`\`javascript
// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Single parameter
const square = x => x * x;

// No parameters
const getTime = () => new Date();

// Block body
const process = (data) => {
  const result = data.map(x => x * 2);
  return result.filter(x => x > 10);
};

// Return object
const createUser = (name, age) => ({
  name,
  age,
  isAdult: age >= 18
});
\`\`\`

### this Binding
\`\`\`javascript
// Regular function
const obj = {
  value: 42,
  getValue: function() {
    return this.value;
  }
};

// Arrow function
const obj = {
  value: 42,
  getValue: () => this.value // undefined
};

// Correct usage
const obj = {
  value: 42,
  getValue() {
    const helper = () => this.value;
    return helper();
  }
};
\`\`\`

### Event Handlers
\`\`\`javascript
// Regular function
button.addEventListener('click', function() {
  console.log(this); // button element
});

// Arrow function
button.addEventListener('click', () => {
  console.log(this); // window/global
});

// Correct usage
class Button {
  constructor() {
    this.value = 'clicked';
    this.handler = new EventHandler();
    
    // Maintain this binding
    this.handler.on('button', 'click', () => {
      console.log(this.value); // 'clicked'
    });
  }
}
\`\`\`

### Array Methods
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(x => x * 2);

// Filter
const evens = numbers.filter(x => x % 2 === 0);

// Reduce
const sum = numbers.reduce((acc, x) => acc + x, 0);

// Find
const firstEven = numbers.find(x => x % 2 === 0);
\`\`\`

## Best Practices

1. **When to Use**
   - Callback functions
   - Methods that don't need this
   - Short, single-purpose functions
   - Array methods
   - Promise chains

2. **When to Avoid**
   - Object methods
   - Prototype methods
   - Constructors
   - Event handlers that need this
   - Functions that need arguments

3. **Style Guidelines**
   - Use parentheses for multiple parameters
   - Use block body for multiple statements
   - Keep arrow functions short and focused
   - Use meaningful parameter names
   - Consider readability

4. **Performance**
   - Arrow functions are not faster
   - Consider memory usage
   - Avoid unnecessary arrow functions
   - Profile when performance is critical

## Common Pitfalls

1. **this Binding**
\`\`\`javascript
// Bad
const obj = {
  value: 42,
  getValue: () => this.value // undefined
};

// Good
const obj = {
  value: 42,
  getValue() {
    return this.value;
  }
};
\`\`\`

2. **Object Methods**
\`\`\`javascript
// Bad
const person = {
  name: 'John',
  greet: () => \`Hello, \${this.name}\` // undefined
};

// Good
const person = {
  name: 'John',
  greet() {
    return \`Hello, \${this.name}\`;
  }
};
\`\`\`

3. **Event Handlers**
\`\`\`javascript
// Bad
button.addEventListener('click', () => {
  this.classList.add('active'); // undefined
});

// Good
button.addEventListener('click', function() {
  this.classList.add('active');
});
\`\`\`

## Related Topics
- Functions
- this Keyword
- Scope
- Closures
- Callbacks
- Array Methods
- Event Handling

## Additional Resources
- [MDN Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [JavaScript.info Arrow Functions](https://javascript.info/arrow-functions)
- [Arrow Functions vs Regular Functions](https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/)
`
    },
    { 
      name: 'Functions', 
      subjectName: 'JS',
      difficulty: 'Fundamental',
      prerequisites: ['Variables', 'Data Types', 'Scope'],
      learningObjectives: [
        'Master function declaration and expression syntax',
        'Understand function parameters and return values',
        'Work with function scope and closure',
        'Implement various function patterns',
        'Handle function context and this binding'
      ],
      recap: `# Functions in JavaScript

## Core Concepts

### What are Functions?
Functions are reusable blocks of code that perform specific tasks. They can accept input parameters, execute a series of statements, and return a value. Functions are first-class citizens in JavaScript, meaning they can be assigned to variables, passed as arguments, and returned from other functions.

### Key Components
1. **Function Declaration**
   - Named function declaration
   - Function expression
   - Arrow function
   - Generator function
   - Async function

2. **Parameters**
   - Required parameters
   - Optional parameters
   - Default parameters
   - Rest parameters
   - Parameter destructuring

3. **Return Values**
   - Single value return
   - Multiple value return (arrays/objects)
   - Early return
   - Implicit return
   - Promise return

## Working with Functions

### Function Declaration
\`\`\`javascript
// Function Declaration
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Function Expression
const greet = function(name) {
  return \`Hello, \${name}!\`;
};

// Arrow Function
const greet = name => \`Hello, \${name}!\`;

// Generator Function
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

// Async Function
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}
\`\`\`

### Parameters and Arguments
\`\`\`javascript
// Default Parameters
function greet(name = 'Guest') {
  return \`Hello, \${name}!\`;
}

// Rest Parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// Parameter Destructuring
function processUser({ name, age, email }) {
  console.log(\`User \${name} is \${age} years old\`);
}

// Optional Parameters
function createUser(name, age, email?) {
  return {
    name,
    age,
    email: email || 'N/A'
  };
}
\`\`\`

### Return Values
\`\`\`javascript
// Single Value
function square(x) {
  return x * x;
}

// Multiple Values
function divideAndRemainder(a, b) {
  return {
    quotient: Math.floor(a / b),
    remainder: a % b
  };
}

// Early Return
function isEven(num) {
  if (typeof num !== 'number') {
    return false;
  }
  return num % 2 === 0;
}

// Promise Return
async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}
\`\`\`

### Function Context
\`\`\`javascript
// Method Context
const user = {
  name: 'John',
  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
};

// Bound Context
function greet() {
  return \`Hello, I'm \${this.name}\`;
}
const boundGreet = greet.bind(user);

// Call and Apply
greet.call(user);
greet.apply(user, [arg1, arg2]);
\`\`\`

## Best Practices

1. **Function Design**
   - Single Responsibility Principle
   - Pure functions when possible
   - Meaningful function names
   - Consistent return values
   - Proper error handling

2. **Parameter Handling**
   - Validate parameters
   - Use default values
   - Document parameters
   - Limit parameter count
   - Use object parameters for many options

3. **Return Values**
   - Consistent return types
   - Early returns for guards
   - Avoid side effects
   - Document return values
   - Handle edge cases

4. **Performance**
   - Memoize expensive functions
   - Avoid unnecessary computation
   - Optimize recursion
   - Consider function inlining
   - Profile critical functions

## Common Pitfalls

1. **Scope Issues**
\`\`\`javascript
// Bad
var value = 'outer';
function test() {
  console.log(value); // undefined
  var value = 'inner';
}

// Good
let value = 'outer';
function test() {
  console.log(value); // 'outer'
  let innerValue = 'inner';
}
\`\`\`

2. **this Binding**
\`\`\`javascript
// Bad
const obj = {
  value: 42,
  getValue: function() {
    setTimeout(function() {
      console.log(this.value); // undefined
    }, 1000);
  }
};

// Good
const obj = {
  value: 42,
  getValue: function() {
    setTimeout(() => {
      console.log(this.value); // 42
    }, 1000);
  }
};
\`\`\`

3. **Memory Leaks**
\`\`\`javascript
// Bad
function createHandler() {
  const largeData = new Array(1000000);
  return function() {
    // data is kept in closure
  };
}

// Good
function createHandler() {
  const data = new Array(1000000)[0];
  return function() {
    console.log(data);
  };
}
\`\`\`

## Related Topics
- Arrow Functions
- Closures
- this Keyword
- Modules
- Memory Management
- Event Handling
- Currying
- Design Patterns

## Additional Resources
- [MDN Functions Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [JavaScript.info Functions](https://javascript.info/function-basics)
- [Clean Code: Functions](https://github.com/ryanmcdermott/clean-code-javascript#functions)
`
    },
    { 
      name: 'Closures', 
      subjectName: 'JS',
      difficulty: 'Intermediate',
      prerequisites: ['Functions', 'Scope', 'Variables'],
      learningObjectives: [
        'Understand closure formation and lifecycle',
        'Master lexical scope and environment',
        'Work with private variables and data privacy',
        'Implement module patterns',
        'Handle memory management in closures'
      ],
      recap: `# Closures in JavaScript

## Core Concepts

### What are Closures?
A closure is the combination of a function and the lexical environment within which that function was declared. This environment consists of any local variables that were in-scope at the time the closure was created. Closures allow functions to maintain access to variables from their outer scope even after the outer function has returned.

### Key Components
1. **Lexical Scope**
   - Variable lookup rules
   - Scope chain
   - Identifier resolution
   - Block scope
   - Function scope

2. **Environment**
   - Variable environment
   - Scope chain
   - this binding
   - Execution context
   - Memory references

3. **Data Privacy**
   - Private variables
   - Encapsulation
   - Information hiding
   - Module pattern
   - Factory functions

## Working with Closures

### Basic Closure
\`\`\`javascript
function createCounter() {
  let count = 0;
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
\`\`\`

### Data Privacy
\`\`\`javascript
function createUser(name) {
  // Private variables
  let secretKey = 'xyz123';
  let role = 'user';
  
  return {
    getName() {
      return name;
    },
    authenticate(key) {
      return key === secretKey;
    },
    promote(newRole, key) {
      if (this.authenticate(key)) {
        role = newRole;
        return true;
      }
      return false;
    }
  };
}

const user = createUser('John');
console.log(user.getName()); // 'John'
console.log(user.secretKey); // undefined
\`\`\`

### Module Pattern
\`\`\`javascript
const calculator = (function() {
  // Private variables and functions
  let result = 0;
  
  function validate(num) {
    return typeof num === 'number' && !isNaN(num);
  }
  
  // Public API
  return {
    add(num) {
      if (validate(num)) {
        result += num;
      }
      return this;
    },
    subtract(num) {
      if (validate(num)) {
        result -= num;
      }
      return this;
    },
    getResult() {
      return result;
    }
  };
})();

calculator.add(5).subtract(2);
console.log(calculator.getResult()); // 3
\`\`\`

### Event Handlers
\`\`\`javascript
function createButtonHandler(message) {
  let clickCount = 0;
  
  return function() {
    clickCount++;
    console.log(\`\${message} clicked \${clickCount} times\`);
  };
}

const button = document.createElement('button');
button.addEventListener('click', createButtonHandler('Button'));
\`\`\`

### Currying
\`\`\`javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

const add = curry((a, b, c) => a + b + c);
console.log(add(1)(2)(3)); // 6
curriedAdd(1, 2)(3); // 6
\`\`\`

## Best Practices

1. **Memory Management**
   - Clear references when no longer needed
   - Avoid unnecessary closures
   - Use weak references when appropriate
   - Consider garbage collection
   - Monitor memory usage

2. **Scope Design**
   - Minimize closure scope
   - Use block scope effectively
   - Keep closures focused
   - Document closure dependencies
   - Consider performance impact

3. **Data Privacy**
   - Use Symbol for private keys
   - Implement proper access control
   - Document public API
   - Consider WeakMap for privacy
   - Handle security implications

4. **Performance**
   - Optimize closure creation
   - Reuse closures when possible
   - Monitor memory consumption
   - Profile closure performance
   - Consider alternatives

## Common Pitfalls

1. **Memory Leaks**
\`\`\`javascript
// Bad
function createHandlers() {
  let elements = [];
  for (let i = 0; i < 10000; i++) {
    elements.push({
      data: new Array(10000),
      handler: function() {
        // Using the large data array
        console.log(elements[i].data);
      }
    });
  }
  return elements;
}

// Good
function createHandler(data) {
  // Only capture needed data
  const value = data[0];
  return function() {
    console.log(value);
  };
}
\`\`\`

2. **Loop Variables**
\`\`\`javascript
// Bad
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3
  }, 100);
}

// Good
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2
  }, 100);
}
\`\`\`

3. **this Binding**
\`\`\`javascript
// Bad
const obj = {
  value: 42,
  getValue: function() {
    return function() {
      return this.value; // undefined
    };
  }
};

// Good
const obj = {
  value: 42,
  getValue: function() {
    const self = this;
    return function() {
      return self.value; // 42
    };
  }
};
\`\`\`

## Related Topics
- Functions
- Scope
- this Keyword
- Modules
- Memory Management
- Event Handling
- Currying
- Design Patterns

## Additional Resources
- [MDN Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [JavaScript.info Closure](https://javascript.info/closure)
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md)
`
    },
    // Data Structure
    { 
      name: 'Arrays', 
      subjectName: 'Data Structure',
      difficulty: 'Fundamental',
      prerequisites: ['Variables', 'Data Types'],
      learningObjectives: [
        'Understand array fundamentals and operations',
        'Master array manipulation techniques',
        'Work with multi-dimensional arrays',
        'Implement array algorithms',
        'Handle array performance considerations'
      ],
      recap: `# Arrays in Data Structures

## Core Concepts

### What are Arrays?
Arrays are linear data structures that store elements in contiguous memory locations. They provide O(1) access time for elements using indices and are fundamental building blocks for more complex data structures.

### Key Components
1. **Memory Layout**
   - Contiguous memory allocation
   - Fixed size (static arrays)
   - Dynamic resizing (dynamic arrays)
   - Index-based access
   - Memory efficiency

2. **Operations**
   - Access (O(1))
   - Search (O(n))
   - Insertion (O(n))
   - Deletion (O(n))
   - Resizing (O(n))

3. **Types**
   - One-dimensional arrays
   - Multi-dimensional arrays
   - Jagged arrays
   - Dynamic arrays
   - Sparse arrays

## Working with Arrays

### Basic Operations
\`\`\`javascript
// Array Declaration
const arr = [1, 2, 3, 4, 5];

// Access
console.log(arr[0]); // 1

// Insertion
arr.push(6); // End
arr.unshift(0); // Beginning
arr.splice(2, 0, 2.5); // Middle

// Deletion
arr.pop(); // End
arr.shift(); // Beginning
arr.splice(2, 1); // Middle

// Search
const index = arr.indexOf(3);
const exists = arr.includes(3);
\`\`\`

### Multi-dimensional Arrays
\`\`\`javascript
// 2D Array
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Access
console.log(matrix[1][2]); // 6

// Traversal
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(matrix[i][j]);
  }
}
\`\`\`

### Dynamic Arrays
\`\`\`javascript
class DynamicArray {
  constructor() {
    this.capacity = 1;
    this.length = 0;
    this.arr = new Array(this.capacity);
  }

  push(value) {
    if (this.length === this.capacity) {
      this.resize();
    }
    this.arr[this.length] = value;
    this.length++;
  }

  resize() {
    this.capacity *= 2;
    const newArr = new Array(this.capacity);
    for (let i = 0; i < this.length; i++) {
      newArr[i] = this.arr[i];
    }
    this.arr = newArr;
  }
}
\`\`\`

## Best Practices

1. **Memory Management**
   - Pre-allocate when size is known
   - Use appropriate initial capacity
   - Consider memory constraints
   - Handle resizing efficiently
   - Clean up unused arrays

2. **Performance**
   - Minimize resizing operations
   - Use appropriate data structures
   - Consider cache locality
   - Optimize traversal patterns
   - Profile array operations

3. **Error Handling**
   - Check array bounds
   - Handle null/undefined
   - Validate array size
   - Check for empty arrays
   - Handle type mismatches

4. **Usage Patterns**
   - Use for fixed-size data
   - Consider alternatives for dynamic data
   - Use appropriate access patterns
   - Consider memory layout
   - Profile access patterns

## Common Pitfalls

1. **Index Out of Bounds**
\`\`\`javascript
// Bad
const arr = [1, 2, 3];
console.log(arr[5]); // undefined

// Good
const arr = [1, 2, 3];
if (index >= 0 && index < arr.length) {
  console.log(arr[index]);
}
\`\`\`

2. **Memory Leaks**
\`\`\`javascript
// Bad
function processLargeArray() {
  const arr = new Array(1000000);
  // Process array
  // arr is kept in memory
}

// Good
function processLargeArray() {
  const arr = new Array(1000000);
  // Process array
  arr.length = 0; // Clear array
}
\`\`\`

3. **Inefficient Operations**
\`\`\`javascript
// Bad
const arr = [1, 2, 3];
for (let i = 0; i < arr.length; i++) {
  arr.unshift(0); // O(n) operation in loop
}

// Good
const arr = [1, 2, 3];
const newArr = [0, 0, 0, ...arr]; // O(n) operation once
\`\`\`

## Related Topics
- Linked Lists
- Stacks
- Queues
- Hash Tables
- Dynamic Programming
- Sorting Algorithms
- Searching Algorithms

## Additional Resources
- [GeeksforGeeks Arrays](https://www.geeksforgeeks.org/array-data-structure/)
- [Array Data Structure](https://en.wikipedia.org/wiki/Array_data_structure)
- [Arrays in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
`
    },
    { 
      name: 'Key-Value Pairs', 
      subjectName: 'Data Structure',
      difficulty: 'Intermediate',
      prerequisites: ['Arrays', 'Hash Functions'],
      learningObjectives: [
        'Understand key-value pair fundamentals',
        'Master hash table implementation',
        'Work with different key-value structures',
        'Handle collisions and resizing',
        'Implement efficient lookups'
      ],
      recap: `# Key-Value Pairs in Data Structures

## Core Concepts

### What are Key-Value Pairs?
Key-Value pairs are fundamental data structures that map unique keys to values. They provide efficient O(1) average-case lookup, insertion, and deletion operations when implemented properly.

### Key Components
1. **Hash Functions**
   - Uniform distribution
   - Deterministic output
   - Fast computation
   - Minimal collisions
   - Consistent hashing

2. **Collision Handling**
   - Separate chaining
   - Open addressing
   - Linear probing
   - Quadratic probing
   - Double hashing

3. **Implementation Types**
   - Hash tables
   - Hash maps
   - Dictionary
   - Associative arrays
   - Symbol tables

## Working with Key-Value Pairs

### Basic Implementation
\`\`\`javascript
class HashTable {
  constructor(size = 53) {
    this.size = size;
    this.keys = new Array(size);
    this.values = new Array(size);
  }

  hash(key) {
    let total = 0;
    const PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i];
      const value = char.charCodeAt(0) - 96;
      total = (total * PRIME + value) % this.size;
    }
    return total;
  }

  set(key, value) {
    let index = this.hash(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        this.values[index] = value;
        return;
      }
      index = (index + 1) % this.size;
    }
    this.keys[index] = key;
    this.values[index] = value;
  }

  get(key) {
    let index = this.hash(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        return this.values[index];
      }
      index = (index + 1) % this.size;
    }
    return undefined;
  }
}
\`\`\`

### Collision Handling
\`\`\`javascript
// Separate Chaining
class HashTable {
  constructor(size = 53) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
  }

  hash(key) {
    // Hash function implementation
  }

  set(key, value) {
    const index = this.hash(key);
    const bucket = this.table[index];
    const existing = bucket.find(item => item[0] === key);
    if (existing) {
      existing[1] = value;
    } else {
      bucket.push([key, value]);
    }
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.table[index];
    const item = bucket.find(item => item[0] === key);
    return item ? item[1] : undefined;
  }
}
\`\`\`

### Dynamic Resizing
\`\`\`javascript
class DynamicHashTable {
  constructor(initialSize = 53) {
    this.size = initialSize;
    this.count = 0;
    this.table = new Array(this.size).fill(null).map(() => []);
  }

  resize(newSize) {
    const oldTable = this.table;
    this.size = newSize;
    this.table = new Array(this.size).fill(null).map(() => []);
    this.count = 0;

    for (const bucket of oldTable) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  set(key, value) {
    const loadFactor = this.count / this.size;
    if (loadFactor > 0.7) {
      this.resize(this.size * 2);
    }
    // Rest of set implementation
  }
}
\`\`\`

## Best Practices

1. **Hash Function Design**
   - Use prime numbers
   - Consider key distribution
   - Handle different key types
   - Optimize for speed
   - Minimize collisions

2. **Collision Management**
   - Choose appropriate strategy
   - Monitor load factor
   - Implement resizing
   - Handle edge cases
   - Profile performance

3. **Memory Management**
   - Pre-allocate when possible
   - Implement proper cleanup
   - Handle resizing efficiently
   - Consider memory constraints
   - Monitor memory usage

4. **Performance**
   - Optimize hash function
   - Minimize collisions
   - Use appropriate load factor
   - Consider cache effects
   - Profile operations

## Common Pitfalls

1. **Poor Hash Function**
\`\`\`javascript
// Bad
function hash(key) {
  return key.length; // Many collisions
}

// Good
function hash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % size;
  }
  return hash;
}
\`\`\`

2. **Infinite Loop in Probing**
\`\`\`javascript
// Bad
function findSlot(key) {
  let index = hash(key);
  while (table[index] !== undefined) {
    index = (index + 1) % size;
    // No check for full table
  }
  return index;
}

// Good
function findSlot(key) {
  let index = hash(key);
  let start = index;
  while (table[index] !== undefined) {
    index = (index + 1) % size;
    if (index === start) {
      throw new Error('Table is full');
    }
  }
  return index;
}
\`\`\`

3. **Memory Leaks**
\`\`\`javascript
// Bad
class HashTable {
  delete(key) {
    const index = findSlot(key);
    table[index] = undefined; // Memory not freed
  }
}

// Good
class HashTable {
  delete(key) {
    const index = findSlot(key);
    table[index] = null; // Mark as deleted
    // Consider compaction
  }
}
\`\`\`

## Related Topics
- Hash Functions
- Arrays
- Linked Lists
- Binary Search Trees
- Memory Management
- Cache Optimization
- Load Balancing

## Additional Resources
- [Hash Table](https://en.wikipedia.org/wiki/Hash_table)
- [Hash Functions](https://en.wikipedia.org/wiki/Hash_function)
- [Collision Resolution](https://en.wikipedia.org/wiki/Hash_table#Collision_resolution)
`
    },
    { 
      name: 'Linked List', 
      subjectName: 'Data Structure',
      difficulty: 'Intermediate',
      prerequisites: ['Pointers', 'Memory Management'],
      learningObjectives: [
        'Understand linked list fundamentals',
        'Master different linked list types',
        'Work with node manipulation',
        'Implement efficient operations',
        'Handle memory management'
      ],
      recap: `# Linked Lists in Data Structures

## Core Concepts

### What are Linked Lists?
Linked lists are linear data structures where elements are stored in nodes, and each node points to the next node in the sequence. They provide dynamic memory allocation and efficient insertions/deletions.

### Key Components
1. **Node Structure**
   - Data field
   - Next pointer
   - Previous pointer (in doubly linked lists)
   - Memory allocation
   - Node management

2. **Types of Linked Lists**
   - Singly linked lists
   - Doubly linked lists
   - Circular linked lists
   - Skip lists
   - XOR linked lists

3. **Operations**
   - Insertion (O(1))
   - Deletion (O(1))
   - Search (O(n))
   - Traversal (O(n))
   - Reversal (O(n))

## Working with Linked Lists

### Singly Linked List
\`\`\`javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
    return this;
  }

  pop() {
    if (!this.head) return undefined;
    let current = this.head;
    let newTail = current;
    while (current.next) {
      newTail = current;
      current = current.next;
    }
    this.tail = newTail;
    this.tail.next = null;
    this.length--;
    if (this.length === 0) {
      this.head = null;
      this.tail = null;
    }
    return current;
  }
}
\`\`\`

### Doubly Linked List
\`\`\`javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.length++;
    return this;
  }

  pop() {
    if (!this.head) return undefined;
    const poppedNode = this.tail;
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = poppedNode.prev;
      this.tail.next = null;
      poppedNode.prev = null;
    }
    this.length--;
    return poppedNode;
  }
}
\`\`\`

### Circular Linked List
\`\`\`javascript
class CircularLinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  push(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      newNode.next = this.head;
    } else {
      let current = this.head;
      while (current.next !== this.head) {
        current = current.next;
      }
      current.next = newNode;
      newNode.next = this.head;
    }
    this.length++;
    return this;
  }

  find(value) {
    if (!this.head) return null;
    let current = this.head;
    do {
      if (current.value === value) return current;
      current = current.next;
    } while (current !== this.head);
    return null;
  }
}
\`\`\`

## Best Practices

1. **Memory Management**
   - Proper node allocation
   - Clean node deletion
   - Handle null pointers
   - Manage circular references
   - Consider garbage collection

2. **Error Handling**
   - Check for empty lists
   - Validate node existence
   - Handle edge cases
   - Manage pointer integrity
   - Prevent memory leaks

3. **Performance**
   - Optimize traversal
   - Minimize pointer updates
   - Consider cache effects
   - Profile operations
   - Use appropriate types

4. **Implementation**
   - Choose appropriate type
   - Maintain consistency
   - Document operations
   - Test thoroughly
   - Consider extensions

## Common Pitfalls

1. **Null Pointer Access**
\`\`\`javascript
// Bad
function getNthNode(head, n) {
  let current = head;
  for (let i = 0; i < n; i++) {
    current = current.next; // May be null
  }
  return current;
}

// Good
function getNthNode(head, n) {
  let current = head;
  let count = 0;
  while (current !== null && count < n) {
    current = current.next;
    count++;
  }
  return current;
}
\`\`\`

2. **Memory Leaks**
\`\`\`javascript
// Bad
function deleteNode(head, value) {
  let current = head;
  while (current.next !== null) {
    if (current.next.value === value) {
      current.next = current.next.next;
      // Node not properly freed
    }
    current = current.next;
  }
}

// Good
function deleteNode(head, value) {
  let current = head;
  while (current.next !== null) {
    if (current.next.value === value) {
      const toDelete = current.next;
      current.next = current.next.next;
      toDelete.next = null; // Clear reference
    }
    current = current.next;
  }
}
\`\`\`

3. **Circular References**
\`\`\`javascript
// Bad
function detectCycle(head) {
  let current = head;
  while (current !== null) {
    // May infinite loop
    current = current.next;
  }
  return false;
}

// Good
function detectCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
\`\`\`

## Related Topics
- Pointers
- Memory Management
- Recursion
- Stacks
- Queues
- Trees
- Graphs

## Additional Resources
- [Linked List](https://en.wikipedia.org/wiki/Linked_list)
- [Data Structures: Linked Lists](https://www.geeksforgeeks.org/data-structures/linked-list/)
- [Linked List Implementation](https://www.geeksforgeeks.org/implementation-linkedlist-javascript/)
`
    },
    { 
      name: 'Sorting', 
      subjectName: 'Algorithms',
      difficulty: 'Intermediate',
      prerequisites: ['Arrays', 'Recursion'],
      learningObjectives: [
        'Understand sorting fundamentals',
        'Master different sorting algorithms',
        'Analyze time and space complexity',
        'Implement efficient sorting',
        'Handle edge cases'
      ],
      recap: `# Sorting Algorithms

## Core Concepts

### What are Sorting Algorithms?
Sorting algorithms are methods for arranging elements in a specific order (ascending or descending). They are fundamental to computer science and have various applications in data processing and analysis.

### Key Components
1. **Time Complexity**
   - Best case
   - Average case
   - Worst case
   - Space complexity
   - Stability

2. **Algorithm Types**
   - Comparison-based
   - Non-comparison-based
   - In-place
   - Stable
   - Adaptive

3. **Common Algorithms**
   - Bubble Sort
   - Selection Sort
   - Insertion Sort
   - Merge Sort
   - Quick Sort
   - Heap Sort
   - Counting Sort
   - Radix Sort

## Working with Sorting Algorithms

### Quick Sort
\`\`\`javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}
\`\`\`

### Merge Sort
\`\`\`javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
\`\`\`

### Heap Sort
\`\`\`javascript
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
\`\`\`

## Best Practices

1. **Algorithm Selection**
   - Consider data size
   - Analyze time complexity
   - Consider space constraints
   - Check stability requirements
   - Profile performance

2. **Implementation**
   - Handle edge cases
   - Optimize for specific data
   - Use appropriate data structures
   - Consider memory usage
   - Test thoroughly

3. **Performance**
   - Minimize comparisons
   - Reduce swaps
   - Use efficient partitioning
   - Consider cache effects
   - Profile critical paths

4. **Error Handling**
   - Validate input
   - Handle empty arrays
   - Manage memory
   - Check bounds
   - Handle duplicates

## Common Pitfalls

1. **Infinite Recursion**
\`\`\`javascript
// Bad
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.filter(x => x < pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
  // May cause stack overflow
}

// Good
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}
\`\`\`

2. **Memory Usage**
\`\`\`javascript
// Bad
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
  // Creates many temporary arrays
}

// Good
function mergeSort(arr, temp = new Array(arr.length), left = 0, right = arr.length - 1) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, temp, left, mid);
    mergeSort(arr, temp, mid + 1, right);
    merge(arr, temp, left, mid, right);
  }
  return arr;
}
\`\`\`

3. **Stability Issues**
\`\`\`javascript
// Bad
function sortByAge(people) {
  return people.sort((a, b) => a.age - b.age);
  // May not preserve original order
}

// Good
function stableSortByAge(people) {
  return people
    .map((person, index) => ({ person, index }))
    .sort((a, b) => {
      const ageDiff = a.person.age - b.person.age;
      return ageDiff === 0 ? a.index - b.index : ageDiff;
    })
    .map(({ person }) => person);
}
\`\`\`

## Related Topics
- Arrays
- Recursion
- Divide and Conquer
- Time Complexity
- Space Complexity
- Stability
- In-place Sorting

## Additional Resources
- [Sorting Algorithms](https://en.wikipedia.org/wiki/Sorting_algorithm)
- [Comparison of Sorting Algorithms](https://www.geeksforgeeks.org/comparison-among-bubble-sort-selection-sort-and-insertion-sort/)
- [Sorting Algorithm Animations](https://www.toptal.com/developers/sorting-algorithms)
`
    },
    { 
      name: 'Searching', 
      subjectName: 'Algorithms',
      difficulty: 'Intermediate',
      prerequisites: ['Arrays', 'Sorting'],
      learningObjectives: [
        'Understand searching fundamentals',
        'Master different search algorithms',
        'Analyze time and space complexity',
        'Implement efficient searching',
        'Handle edge cases'
      ],
      recap: `# Searching Algorithms

## Core Concepts

### What are Searching Algorithms?
Searching algorithms are methods for finding specific elements within a data structure. They are essential for data retrieval and have various applications in computer science.

### Key Components
1. **Time Complexity**
   - Best case
   - Average case
   - Worst case
   - Space complexity
   - Input characteristics

2. **Algorithm Types**
   - Linear search
   - Binary search
   - Interpolation search
   - Jump search
   - Exponential search
   - Ternary search

3. **Data Requirements**
   - Sorted data
   - Unsorted data
   - Random access
   - Sequential access
   - Key-value pairs

## Working with Searching Algorithms

### Binary Search
\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}

// Recursive version
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}
\`\`\`

### Interpolation Search
\`\`\`javascript
function interpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right && target >= arr[left] && target <= arr[right]) {
    const pos = left + Math.floor(
      ((target - arr[left]) * (right - left)) / (arr[right] - arr[left])
    );
    
    if (arr[pos] === target) {
      return pos;
    } else if (arr[pos] < target) {
      left = pos + 1;
    } else {
      right = pos - 1;
    }
  }
  
  return -1;
}
\`\`\`

### Jump Search
\`\`\`javascript
function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  
  if (arr[prev] === target) return prev;
  return -1;
}
\`\`\`

## Best Practices

1. **Algorithm Selection**
   - Consider data characteristics
   - Analyze time complexity
   - Check data organization
   - Consider memory usage
   - Profile performance

2. **Implementation**
   - Handle edge cases
   - Validate input
   - Use appropriate data structures
   - Consider cache effects
   - Test thoroughly

3. **Performance**
   - Minimize comparisons
   - Optimize for specific data
   - Use efficient indexing
   - Consider data distribution
   - Profile critical paths

4. **Error Handling**
   - Check array bounds
   - Handle empty arrays
   - Validate target value
   - Manage memory
   - Handle duplicates

## Common Pitfalls

1. **Integer Overflow**
\`\`\`javascript
// Bad
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = (left + right) / 2; // May cause overflow
    // ...
  }
}

// Good
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    // ...
  }
}
\`\`\`

2. **Infinite Loop**
\`\`\`javascript
// Bad
function linearSearch(arr, target) {
  let i = 0;
  while (arr[i] !== target) { // May infinite loop
    i++;
  }
  return i;
}

// Good
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
\`\`\`

3. **Unsorted Data**
\`\`\`javascript
// Bad
function binarySearch(arr, target) {
  // Assumes sorted array
  let left = 0;
  let right = arr.length - 1;
  // ...
}

// Good
function binarySearch(arr, target) {
  if (!isSorted(arr)) {
    throw new Error('Array must be sorted');
  }
  let left = 0;
  let right = arr.length - 1;
  // ...
}
\`\`\`

## Related Topics
- Arrays
- Sorting
- Time Complexity
- Space Complexity
- Data Structures
- Indexing
- Hashing

## Additional Resources
- [Searching Algorithms](https://en.wikipedia.org/wiki/Search_algorithm)
- [Binary Search](https://www.geeksforgeeks.org/binary-search/)
- [Search Algorithm Comparison](https://www.geeksforgeeks.org/searching-algorithms/)
`
    },
    { 
      name: 'Recursive algos', 
      subjectName: 'Algorithms',
      difficulty: 'Intermediate',
      prerequisites: ['Functions', 'Stack'],
      learningObjectives: [
        'Understand recursion fundamentals',
        'Master recursive problem solving',
        'Analyze time and space complexity',
        'Implement efficient recursion',
        'Handle edge cases'
      ],
      recap: `# Recursive Algorithms

## Core Concepts

### What are Recursive Algorithms?
Recursive algorithms solve problems by breaking them down into smaller subproblems of the same type. They use function calls to themselves to solve these subproblems, eventually reaching a base case that can be solved directly.

### Key Components
1. **Recursion Elements**
   - Base case
   - Recursive case
   - Call stack
   - Stack frames
   - Memory management

2. **Types of Recursion**
   - Direct recursion
   - Indirect recursion
   - Tail recursion
   - Tree recursion
   - Mutual recursion

3. **Common Patterns**
   - Divide and conquer
   - Backtracking
   - Dynamic programming
   - Tree traversal
   - Graph traversal

## Working with Recursive Algorithms

### Factorial
\`\`\`javascript
function factorial(n) {
  // Base case
  if (n === 0 || n === 1) {
    return 1;
  }
  // Recursive case
  return n * factorial(n - 1);
}

// Tail recursive version
function factorialTail(n, acc = 1) {
  if (n === 0 || n === 1) {
    return acc;
  }
  return factorialTail(n - 1, n * acc);
}
\`\`\`

### Fibonacci
\`\`\`javascript
function fibonacci(n) {
  // Base cases
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  // Recursive case
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memoized version
function fibonacciMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n === 0) return 0;
  if (n === 1) return 1;
  
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}
\`\`\`

### Tree Traversal
\`\`\`javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    traverse(node.left);
    result.push(node.value);
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}

function preorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    result.push(node.value);
    traverse(node.left);
    traverse(node.right);
  }
  
  traverse(root);
  return result;
}
\`\`\`

## Best Practices

1. **Base Case Design**
   - Identify stopping conditions
   - Handle edge cases
   - Ensure termination
   - Validate input
   - Test thoroughly

2. **Recursive Case**
   - Break down problems
   - Maintain invariants
   - Reduce problem size
   - Handle state
   - Consider optimization

3. **Memory Management**
   - Monitor stack depth
   - Use tail recursion
   - Implement memoization
   - Consider iteration
   - Profile memory usage

4. **Performance**
   - Analyze time complexity
   - Consider space complexity
   - Use appropriate patterns
   - Optimize critical paths
   - Profile execution

## Common Pitfalls

1. **Stack Overflow**
\`\`\`javascript
// Bad
function recursiveFunction(n) {
  if (n === 0) return 0;
  return recursiveFunction(n - 1) + n;
  // May cause stack overflow for large n
}

// Good
function recursiveFunction(n, acc = 0) {
  if (n === 0) return acc;
  return recursiveFunction(n - 1, acc + n);
  // Tail recursive version
}
\`\`\`

2. **Infinite Recursion**
\`\`\`javascript
// Bad
function countdown(n) {
  console.log(n);
  countdown(n - 1); // No base case
}

// Good
function countdown(n) {
  if (n <= 0) return; // Base case
  console.log(n);
  countdown(n - 1);
}
\`\`\`

3. **Redundant Computation**
\`\`\`javascript
// Bad
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
  // Recomputes values
}

// Good
function fibonacciMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}
\`\`\`

## Related Topics
- Functions
- Stack
- Memory Management
- Time Complexity
- Space Complexity
- Dynamic Programming
- Tree Traversal

## Additional Resources
- [Recursion](https://en.wikipedia.org/wiki/Recursion_(computer_science))
- [Recursive Algorithms](https://www.geeksforgeeks.org/recursion/)
- [Tail Recursion](https://www.geeksforgeeks.org/tail-recursion/)
`
    },
    { 
      name: 'useEffect', 
      subjectName: 'React',
      difficulty: 'Intermediate',
      prerequisites: ['Components', 'State Management'],
      learningObjectives: [
        'Understand useEffect lifecycle and dependencies',
        'Master side effects in function components',
        'Work with cleanup functions',
        'Implement data fetching and subscriptions',
        'Handle loading states and errors'
      ],
      recap: `# useEffect in React

## Core Concepts

### What is useEffect?
useEffect is a React hook used to perform side effects in function components. It allows you to run code after the component renders, cleans up resources, subscribes to events, or performs data fetching.

### Key Components
1. **Dependencies**
   - Array of dependencies
   - Empty array (runs once on mount)
   - No dependencies (runs on every render)
   - Specific dependencies

2. **Cleanup Function**
   - Return function from useEffect
   - Clean up resources
   - Unsubscribe from events
   - Cancel data fetching

## Working with useEffect

### Basic Usage
\`\`\`javascript
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code
  };
}, []);
\`\`\`

### Dependencies
\`\`\`javascript
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code
  };
}, [dependency1, dependency2]);
\`\`\`

### Cleanup Function
\`\`\`javascript
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code
  };
}, [dependency]);
\`\`\`

### Data Fetching
\`\`\`javascript
useEffect(() => {
  fetchData();
  return () => {
    cleanup();
  };
}, []);
\`\`\`

### Subscription Management
\`\`\`javascript
useEffect(() => {
  const subscription = subscribe();
  return () => {
    subscription.unsubscribe();
  };
}, []);
\`\`\`

### Loading State
\`\`\`javascript
useEffect(() => {
  setLoading(true);
  fetchData()
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(error => {
      setError(error);
      setLoading(false);
    });
}, []);
\`\`\`

### Error Handling
\`\`\`javascript
useEffect(() => {
  fetchData()
    .then(data => {
      setData(data);
    })
    .catch(error => {
      setError(error);
    });
}, []);
\`\`\`

## Best Practices

1. **Dependency Management**
   - Use empty array for one-time effect
   - Use specific dependencies for controlled updates
   - Avoid unnecessary dependencies
   - Document dependencies

2. **Cleanup Function**
   - Return a cleanup function
   - Use it to clean up resources
   - Handle side effects properly
   - Test cleanup logic

3. **Data Fetching**
   - Use async/await for cleaner code
   - Handle loading states
   - Implement error handling
   - Clean up resources

4. **Subscription Management**
   - Use cleanup function to unsubscribe
   - Handle dependencies properly
   - Test subscription lifecycle

## Common Pitfalls

1. **Memory Leaks**
\`\`\`javascript
// Bad
function createListener() {
  const data = largeData;
  return function() {
    // data is kept in closure
  };
}

// Good
function createListener() {
  const data = largeData;
  return function() {
    // Use data
    data = null; // Clear reference
  };
}
\`\`\`

2. **Incorrect Cleanup**
\`\`\`javascript
// Bad
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code
  };
}, [dependency]);

// Good
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code
  };
}, [dependency]);
\`\`\`

3. **Data Fetching Issues**
\`\`\`javascript
// Bad
useEffect(() => {
  fetchData();
  return () => {
    cleanup();
  };
}, []);

// Good
useEffect(() => {
  fetchData()
    .then(data => {
      setData(data);
    })
    .catch(error => {
      setError(error);
    });
}, []);
\`\`\`

## Related Topics
- Side Effects
- Cleanup Functions
- Data Fetching
- Subscriptions
- Loading States
- Error Handling

## Additional Resources
- [React Docs: useEffect](https://reactjs.org/docs/hooks-effect.html)
- [useEffect Hook](https://www.freecodecamp.org/news/react-useeffect-hook/)
- [useEffect vs ComponentDidMount](https://stackoverflow.com/questions/53255498/useeffect-vs-componentdidmount-in-react)
`
    },
    { 
      name: 'useState', 
      subjectName: 'React',
      difficulty: 'Intermediate',
      prerequisites: ['Components', 'State Management'],
      learningObjectives: [
        'Understand useState lifecycle and state updates',
        'Master state management in function components',
        'Work with state hooks',
        'Implement state transitions',
        'Handle state dependencies'
      ],
      recap: `# useState in React

## Core Concepts

### What is useState?
useState is a React hook used to add state to function components. It returns an array with two elements: the current state value and a function to update it.

### Key Components
1. **State Value**
   - Initial state
   - Updated state
   - Multiple state variables
   - State objects

2. **State Update**
   - Functional update
   - Immediate update
   - Batch updates
   - State dependencies

## Working with useState

### Basic Usage
\`\`\`javascript
const [state, setState] = useState(initialState);
\`\`\`

### State Update
\`\`\`javascript
setState(newState);
\`\`\`

### Functional Update
\`\`\`javascript
setState(prevState => prevState + 1);
\`\`\`

### State Dependencies
\`\`\`javascript
const [state, setState] = useState(initialState);
const [dependency, setDependency] = useState(initialDependency);
\`\`\`

### State Objects
\`\`\`javascript
const [state, setState] = useState({ key: 'value' });
\`\`\`

### Batch Updates
\`\`\`javascript
setState(prevState => ({ ...prevState, key: 'new value' }));
\`\`\`

## Best Practices

1. **State Management**
   - Use state hooks consistently
   - Keep state logic in the component
   - Use functional updates
   - Handle state dependencies

2. **State Updates**
   - Use setState for immediate updates
   - Use functional updates for derived state
   - Handle state dependencies
   - Test state transitions

3. **State Initialization**
   - Use initial state for simple components
   - Use state objects for complex components
   - Use state arrays for multiple state variables
   - Test state initialization

4. **State Dependencies**
   - Use state dependencies for controlled updates
   - Avoid unnecessary dependencies
   - Document state dependencies
   - Test state dependencies

## Common Pitfalls

1. **State Mutation**
\`\`\`javascript
// Bad
const [state, setState] = useState({ key: 'value' });
setState({ key: 'new value' }); // This mutates the state

// Good
const [state, setState] = useState({ key: 'value' });
setState(prevState => ({ ...prevState, key: 'new value' }));
\`\`\`

2. **State Dependencies**
\`\`\`javascript
// Bad
const [state, setState] = useState(initialState);
const [dependency, setDependency] = useState(initialDependency);

// Good
const [state, setState] = useState(initialState);
const [dependency, setDependency] = useState(initialDependency);
\`\`\`

3. **State Initialization**
\`\`\`javascript
// Bad
const [state, setState] = useState(initialState);

// Good
const [state, setState] = useState(initialState);
\`\`\`

4. **State Updates**
\`\`\`javascript
// Bad
const [state, setState] = useState(initialState);
setState(newState); // This may not trigger a re-render

// Good
const [state, setState] = useState(initialState);
setState(prevState => ({ ...prevState, key: 'new value' }));
\`\`\`

## Related Topics
- State Management
- Functional Programming
- React Hooks
- Component Lifecycle
- State Transitions

## Additional Resources
- [React Docs: useState](https://reactjs.org/docs/hooks-state.html)
- [useState Hook](https://www.freecodecamp.org/news/react-usestate-hook/)
- [useState vs Class State](https://stackoverflow.com/questions/53255498/usestate-vs-class-state-in-react)
`
    },
    { 
      name: 'contextAPI', 
      subjectName: 'React',
      difficulty: 'Intermediate',
      prerequisites: ['Components', 'State Management'],
      learningObjectives: [
        'Understand context API fundamentals',
        'Master provider and consumer patterns',
        'Work with context hooks',
        'Implement theme and authentication contexts',
        'Handle context dependencies'
      ],
      recap: `# Context API in React

## Core Concepts

### What is Context API?
The Context API is a way to share values between components without explicitly passing props through every level of the component tree.

### Key Components
1. **Context Provider**
   - Provides context values
   - Wraps components
   - Manages state
   - Handles updates

2. **Context Consumer**
   - Consumes context values
   - Uses context values
   - Updates based on context
   - Handles changes

3. **Context Hook**
   - Uses context values
   - Updates based on context
   - Handles changes
   - Manages state

### Authentication Context
\`\`\`javascript
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = () => {
    // Login logic
    setUser({ name: 'John' });
  };
  const logout = () => {
    // Logout logic
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

function AuthConsumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      {user ? \`Logged in as \${user.name}\` : 'Not logged in'}
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
\`\`\`

### Language Switcher
\`\`\`javascript
const LanguageContext = React.createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}

function LanguageConsumer() {
  const { language, changeLanguage } = useLanguage();
  return (
    <div>
      Current language: {language}
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Spanish</button>
    </div>
  );
}
\`\`\`

## Best Practices

1. **Context Provider**
   - Provide context values consistently
   - Use context for theme, authentication, and other global data
   - Avoid context pollution
   - Use context sparingly

2. **Context Consumer**
   - Consume context values correctly
   - Use useContext hook
   - Avoid unnecessary re-renders
   - Test context consumption

3. **Context Hook**
   - Use context hook for theme, authentication, and other global data
   - Create context objects
   - Provide context values
   - Test context creation

4. **Context Dependencies**
   - Use context for theme, authentication, and other global data
   - Handle dependencies properly
   - Test context dependencies

## Common Pitfalls

1. **Context Overuse**
\`\`\`javascript
// Bad
const ThemeContext = React.createContext();
const LanguageContext = React.createContext();

function ThemeProvider({ children }) {
  const theme = { color: 'blue' };
  return (
    <ThemeContext.Provider value={theme}>
      <LanguageContext.Provider value={{ language: 'en' }}>
        {children}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

function ThemeConsumer() {
  const theme = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  return (
    <div>
      {theme.color} - {language}
    </div>
  );
}
\`\`\`

2. **Context Inconsistency**
\`\`\`javascript
// Bad
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const theme = { color: 'blue' };
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeConsumer() {
  const theme = useContext(ThemeContext);
  return <div>{theme.color}</div>;
}

// ThemeProvider value changes
function ThemeProvider({ children }) {
  const theme = { color: 'green' };
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// ThemeConsumer re-renders
function ThemeConsumer() {
  const theme = useContext(ThemeContext);
  return <div>{theme.color}</div>;
}
\`\`\`

3. **Context Dependency Issues**
\`\`\`javascript
// Bad
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const theme = { color: 'blue' };
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeConsumer() {
  const theme = useContext(ThemeContext);
  return <div>{theme.color}</div>;
}

// ThemeProvider value changes
function ThemeProvider({ children }) {
  const theme = { color: 'green' };
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// ThemeConsumer re-renders
function ThemeConsumer() {
  const theme = useContext(ThemeContext);
  return <div>{theme.color}</div>;
}
\`\`\`

## Related Topics
- Context API
- React Hooks
- State Management
- Global Data
- Theme Provider
- Authentication Context
- Language Switcher

## Additional Resources
- [React Docs: Context API](https://reactjs.org/docs/context.html)
- [Context API in React](https://www.freecodecamp.org/news/react-context-api-why-it-was-born-and-how-to-use-it/)
- [Context API vs Redux](https://stackoverflow.com/questions/53255498/context-api-vs-redux)
`
    },
    { 
      name: 'Routing', 
      subjectName: 'React',
      difficulty: 'Intermediate',
      prerequisites: ['Components', 'State Management'],
      learningObjectives: [
        'Understand routing fundamentals',
        'Master different routing libraries',
        'Work with route parameters and query strings',
        'Implement nested routes and guards',
        'Handle navigation and loading states'
      ],
      recap: `# Routing in React

## Core Concepts

### What is Routing?
Routing is the process of navigating between different components or views in an application. React Router is a popular library for handling routing in React applications.

### Key Components
1. **Route Components**
   - Route
   - Routes
   - Link
   - NavLink
   - Navigate
   - Outlet

2. **Route Parameters**
   - URL parameters
   - Query parameters
   - Optional parameters
   - Nested routes

3. **Route Guards**
   - Authentication check
   - Route guards
   - Nested routes
   - Route guards

## Working with Routing

### Basic Usage
\`\`\`javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Nested Routes
\`\`\`javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import UserProfile from './UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Route Parameters
\`\`\`javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import UserProfile from './UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Query Parameters
\`\`\`javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import UserProfile from './UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Route Guards
\`\`\`javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import UserProfile from './UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Best Practices

1. **Route Configuration**
   - Use Route components
   - Use Routes component
   - Use Link and NavLink for navigation
   - Use Navigate for conditional navigation
   - Use Outlet for nested routes

2. **Route Parameters**
   - Use URL parameters for dynamic data
   - Use query parameters for filtering and searching
   - Use optional parameters for optional data
   - Use nested routes for complex structures

3. **Route Guards**
   - Implement authentication checks
   - Use route guards for protected routes
   - Use nested routes for nested structures
   - Test route guards thoroughly

4. **Navigation**
   - Use Link and NavLink for navigation
   - Use Navigate for conditional navigation
   - Use Outlet for nested routes
   - Test navigation thoroughly

## Common Pitfalls

1. **Route Configuration**
\`\`\`javascript
// Bad
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import UserProfile from './UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

2. **Route Parameters**
\`\`\`javascript
// Bad
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import UserProfile from './UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

3. **Route Guards**
\`\`\`javascript
// Bad
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import UserProfile from './UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

4. **Navigation**
\`\`\`javascript
// Bad
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import UserProfile from './UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Related Topics
- React Router
- React Hooks
- State Management
- Navigation
- Route Parameters
- Query Parameters
- Route Guards

## Additional Resources
- [React Router Documentation](https://reactrouter.com/)
- [React Router Tutorial](https://www.freecodecamp.org/news/react-router-tutorial/)
- [React Router vs Next.js](https://stackoverflow.com/questions/53255498/react-router-vs-next-js)
`
    },
    { 
      name: 'SQL', 
      subjectName: 'DB',
      difficulty: 'Intermediate',
      prerequisites: ['Database Basics', 'SQL Fundamentals'],
      learningObjectives: [
        'Understand SQL fundamentals',
        'Master SQL queries',
        'Work with different SQL clauses',
        'Implement advanced SQL features',
        'Handle database performance'
      ],
      recap: `# SQL in Database Management

## Core Concepts

### What is SQL?
SQL (Structured Query Language) is a standard language for managing relational databases. It allows you to interact with databases using queries.

### Key Components
1. **Data Definition Language (DDL)**
   - CREATE, ALTER, DROP
   - Create, modify, and delete database objects

2. **Data Manipulation Language (DML)**
   - INSERT, UPDATE, DELETE
   - Insert, update, and delete data

3. **Data Query Language (DQL)**
   - SELECT
   - Query data from the database

4. **Data Control Language (DCL)**
   - GRANT, REVOKE
   - Manage database permissions

## Working with SQL

### Basic Queries
\`\`\`sql
SELECT * FROM users;
\`\`\`

### Data Manipulation
\`\`\`sql
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
UPDATE users SET email = 'john@example.com' WHERE id = 1;
DELETE FROM users WHERE id = 1;
\`\`\`

### Advanced Features
\`\`\`sql
SELECT * FROM users WHERE age > 30;
\`\`\`

### Joins
\`\`\`sql
SELECT * FROM users JOIN orders ON users.id = orders.user_id;
\`\`\`

### Subqueries
\`\`\`sql
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);
\`\`\`

### Window Functions
\`\`\`sql
SELECT name, SUM(amount) OVER (PARTITION BY city) FROM orders;
\`\`\`

### Common Table Expressions (CTEs)
\`\`\`sql
WITH monthly_sales AS (
  SELECT date_trunc('month', order_date) as month,
         SUM(amount) as total
  FROM orders
  GROUP BY 1
)
SELECT * FROM monthly_sales;
\`\`\`

### Transactions
\`\`\`sql
BEGIN;
INSERT INTO orders (amount, status) VALUES (100, 'pending');
UPDATE users SET balance = balance - 100 WHERE id = 1;
COMMIT;
\`\`\`

## Best Practices

1. **Query Optimization**
   - Use indexes
   - Avoid full table scans
   - Use JOINs efficiently
   - Optimize subqueries
   - Use window functions sparingly

2. **Data Manipulation**
   - Use transactions for atomicity
   - Handle constraints and triggers
   - Use upsert for conflict resolution
   - Test data manipulation thoroughly

3. **Advanced Features**
   - Use advanced SQL features for complex queries
   - Consider performance implications
   - Test advanced features thoroughly

4. **Security**
   - Use parameterized queries
   - Implement row-level security
   - Use stored procedures for complex logic
   - Test security thoroughly

## Common Pitfalls

1. **SQL Injection**
\`\`\`sql
-- Bad
SELECT * FROM users WHERE id = ' + userId + ';

-- Good
SELECT * FROM users WHERE id = ?;
\`\`\`

2. **Performance Issues**
\`\`\`sql
-- Bad
SELECT * FROM users;

-- Good
SELECT * FROM users WHERE age > 30;
\`\`\`

3. **Indexing**
\`\`\`sql
-- Bad
SELECT * FROM users;

-- Good
CREATE INDEX idx_age ON users(age);
\`\`\`

4. **Join Performance**
\`\`\`sql
-- Bad
SELECT * FROM users JOIN orders;

-- Good
CREATE INDEX idx_user_id ON orders(user_id);
\`\`\`

## Related Topics
- Database Basics
- SQL Fundamentals
- Advanced SQL Features
- SQL Joins
- SQL Subqueries
- SQL Window Functions
- SQL Common Table Expressions
- SQL Transactions

## Additional Resources
- [SQL Tutorial](https://www.w3schools.com/sql/)
- [SQL for Beginners](https://www.sqlforbeginners.com/)
- [SQL Cheatsheet](https://www.sql-cheatsheet.com/)
`
    },
    { 
      name: 'NoSQL', 
      subjectName: 'DB',
      difficulty: 'Intermediate',
      prerequisites: ['Database Basics', 'NoSQL Fundamentals'],
      learningObjectives: [
        'Understand NoSQL fundamentals',
        'Master different NoSQL databases',
        'Work with document-oriented databases',
        'Implement advanced NoSQL features',
        'Handle database performance'
      ],
      recap: `# NoSQL in Database Management

## Core Concepts

### What is NoSQL?
NoSQL (Not Only SQL) is a type of database management system that provides a mechanism for storage and retrieval of data that is modeled in means other than the tabular relations used in relational databases.

### Key Components
1. **Document-oriented databases**
   - MongoDB
   - Couchbase
   - CouchDB
   - MongoDB

2. **Key-value stores**
   - Redis
   - DynamoDB
   - Cassandra
   - Redis

3. **Wide-column stores**
   - Bigtable
   - HBase
   - Cassandra
   - Bigtable

4. **Graph databases**
   - Neo4j
   - OrientDB
   - Titan
   - Neo4j

## Working with NoSQL

### Document-oriented databases
\`\`\`javascript
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mydatabase', (err, client) => {
  if (err) return console.error(err);
  const db = client.db();
  // Use db as needed
  client.close();
});
\`\`\`

### Key-value stores
\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

client.set('key', 'value', redis.print);
client.get('key', redis.print);
\`\`\`

### Wide-column stores
\`\`\`javascript
const Bigtable = require('bigtable');
const bigtable = new Bigtable({
  projectId: 'your-project-id',
  instanceId: 'your-instance-id',
  tableId: 'your-table-id'
});

bigtable.get('rowKey', 'columnFamily', 'columnQualifier', (err, data) => {
  if (err) throw err;
  console.log(data);
});
\`\`\`

### Graph databases
\`\`\`javascript
const neo4j = require('neo4j-driver');
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));

const session = driver.session();
session.run('MATCH (n) RETURN n', {}).then(result => {
  result.records.forEach(record => {
    console.log(record.get('n').properties);
  });
  session.close();
  driver.close();
});
\`\`\`

## Best Practices

1. **Database Selection**
   - Choose the right database for the job
   - Consider data consistency requirements
   - Test performance and scalability
   - Consider cost and maintenance

2. **Data Modeling**
   - Use denormalized data structures
   - Use embedded documents
   - Use references
   - Use denormalized data structures

3. **Querying**
   - Use appropriate querying techniques
   - Use indexes for efficient querying
   - Use secondary indexes for complex queries
   - Use map-reduce for complex queries

4. **Data Consistency**
   - Understand eventual consistency
   - Use conflict resolution strategies
   - Test data consistency thoroughly

5. **Performance**
   - Optimize queries
   - Use caching
   - Use sharding
   - Use replication
   - Profile performance

## Common Pitfalls

1. **Data Consistency**
\`\`\`javascript
// Bad
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mydatabase', (err, client) => {
  if (err) return console.error(err);
  const db = client.db();
  db.collection('users').insertOne({ name: 'John' }, (err, result) => {
    if (err) return console.error(err);
    console.log('User inserted');
    client.close();
  });
});

// Good
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mydatabase', (err, client) => {
  if (err) return console.error(err);
  const db = client.db();
  db.collection('users').insertOne({ name: 'John' }, (err, result) => {
    if (err) return console.error(err);
    console.log('User inserted');
    client.close();
  });
});
\`\`\`

2. **Query Performance**
\`\`\`javascript
// Bad
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mydatabase', (err, client) => {
  if (err) return console.error(err);
  const db = client.db();
  db.collection('users').find({}).toArray((err, users) => {
    if (err) throw err;
    console.log(users);
    client.close();
  });
});

// Good
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mydatabase', (err, client) => {
  if (err) return console.error(err);
  const db = client.db();
  db.collection('users').find({}).toArray((err, users) => {
    if (err) throw err;
    console.log(users);
    client.close();
  });
});
\`\`\`

3. **Data Modeling**
\`\`\`javascript
// Bad
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mydatabase', (err, client) => {
  if (err) return console.error(err);
  const db = client.db();
  db.collection('users').insertOne({ name: 'John' }, (err, result) => {
    if (err) return console.error(err);
    console.log('User inserted');
    client.close();
  });
});

// Good
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mydatabase', (err, client) => {
  if (err) return console.error(err);
  const db = client.db();
  db.collection('users').insertOne({ name: 'John' }, (err, result) => {
    if (err) return console.error(err);
    console.log('User inserted');
    client.close();
  });
});
\`\`\`

## Related Topics
- Database Basics
- NoSQL Fundamentals
- Document-oriented Databases
- Key-value Stores
- Wide-column Stores
- Graph Databases

## Additional Resources
- [NoSQL Tutorial](https://www.w3schools.com/nosql/)
- [NoSQL for Beginners](https://www.nosqlforbeginners.com/)
- [NoSQL Cheatsheet](https://www.nosql-cheatsheet.com/)
`
    },
    { 
      name: 'Tuples', 
      subjectName: 'Python',
      difficulty: 'Intermediate',
      prerequisites: ['Python Basics', 'Data Structures'],
      learningObjectives: [
        'Understand tuple fundamentals',
        'Master tuple operations',
        'Work with tuple methods',
        'Implement tuple patterns',
        'Handle tuple performance considerations'
      ],
      recap: `# Tuples in Python

## Core Concepts

### What are Tuples?
Tuples are ordered collections of items, similar to lists but are immutable. They are often used for grouping related data together.

### Key Components
1. **Immutable**
   - Once created, tuples cannot be changed
   - Use parentheses () to define tuples

2. **Indexing**
   - Access elements using index positions
   - Positive indexing starts from 0
   - Negative indexing starts from -1

3. **Slicing**
   - Extract sub-tuples using slicing syntax
   - Use colon : to specify start and end indices

4. **Unpacking**
   - Unpack tuples into variables
   - Use * to unpack multiple elements

## Working with Tuples

### Basic Operations
\`\`\`python
# Creating a tuple
my_tuple = (1, 2, 3)

# Accessing elements
print(my_tuple[0])  # Output: 1

# Length of a tuple
print(len(my_tuple))  # Output: 3

# Concatenation
tuple1 = (1, 2)
tuple2 = (3, 4)
result = tuple1 + tuple2  # Output: (1, 2, 3, 4)
\`\`\`

### Tuple Methods
\`\`\`python
# Count method
my_tuple = (1, 2, 2, 3)
print(my_tuple.count(2))  # Output: 2

# Index method
print(my_tuple.index(3))  # Output: 3
\`\`\`

### Tuple Slicing
\`\`\`python
# Slicing a tuple
my_tuple = (1, 2, 3, 4, 5)
print(my_tuple[1:3])  # Output: (2, 3)

# Negative slicing
print(my_tuple[-3:])  # Output: (3, 4, 5)
\`\`\`

### Tuple Unpacking
\`\`\`python
# Unpacking a tuple
my_tuple = (1, 2, 3)
a, b, c = my_tuple  # a = 1, b = 2, c = 3
\`\`\`

### Tuple Packing
\`\`\`python
# Packing multiple values into a tuple
my_tuple = 1, 2, 3  # Output: (1, 2, 3)
\`\`\`

## Best Practices

1. **Use Tuples for Immutable Data**
   - Use tuples for data that should not change
   - Tuples are more memory efficient than lists
   - Use parentheses () to define tuples

2. **Indexing and Slicing**
   - Use positive indexing for readability
   - Use negative indexing for convenience
   - Use slicing for extracting sub-tuples
   - Test slicing and indexing thoroughly

3. **Tuple Methods**
   - Use count() method to count occurrences
   - Use index() method to find index of an element
   - Test methods thoroughly

4. **Tuple Unpacking**
   - Use * to unpack multiple elements
   - Use unpacking for readability
   - Test unpacking thoroughly

5. **Tuple Packing**
   - Use parentheses () to define tuples
   - Use packing for convenience
   - Test packing thoroughly

## Common Pitfalls

1. **Immutability**
\`\`\`python
# Bad
my_tuple = (1, 2, 3)
my_tuple[0] = 4  # This will raise an error

# Good
my_tuple = (1, 2, 3)
\`\`\`

2. **Indexing**
\`\`\`python
# Bad
my_tuple = (1, 2, 3)
print(my_tuple[3])  # This will raise an IndexError

# Good
my_tuple = (1, 2, 3)
if index < len(my_tuple):
    print(my_tuple[index])
\`\`\`

3. **Slicing**
\`\`\`python
# Bad
my_tuple = (1, 2, 3, 4, 5)
print(my_tuple[1:10])  # This will raise a ValueError

# Good
my_tuple = (1, 2, 3, 4, 5)
print(my_tuple[1:3])  # Output: (2, 3)
\`\`\`

4. **Unpacking**
\`\`\`python
# Bad
my_tuple = (1, 2, 3)
a, b, c = my_tuple  # This will raise a ValueError

# Good
my_tuple = (1, 2, 3)
a, b, c = my_tuple  # a = 1, b = 2, c = 3
\`\`\`

5. **Packing**
\`\`\`python
# Bad
my_tuple = (1, 2, 3)
a, b, c = my_tuple  # This will raise a ValueError

# Good
my_tuple = (1, 2, 3)
a, b, c = my_tuple  # a = 1, b = 2, c = 3
\`\`\`

## Related Topics
- Immutable Data
- Data Structures
- Python Basics
- Tuple Operations
- Tuple Methods
- Tuple Slicing
- Tuple Unpacking
- Tuple Packing

## Additional Resources
- [Python Tuples](https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences)
- [Python Tuple Methods](https://www.w3schools.com/python/python_tuples.asp)
- [Python Tuple Slicing](https://www.geeksforgeeks.org/python-slicing-tuples/)
`
    },
    { 
      name: 'dictionary', 
      subjectName: 'Python',
      difficulty: 'Intermediate',
      prerequisites: ['Python Basics', 'Data Structures'],
      learningObjectives: [
        'Understand dictionary fundamentals',
        'Master dictionary operations',
        'Work with dictionary methods',
        'Implement dictionary patterns',
        'Handle dictionary performance considerations'
      ],
      recap: `# Dictionaries in Python

## Core Concepts

### What are Dictionaries?
Dictionaries are unordered collections of key-value pairs. They are mutable and can be changed after creation.

### Key Components
1. **Keys**
   - Unique and immutable
   - Used to access values
   - Can be any immutable type

2. **Values**
   - Any type of data
   - Can be duplicated
   - Accessed using keys

3. **Operations**
   - Insertion
   - Deletion
   - Lookup
   - Update
   - Iteration

## Working with Dictionaries

### Basic Operations
\`\`\`python
# Creating a dictionary
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}

# Accessing values
print(my_dict['apple'])  # Output: 1

# Length of a dictionary
print(len(my_dict))  # Output: 3

# Adding a new key-value pair
my_dict['date'] = 4
print(my_dict)  # Output: {'apple': 1, 'banana': 2, 'cherry': 3, 'date': 4}
\`\`\`

### Dictionary Methods
\`\`\`python
# get method
print(my_dict.get('banana'))  # Output: 2

# keys method
print(my_dict.keys())  # Output: dict_keys(['apple', 'banana', 'cherry', 'date'])

# values method
print(my_dict.values())  # Output: dict_values([1, 2, 3, 4])

# items method
print(my_dict.items())  # Output: dict_items([('apple', 1), ('banana', 2), ('cherry', 3), ('date', 4)])

# update method
my_dict.update({'banana': 'yellow', 'grape': 5})
print(my_dict)  # Output: {'apple': 1, 'banana': 'yellow', 'cherry': 3, 'date': 4, 'grape': 5}

# pop method
print(my_dict.pop('banana'))  # Output: yellow
print(my_dict)  # Output: {'apple': 1, 'cherry': 3, 'date': 4, 'grape': 5}

# popitem method
print(my_dict.popitem())  # Output: ('grape', 5)
print(my_dict)  # Output: {'apple': 1, 'cherry': 3, 'date': 4}
\`\`\`

### Dictionary Comprehension
\`\`\`python
# Creating a dictionary using comprehension
squares = {x: x**2 for x in (1, 2, 3, 4, 5)}
print(squares)  # Output: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
\`\`\`

### Default Values
\`\`\`python
# Creating a dictionary with default values
default_dict = defaultdict(int)
default_dict['apple'] += 1
print(default_dict['apple'])  # Output: 1
print(default_dict['banana'])  # Output: 0
\`\`\`

## Best Practices

1. **Use Dictionaries for Unordered Data**
   - Use dictionaries for data that does not require order
   - Dictionaries are more memory efficient than lists
   - Use curly braces {} to define dictionaries

2. **Keys and Values**
   - Use immutable keys for better performance
   - Use meaningful key names
   - Use values for any type of data
   - Test key and value access thoroughly

3. **Operations**
   - Use get method for safe lookups
   - Use keys method to iterate over keys
   - Use values method to iterate over values
   - Use items method to iterate over key-value pairs
   - Test operations thoroughly

4. **Comprehensions**
   - Use comprehensions for concise and readable code
   - Use comprehensions for creating dictionaries
   - Test comprehensions thoroughly

5. **Default Values**
   - Use defaultdict for default values
   - Use defaultdict for creating dictionaries with default values
   - Test default values thoroughly

## Common Pitfalls

1. **Key Errors**
\`\`\`python
# Bad
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
print(my_dict['grape'])  # This will raise a KeyError

# Good
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
print(my_dict.get('grape'))  # Output: None
\`\`\`

2. **Iteration**
\`\`\`python
# Bad
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
for key in my_dict:
    print(key)  # This will print keys in arbitrary order

# Good
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
for key in my_dict.keys():
    print(key)  # This will print keys in insertion order
\`\`\`

3. **Update**
\`\`\`python
# Bad
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
my_dict['apple'] = 'red'  # This will update the value

# Good
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
my_dict.update({'apple': 'red'})  # This will update the value
\`\`\`

4. **Comprehensions**
\`\`\`python
# Bad
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
squares = {key: value**2 for key, value in my_dict.items()}
print(squares)  # Output: {'apple': 1, 'banana': 4, 'cherry': 9}

# Good
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
squares = {key: value**2 for key, value in my_dict.items()}
print(squares)  # Output: {'apple': 1, 'banana': 4, 'cherry': 9}
\`\`\`

5. **Default Values**
\`\`\`python
# Bad
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
print(my_dict.get('grape', 'Not Found'))  # Output: Not Found

# Good
my_dict = {'apple': 1, 'banana': 2, 'cherry': 3}
print(my_dict.get('grape', 'Not Found'))  # Output: Not Found
\`\`\`

## Related Topics
- Unordered Data
- Data Structures
- Python Basics
- Dictionary Operations
- Dictionary Methods
- Dictionary Comprehensions
- Default Values

## Additional Resources
- [Python Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
- [Python Dictionary Methods](https://www.w3schools.com/python/python_dictionaries.asp)
- [Python Dictionary Comprehensions](https://www.geeksforgeeks.org/python-dictionary-comprehension/)
`
    },
    { 
      name: 'functions', 
      subjectName: 'Python',
      difficulty: 'Intermediate',
      prerequisites: ['Python Basics', 'Function Basics'],
      learningObjectives: [
        'Understand function fundamentals',
        'Master function design',
        'Work with function parameters',
        'Implement function patterns',
        'Handle function return values'
      ],
      recap: `# Functions in Python

## Core Concepts

### What are Functions?
Functions are reusable blocks of code that perform specific tasks. They can accept input parameters, execute a series of statements, and return a value.

### Key Components
1. **Function Definition**
   - def keyword
   - Function name
   - Parameters
   - Docstring
   - Return statement

2. **Function Call**
   - Function name followed by parentheses
   - Arguments
   - Keyword arguments
   - Default arguments
   - Variable-length arguments

3. **Scope**
   - Local scope
   - Global scope
   - Nested functions
   - Built-in functions

## Working with Functions

### Basic Function
\`\`\`python
def greet(name):
    """Greet a person"""
    return f"Hello, {name}!"

# Calling the function
print(greet("Alice"))  # Output: Hello, Alice!
\`\`\`

### Parameters and Arguments
\`\`\`python
def add(a, b):
    """Add two numbers"""
    return a + b

# Positional arguments
print(add(1, 2))  # Output: 3

# Keyword arguments
print(add(a=1, b=2))  # Output: 3

# Default arguments
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Calling the function
print(greet("Alice"))  # Output: Hello, Alice!
print(greet("Bob", "Hi"))  # Output: Hi, Bob!
\`\`\`

### Return Values
\`\`\`python
def square(x):
    """Return the square of a number"""
    return x ** 2

# Returning a single value
print(square(3))  # Output: 9

# Returning multiple values
def divide_and_remainder(a, b):
    """Return quotient and remainder"""
    return a // b, a % b

# Calling the function
quotient, remainder = divide_and_remainder(10, 3)
print(quotient, remainder)  # Output: 3 1
\`\`\`

### Variable-Length Arguments
\`\`\`python
def sum_all(*args):
    """Sum all arguments"""
    return sum(args)

# Calling the function
print(sum_all(1, 2, 3))  # Output: 6

def print_args(**kwargs):
    """Print all keyword arguments"""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Calling the function
print_args(a=1, b=2, c=3)  # Output: a: 1, b: 2, c: 3
\`\`\`

### Nested Functions
\`\`\`python
def outer_function():
    def inner_function():
        print("This is an inner function")
    inner_function()

# Calling the outer function
outer_function()  # Output: This is an inner function
\`\`\`

## Best Practices

1. **Function Design**
   - Single Responsibility Principle
   - Keep functions small and focused
   - Use meaningful names
   - Use docstrings for documentation
   - Use return statements

2. **Parameter Handling**
   - Use default arguments for optional parameters
   - Use *args for variable-length arguments
   - Use **kwargs for keyword arguments
   - Use named arguments for clarity
   - Validate parameters

3. **Return Values**
   - Use return statements for meaningful values
   - Use multiple return statements for complex logic
   - Use None for no return value
   - Use docstrings for return value documentation

4. **Scope**
   - Use local variables for local scope
   - Use global variables for global scope
   - Use nested functions for nested scope
   - Use built-in functions sparingly

5. **Error Handling**
   - Use try/except blocks for error handling
   - Use assert statements for debugging
   - Use logging for production code
   - Use docstrings for error documentation

## Common Pitfalls

1. **Scope Issues**
\`\`\`python
# Bad
def function():
    x = 1
    def inner_function():
        print(x)  # This will print 1
    inner_function()

# Good
def function():
    x = 1
    def inner_function():
        print(x)  # This will print 1
    inner_function()
\`\`\`

2. **Variable Shadowing**
\`\`\`python
# Bad
def function():
    x = 1
    def inner_function():
        print(x)  # This will print 1
    inner_function()

# Good
def function():
    x = 1
    def inner_function():
        print(x)  # This will print 1
    inner_function()
\`\`\`

3. **Return Values**
\`\`\`python
# Bad
def function():
    return 1
    return 2  # This will never be reached

# Good
def function():
    return 1
\`\`\`

4. **Variable-Length Arguments**
\`\`\`python
# Bad
def function(*args):
    print(args)  # This will print a tuple

# Good
def function(*args):
    print(args)  # This will print a tuple
\`\`\`

5. **Nested Functions**
\`\`\`python
# Bad
def function():
    def inner_function():
        print("This is an inner function")
    inner_function()

# Good
def function():
    def inner_function():
        print("This is an inner function")
    inner_function()
\`\`\`

## Related Topics
- Function Basics
- Python Basics
- Function Design
- Function Parameters
- Function Return Values
- Function Scope
- Variable-Length Arguments
- Nested Functions

## Additional Resources
- [Python Functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [Python Function Basics](https://www.w3schools.com/python/python_functions.asp)
- [Python Function Design](https://www.geeksforgeeks.org/python-functions/)
`
    },
    { 
      name: 'file handling', 
      subjectName: 'Python',
      difficulty: 'Intermediate',
      prerequisites: ['Python Basics', 'File I/O'],
      learningObjectives: [
        'Understand file handling fundamentals',
        'Master file operations',
        'Work with file modes',
        'Implement file handling patterns',
        'Handle file errors and exceptions'
      ],
      recap: `# File Handling in Python

## Core Concepts

### What is File Handling?
File handling is the process of reading from and writing to files. Python provides built-in functions and methods to handle files.

### Key Components
1. **File Modes**
   - 'r' (read)
   - 'w' (write)
   - 'a' (append)
   - 'r+' (read and write)
   - 'w+' (write and read)
   - 'a+' (append and read)

2. **File Operations**
   - open()
   - close()
   - read()
   - write()
   - seek()
   - tell()
   - truncate()

3. **Context Managers**
   - with statement
   - open() as context manager

## Working with Files

### Basic Operations
\`\`\`python
# Opening a file
file = open('file.txt', 'r')

# Reading a file
content = file.read()

# Writing to a file
file.write('Hello, world!')

# Closing a file
file.close()
\`\`\`

### File Modes
\`\`\`python
# Opening a file in read mode
file = open('file.txt', 'r')

# Opening a file in write mode
file = open('file.txt', 'w')

# Opening a file in append mode
file = open('file.txt', 'a')

# Opening a file in read and write mode
file = open('file.txt', 'r+')

# Opening a file in write and read mode
file = open('file.txt', 'w+')

# Opening a file in append and read mode
file = open('file.txt', 'a+')
\`\`\`

### Context Managers
\`\`\`python
# Using with statement
with open('file.txt', 'r') as file:
    content = file.read()

# Using open() as context manager
with open('file.txt', 'w') as file:
    file.write('Hello, world!')
\`\`\`

### File Methods
\`\`\`python
# read method
file = open('file.txt', 'r')
content = file.read()

# write method
file = open('file.txt', 'w')
file.write('Hello, world!')

# seek method
file = open('file.txt', 'r+')
file.seek(0)

# tell method
file = open('file.txt', 'r+')
print(file.tell())

# truncate method
file = open('file.txt', 'w+')
file.truncate()
\`\`\`

### Error Handling
\`\`\`python
try:
    file = open('file.txt', 'r')
    content = file.read()
    file.close()
except FileNotFoundError:
    print("File not found")

try:
    file = open('file.txt', 'w')
    file.write('Hello, world!')
    file.close()
except IOError:
    print("An error occurred while writing to the file")
\`\`\`

## Best Practices

1. **File Modes**
   - Use 'r' for reading
   - Use 'w' for writing
   - Use 'a' for appending
   - Use 'r+' for reading and writing
   - Use 'w+' for writing and reading
   - Use 'a+' for appending and reading

2. **Context Managers**
   - Use with statement for automatic file closing
   - Use open() as context manager for automatic file handling
   - Test context managers thoroughly

3. **Error Handling**
   - Use try/except blocks for error handling
   - Use built-in exceptions for specific errors
   - Use docstrings for error documentation
   - Test error handling thoroughly

4. **File Operations**
   - Use read() method for reading files
   - Use write() method for writing files
   - Use seek() and tell() methods for random access
   - Use truncate() method for truncating files
   - Test file operations thoroughly

## Common Pitfalls

1. **File Not Found**
\`\`\`python
# Bad
file = open('file.txt', 'r')

# Good
try:
    file = open('file.txt', 'r')
except FileNotFoundError:
    print("File not found")
\`\`\`

2. **Permission Denied**
\`\`\`python
# Bad
file = open('file.txt', 'w')

# Good
try:
    file = open('file.txt', 'w')
except PermissionError:
    print("Permission denied")
\`\`\`

3. **File Mode Mismatch**
\`\`\`python
# Bad
file = open('file.txt', 'r')

# Good
try:
    file = open('file.txt', 'r')
except ValueError:
    print("Invalid file mode")
\`\`\`

4. **File Position**
\`\`\`python
# Bad
file = open('file.txt', 'r')
file.read()
file.read()  # This will read the same content again

# Good
file = open('file.txt', 'r')
file.read()
file.seek(0)
file.read()  # This will read the file from the beginning
\`\`\`

## Related Topics
- File I/O
- Python Basics
- File Handling
- File Modes
- Context Managers
- File Methods
- Error Handling

## Additional Resources
- [Python File Handling](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Python File Modes](https://www.w3schools.com/python/python_file_handling.asp)
- [Python Context Managers](https://www.geeksforgeeks.org/context-manager-in-python/)
`
    }
  ]
};

const problemsByTopic: Record<string, { title: string; description: string; input?: string; output?: string; difficulty: 'easy' | 'medium' | 'hard' }[]> = {
  'Promises': [
  {
    title: 'Delayed Hello Promise',
    description: `# Delayed Hello Promise

Create a function \`delayedHello\` that returns a Promise which resolves to the string \`"Hello, World!"\` after 1 second.

## Requirements
1. Return a Promise using \`setTimeout\`
2. Resolve with the message after 1 second

## Example
\`\`\`javascript
delayedHello().then(console.log); // "Hello, World!"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Async Sum with Validation',
    description: `# Async Sum with Validation

Write a function \`sumAsync(a, b)\` that returns a Promise. It resolves with the sum after 500ms. If either input is not a number, reject with an error.

## Requirements
1. Validate inputs
2. Resolve with sum or reject with "Invalid input: numbers expected"

## Example
\`\`\`javascript
sumAsync(10, 5).then(console.log); // 15
sumAsync("a", 3).catch(console.error); // "Invalid input: numbers expected"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Fetch User Data Simulated',
    description: `# Fetch User Data Simulated

Create a function \`fetchUser(id)\` that returns a Promise. Resolve with user data if \`id === 1\`, otherwise reject with "User not found".

## Requirements
1. Use \`setTimeout\` to delay response
2. Conditionally resolve or reject

## Example
\`\`\`javascript
fetchUser(1).then(console.log); // { id: 1, name: "Alice" }
fetchUser(2).catch(console.error); // "User not found"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Chained Promise Calls',
    description: `# Chained Promise Calls

Implement \`getTopCommentByUser(userId)\` that calls three async functions: \`getUser\`, \`getPostsByUser\`, and \`getTopCommentFromPost\`, returning the top comment of the user's first post.

## Requirements
1. Call APIs in sequence using Promises
2. Return the top comment object

## Example
\`\`\`javascript
getTopCommentByUser(1).then(console.log); 
// { id: 101, text: "Top comment from first post" }
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Print Strings with Delay',
    description: `# Print Strings with Delay

Write a function \`printWithDelay(arr)\` that prints strings one after another with a 1 second delay between each.

## Requirements
1. Use Promises and \`setTimeout\`
2. No recursion allowed

## Example
\`\`\`javascript
printWithDelay(["One", "Two", "Three"]);
// Output (1s apart): One, Two, Three
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Promise with Timeout Fallback',
    description: `# Promise with Timeout Fallback

Create a function \`fetchWithTimeout(promise, timeout)\` that races a Promise against a timeout duration and rejects with "Request timed out" if exceeded.

## Requirements
1. Use \`Promise.race()\`
2. Handle timeout fallback

## Example
\`\`\`javascript
fetchWithTimeout(fetchData(), 2000)
  .then(console.log)
  .catch(console.error);
// Output: "Request timed out" if delayed
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Custom allSettled Polyfill',
    description: `# Custom allSettled Polyfill

Implement \`allSettledPolyfill(promises)\` to return an array of result objects indicating status and value or reason, like native \`Promise.allSettled\`.

## Requirements
1. Accept an array of Promises
2. Return fulfilled/rejected results

## Example
\`\`\`javascript
allSettledPolyfill([
  Promise.resolve("A"),
  Promise.reject("B")
]).then(console.log);
/*
[
  { status: "fulfilled", value: "A" },
  { status: "rejected", reason: "B" }
]
*/
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Retry Failed Async Function',
    description: `# Retry Failed Async Function

Write \`retry(fn, retries)\` that retries a rejected async function up to \`retries\` times, waiting 500ms between each attempt.

## Requirements
1. Retry on failure
2. Resolve if successful, reject if all attempts fail

## Example
\`\`\`javascript
retry(() => unstableFetch(), 3)
  .then(console.log)
  .catch(console.error);
// Output: Fetched or "Failed after 3 attempts"
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Limited Concurrent Execution (Pool)',
    description: `# Limited Concurrent Execution (Pool)

Create \`promisePool(tasks, limit)\` to execute async functions in a pool with a concurrency cap.

## Requirements
1. Run at most \`limit\` Promises in parallel
2. Resolve when all tasks complete

## Example
\`\`\`javascript
promisePool([task1, task2, task3], 2)
  .then(() => console.log("All done"));
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Closures': [
  {
    title: 'Counter Function',
    description: `# Counter Function

Create a simple counter using closures.

## Requirements
1. Initialize the counter with a starting value
2. Provide methods to increment, decrement, and get the current count
3. Preserve state using closure (no global variables)

## Example
\`\`\`javascript
const counter = createCounter(0);
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Once Function Executor',
    description: `# Once Function Executor

Write a function \`once(fn)\` that ensures the passed function can only be executed once. On subsequent calls, it should return the result of the first invocation.

## Requirements
1. Use closures to track internal state
2. Return a new function that wraps the original
3. Ignore subsequent arguments after first call

## Example
\`\`\`javascript
const initialize = once(() => console.log("Initialized!"));
initialize(); // "Initialized!"
initialize(); // nothing
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Create Multiplier Factory',
    description: `# Create Multiplier Factory

Write a function \`createMultiplier(factor)\` that returns a new function which multiplies any number by that factor.

## Requirements
1. Closure must remember the original factor
2. Support multiple independent multipliers

## Example
\`\`\`javascript
const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5); // 10
triple(4); // 12
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Private Variable Pattern',
    description: `# Private Variable Pattern

Implement a module with private variables using closures. Use it to simulate a simple bank account.

## Requirements
1. Private variable to store balance
2. Public methods: deposit, withdraw, getBalance
3. Prevent direct access to balance from outside

## Example
\`\`\`javascript
const account = createAccount();
account.deposit(100);
account.withdraw(30);
account.getBalance(); // 70
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Custom Event Emitter',
    description: `# Custom Event Emitter

Build a simple event emitter using closures. Allow listeners to subscribe, unsubscribe, and emit events.

## Requirements
1. Register multiple listeners per event
2. Use closures to manage internal event mapping
3. Provide \`on\`, \`off\`, and \`emit\` methods

## Example
\`\`\`javascript
const emitter = createEmitter();
emitter.on('greet', name => console.log(\`Hello, \${name}!\`));
emitter.emit('greet', 'Alice'); // "Hello, Alice!"
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Function Timer Logger',
    description: `# Function Timer Logger

Wrap any function so that it logs how long it took to execute, without modifying the original function. Use closures to retain context.

## Requirements
1. Accept any sync function
2. Return a new wrapped version that logs execution time
3. Do not alter original function behavior

## Example
\`\`\`javascript
const wrapped = timeLogger(slowAdd);
wrapped(5, 10); 
// Output: "Function took 200ms" (example)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Implement Currying',
    description: `# Implement Currying

Write a function \`curry(fn)\` that transforms a function of N arguments into N chained calls.

## Requirements
1. Support functions of arbitrary arity
2. Return partially applied functions on each call
3. Final call returns result

## Example
\`\`\`javascript
function add(a, b, c) {
  return a + b + c;
}
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Function with Internal Memoization',
    description: `# Function with Internal Memoization

Create a function that returns a memoized version of any single-argument pure function. Use closure to store cache data internally.

## Requirements
1. Memoized result should be reused for repeated calls
2. Only support functions with one argument
3. Use object for cache

## Example
\`\`\`javascript
const square = x => x * x;
const memoizedSquare = memoize(square);
memoizedSquare(4); // computes
memoizedSquare(4); // uses cache
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Throttle Function Execution',
    description: `# Throttle Function Execution

Write a function \`throttle(fn, delay)\` that limits the execution of \`fn\` to once every \`delay\` milliseconds using closures.

## Requirements
1. Return a throttled version of the function
2. Internal state must be preserved using closure
3. Ignore calls made during throttle period

## Example
\`\`\`javascript
const log = () => console.log('Hello!');
const throttledLog = throttle(log, 2000);
throttledLog(); // executes
throttledLog(); // ignored (within 2s)
\`\`\`
`,
    difficulty: 'hard'
  }
],
  'Fetch': [
  {
    title: 'Basic Fetch Request',
    description: `# Basic Fetch Request

Create a function to make a simple GET request using the \`fetch\` API.

## Requirements
1. Use \`fetch()\` to request data from a given URL
2. Parse the response as JSON
3. Handle HTTP and network errors appropriately using \`.catch()\`

## Example
\`\`\`javascript
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error("Fetch failed:", err));
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'POST Request with JSON Body',
    description: `# POST Request with JSON Body

Create a function that sends a POST request using \`fetch\`, passing a JavaScript object as JSON in the body.

## Requirements
1. Use \`fetch()\` with method \`POST\`
2. Convert JavaScript object to JSON string
3. Set correct headers and handle response

## Example
\`\`\`javascript
postData('https://api.example.com/users', { name: 'Alice' })
  .then(response => console.log(response))
  .catch(err => console.error(err));
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Fetch with Error Status Handling',
    description: `# Fetch with Error Status Handling

Extend your GET request to explicitly check for non-2xx status codes and throw an error.

## Requirements
1. Use \`response.ok\` to detect status issues
2. Throw custom errors with response status
3. Catch and log errors clearly

## Example
\`\`\`javascript
fetchAndHandle('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error.message));
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Fetch with Timeout',
    description: `# Fetch with Timeout

Wrap a \`fetch\` call with a timeout mechanism. If the request takes too long, abort it and throw a timeout error.

## Requirements
1. Use \`AbortController\` to cancel requests
2. Timeout value should be configurable
3. Catch timeout and handle gracefully

## Example
\`\`\`javascript
fetchWithTimeout('https://api.example.com/data', 3000)
  .then(data => console.log(data))
  .catch(err => console.error("Timeout or error:", err));
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Concurrent Fetch All',
    description: `# Concurrent Fetch All

Write a function that accepts an array of URLs and fetches data from all of them in parallel. Return a list of successful responses only.

## Requirements
1. Use \`Promise.allSettled\`
2. Filter out failed responses
3. Return array of data from successful calls

## Example
\`\`\`javascript
fetchMultiple([
  'https://api.example.com/1',
  'https://api.example.com/2'
]).then(results => console.log(results));
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Transform and Display API Data',
    description: `# Transform and Display API Data

Fetch data from an API, transform it (e.g., map and filter), and return only relevant fields such as name or id.

## Requirements
1. Perform fetch call
2. Use array methods to transform result
3. Handle malformed or unexpected data

## Example
\`\`\`javascript
fetchUsers('https://api.example.com/users')
  .then(users => console.log(users)); // [{ id: 1, name: 'Alice' }, ...]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Implement Fetch Retry',
    description: `# Implement Fetch Retry

Write a \`fetchWithRetry\` function that retries failed requests using exponential backoff logic.

## Requirements
1. Retry on network failure or 5xx status codes
2. Exponential delay between retries (e.g., 1s → 2s → 4s)
3. Stop after a maximum number of attempts

## Example
\`\`\`javascript
fetchWithRetry('https://api.example.com/data', 3)
  .then(data => console.log(data))
  .catch(err => console.error("Failed after retries:", err));
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Progressive Fetch Stream Reader',
    description: `# Progressive Fetch Stream Reader

Implement a fetch stream reader that reads text content progressively from a large response using \`ReadableStream\`.

## Requirements
1. Use \`response.body.getReader()\`
2. Read and decode chunks
3. Log each chunk to console in real-time

## Example
\`\`\`javascript
readLargeFile('https://api.example.com/large-file');
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Paginated Fetch with Recursion',
    description: `# Paginated Fetch with Recursion

Many APIs return paginated data. Implement a recursive fetch that retrieves all pages of data.

## Requirements
1. Identify if more pages exist
2. Recurse until all pages are collected
3. Return concatenated results

## Example
\`\`\`javascript
fetchAllPages('https://api.example.com/items?page=1')
  .then(allItems => console.log(allItems.length));
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Objects': [
  {
    title: 'Object Property Access',
    description: `# Object Property Access

Create a function \`get(obj, path, defaultValue)\` to safely access deeply nested properties in an object using a dot-separated path string.

## Requirements
1. Support nested keys like \`user.address.street\`
2. Return \`defaultValue\` if path is invalid
3. Handle arrays in the path

## Example
\`\`\`javascript
get(obj, 'user.address.street', 'N/A'); // returns "123 Main St" or "N/A"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Object Key Filtering',
    description: `# Object Key Filtering

Write a function \`filterKeys(obj, keys)\` that returns a new object containing only the specified keys from the original object.

## Requirements
1. Do not mutate original object
2. Return only requested properties

## Example
\`\`\`javascript
filterKeys({ name: 'Alice', age: 25, city: 'NY' }, ['name', 'city']);
// { name: 'Alice', city: 'NY' }
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Object to Array Converter',
    description: `# Object to Array Converter

Convert an object into an array of key-value pair strings.

## Requirements
1. Convert to array like \`["key1: value1", "key2: value2"]\`
2. Support nested values as \`[object Object]\`

## Example
\`\`\`javascript
objectToArray({ a: 1, b: 2 });
// ["a: 1", "b: 2"]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Object Transformation',
    description: `# Object Transformation

Transform the structure of an object using a mapping schema.

## Requirements
1. Accept a mapping object \`{ from: to }\`
2. Move or rename keys based on mapping
3. Handle nested paths

## Example
\`\`\`javascript
transform({ user: { name: 'Alice' } }, { 'user.name': 'profile.fullName' });
// { profile: { fullName: 'Alice' } }
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Flatten Nested Object',
    description: `# Flatten Nested Object

Implement a function to flatten a deeply nested object into a single-level object with dot-separated keys.

## Requirements
1. Use recursion
2. Keys should represent full path

## Example
\`\`\`javascript
flatten({ user: { name: 'Alice', address: { city: 'NY' } } });
// { 'user.name': 'Alice', 'user.address.city': 'NY' }
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Invert Key-Value Pairs',
    description: `# Invert Key-Value Pairs

Write a function \`invert(obj)\` that swaps the keys and values of an object.

## Requirements
1. Original keys become values and vice versa
2. Handle non-unique values safely

## Example
\`\`\`javascript
invert({ a: 'x', b: 'y' });
// { x: 'a', y: 'b' }
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Deep Object Clone',
    description: `# Deep Object Clone

Create a utility \`deepClone(obj)\` that deeply clones any object or array.

## Requirements
1. Handle nested structures
2. Clone circular references using a WeakMap
3. Preserve prototypes

## Example
\`\`\`javascript
const clone = deepClone(complexObj);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Deep Merge Objects',
    description: `# Deep Merge Objects

Implement a \`deepMerge(obj1, obj2)\` function that recursively merges the properties of two objects.

## Requirements
1. Do not overwrite nested objects
2. Merge arrays by index or concat (configurable)

## Example
\`\`\`javascript
deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Dynamic Object Constructor',
    description: `# Dynamic Object Constructor

Build a function \`construct(keys, values)\` that dynamically constructs an object from two parallel arrays.

## Requirements
1. Use array methods to combine key-value pairs
2. Handle mismatched lengths by ignoring extras

## Example
\`\`\`javascript
construct(['name', 'age'], ['Alice', 25]);
// { name: 'Alice', age: 25 }
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'HOFs': [
  {
    title: 'Array Map Implementation',
    description: `# Array Map Implementation

Create your own version of \`Array.map\` that mimics the behavior of the built-in method.

## Requirements
1. Accept a callback function and original array
2. Return a new array with transformed values
3. Provide \`value\`, \`index\`, and \`array\` as arguments to the callback

## Example
\`\`\`javascript
myMap([1, 2, 3], x => x * 2); // [2, 4, 6]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Custom ForEach Utility',
    description: `# Custom ForEach Utility

Implement a function \`myForEach\` that replicates the behavior of \`Array.prototype.forEach\`.

## Requirements
1. Take an array and a callback
2. Execute the callback for each item
3. Do not return anything

## Example
\`\`\`javascript
myForEach([1, 2], x => console.log(x * 2));
// Output: 2, 4
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Function Executor by Condition',
    description: `# Function Executor by Condition

Create a function that accepts a list of functions and executes only those which return true for a given condition.

## Requirements
1. Accept array of functions
2. Pass a value to each
3. Execute only those which return true

## Example
\`\`\`javascript
runIfTrue([
  x => x > 10,
  x => x % 2 === 0
], 12); // both will run
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Custom Filter Chain',
    description: `# Custom Filter Chain

Implement a chainable filter system using higher-order functions.

## Requirements
1. Allow chaining: \`.byAge()\`, \`.byCountry()\`
2. Store filters and apply them on \`.execute()\`
3. Use closures to retain intermediate state

## Example
\`\`\`javascript
filter(users)
  .byAge(18)
  .byCountry('US')
  .execute();
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Debounce Function',
    description: `# Debounce Function

Implement a \`debounce\` function that returns a debounced version of a given function. The debounced function delays invoking the original until after wait milliseconds have passed.

## Requirements
1. Accept a function and a delay
2. Cancel previous calls if a new one comes in
3. Useful for input field typing or resizing windows

## Example
\`\`\`javascript
const debouncedLog = debounce(() => console.log('Typed!'), 500);
debouncedLog(); debouncedLog(); // runs once after 500ms
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Compose Functions',
    description: `# Compose Functions

Create a function \`compose\` that takes multiple functions and composes them right-to-left.

## Requirements
1. Compose \`f(g(h(x)))\`
2. Each function should take one argument
3. Return the final result

## Example
\`\`\`javascript
const add2 = x => x + 2;
const double = x => x * 2;
const result = compose(double, add2)(3); // (3 + 2) * 2 = 10
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Implement Event System',
    description: `# Implement Event System

Create a publish-subscribe event system using higher-order functions.

## Requirements
1. Support \`.on(eventName, handler)\` to subscribe
2. Support \`.emit(eventName, payload)\` to notify
3. Support \`.off(eventName, handler)\` to unsubscribe

## Example
\`\`\`javascript
eventSystem.on('user:created', handler);
eventSystem.emit('user:created', { name: 'Alice' });
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Memoization Utility',
    description: `# Memoization Utility

Create a higher-order function \`memoize\` that caches the result of a function call for a specific input.

## Requirements
1. Cache based on input arguments
2. Only works for pure functions
3. Use an object or Map internally

## Example
\`\`\`javascript
const slowAdd = (a, b) => { console.log('Running...'); return a + b; };
const fastAdd = memoize(slowAdd);
fastAdd(2, 3); // "Running...", 5
fastAdd(2, 3); // Cached result, 5
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Function Pipeline Executor',
    description: `# Function Pipeline Executor

Implement a \`pipeline\` function that takes a value and a sequence of functions and applies them left to right.

## Requirements
1. Accept any number of functions
2. Pass the result of one function into the next
3. Return the final output

## Example
\`\`\`javascript
pipeline(5, x => x + 2, x => x * 3); // (5 + 2) * 3 = 21
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Searching': [
  {
    title: 'Linear Search Implementation',
    description: `# Linear Search Implementation

## Problem Description
Implement a linear search algorithm to find a target element in an array.

## Requirements
1. Return the index of the target element if found
2. Return -1 if the element is not found
3. Handle edge cases (empty array, null/undefined inputs)
4. Optimize for best-case scenario
5. Add appropriate error handling

## Example
\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
linearSearch(arr, 3); // Returns 2
linearSearch(arr, 6); // Returns -1
\`\`\``,
    input: `function linearSearch(arr, target) {
  // Your implementation
}

// Test cases
console.log(linearSearch([1, 2, 3, 4, 5], 3)); // Should return 2
console.log(linearSearch([1, 2, 3, 4, 5], 6)); // Should return -1
console.log(linearSearch([], 1)); // Should return -1`,
    output: `2
-1
-1`,
    difficulty: 'easy'
  },
  {
    title: 'Case-Insensitive Search',
    description: `# Case-Insensitive Search

## Problem Description
Implement a function that performs a case-insensitive search for a string in an array of strings.

## Requirements
1. Return index of matched string (ignoring case)
2. Return -1 if not found
3. Ignore special characters

## Example
\`\`\`javascript
caseInsensitiveSearch(['apple', 'Banana', 'CHERRY'], 'banana'); // Returns 1
\`\`\``,
    input: `function caseInsensitiveSearch(arr, target) {
  // Your implementation
}

console.log(caseInsensitiveSearch(['Apple', 'Banana'], 'banana')); // 1
console.log(caseInsensitiveSearch(['A', 'B'], 'b')); // 1`,
    output: `1
1`,
    difficulty: 'easy'
  },
  {
    title: 'Find First Even Number',
    description: `# Find First Even Number

## Problem Description
Given an array of integers, return the index of the first even number using linear search.

## Requirements
1. Must return index of first even number
2. If no even number is found, return -1

## Example
\`\`\`javascript
findFirstEven([1, 3, 5, 8, 10]); // 3
\`\`\``,
    input: `function findFirstEven(arr) {
  // Your implementation
}

console.log(findFirstEven([5, 7, 9, 10])); // 3
console.log(findFirstEven([1, 3, 5])); // -1`,
    output: `3
-1`,
    difficulty: 'easy'
  },
  {
    title: 'Binary Search Implementation',
    description: `# Binary Search Implementation

## Problem Description
Implement a binary search algorithm to find a target element in a sorted array.

## Requirements
1. Return the index of the target element if found
2. Return -1 if the element is not found
3. Handle edge cases (empty array, null/undefined inputs)
4. Ensure the input array is sorted
5. Add appropriate error handling

## Example
\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
binarySearch(arr, 3); // Returns 2
binarySearch(arr, 6); // Returns -1
\`\`\``,
    input: `function binarySearch(arr, target) {
  // Your implementation
}

console.log(binarySearch([1, 2, 3, 4, 5], 3)); // 2
console.log(binarySearch([], 1)); // -1`,
    output: `2
-1`,
    difficulty: 'medium'
  },
  {
    title: 'Search in Rotated Sorted Array',
    description: `# Search in Rotated Sorted Array

## Problem Description
Implement a function to search a target in a rotated sorted array using binary search logic.

## Requirements
1. Array is sorted but rotated (e.g. [4,5,6,7,0,1,2])
2. Find target element index
3. Return -1 if not found

## Example
\`\`\`javascript
searchRotated([4,5,6,7,0,1,2], 0); // 4
\`\`\``,
    input: `function searchRotated(arr, target) {
  // Your implementation
}

console.log(searchRotated([4,5,6,7,0,1,2], 0)); // 4
console.log(searchRotated([4,5,6,7,0,1,2], 3)); // -1`,
    output: `4
-1`,
    difficulty: 'medium'
  },
  {
    title: 'Search in 2D Matrix',
    description: `# Search in 2D Matrix

## Problem Description
Write a function to search a value in a 2D matrix where each row and each column is sorted.

## Requirements
1. Return true if value exists, otherwise false
2. Efficient search (not brute-force)

## Example
\`\`\`javascript
searchMatrix([
  [1, 4, 7],
  [8, 11, 15],
  [20, 22, 30]
], 11); // true
\`\`\``,
    input: `function searchMatrix(matrix, target) {
  // Your implementation
}

console.log(searchMatrix([[1, 3], [5, 7]], 5)); // true
console.log(searchMatrix([[1, 3], [5, 7]], 9)); // false`,
    output: `true
false`,
    difficulty: 'medium'
  },
  {
    title: 'Implement Jump Search',
    description: `# Jump Search Implementation

## Problem Description
Implement a jump search algorithm to find a target element in a sorted array.

## Requirements
1. Return the index of the target element if found
2. Return -1 if the element is not found
3. Optimize block size
4. Handle edge cases

## Example
\`\`\`javascript
jumpSearch([1, 2, 3, 4, 5], 3); // 2
jumpSearch([1, 2, 3, 4, 5], 6); // -1
\`\`\``,
    input: `function jumpSearch(arr, target) {
  // Your implementation
}

console.log(jumpSearch([1, 2, 3, 4, 5], 3)); // 2
console.log(jumpSearch([1, 2, 3, 4, 5], 6)); // -1`,
    output: `2
-1`,
    difficulty: 'hard'
  },
  {
    title: 'Find Peak Element',
    description: `# Find Peak Element

## Problem Description
A peak element is greater than its neighbors. Write a function to return the index of any one peak element in an array.

## Requirements
1. Linear or binary approach allowed
2. Consider edge cases (start/end of array)

## Example
\`\`\`javascript
findPeak([1, 3, 20, 4, 1]); // 2 (20 is peak)
\`\`\``,
    input: `function findPeak(arr) {
  // Your implementation
}

console.log(findPeak([1, 3, 20, 4, 1])); // 2`,
    output: `2`,
    difficulty: 'hard'
  },
  {
    title: 'Search in Infinite Sorted Array',
    description: `# Search in Infinite Sorted Array

## Problem Description
You're given an infinite sorted array and a target. Implement a function that finds the target efficiently using a combination of exponential search and binary search.

## Requirements
1. Simulate infinite array using a custom get() method
2. First find search bounds, then binary search
3. Return index if found, -1 otherwise

## Example
\`\`\`javascript
infiniteSearch(get, 6); // If get(i) gives increasing numbers like 1, 2, 3...

// Output depends on virtual array
\`\`\``,
    input: `function infiniteSearch(getFn, target) {
  // Your implementation
}

const mockArray = [1, 3, 5, 7, 9, 10, 15, 20];
const get = (i) => mockArray[i] ?? Infinity;

console.log(infiniteSearch(get, 10)); // 5`,
    output: `5`,
    difficulty: 'hard'
  }
]
,
  'Arrow functions': [
  {
    title: 'Refactor to Arrow Functions',
    description: `# Refactor to Arrow Functions

Refactor traditional function expressions into arrow functions without changing the output.

## Requirements
1. Use concise arrow function syntax where possible
2. Preserve all original behavior
3. Use parentheses appropriately for parameters

## Example
\`\`\`javascript
// Convert these functions
function add(a, b) { return a + b; }
const multiply = function(a, b) { return a * b; }

// To arrow functions:
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Implicit Returns',
    description: `# Implicit Returns

Refactor given functions to use implicit returns where possible.

## Requirements
1. Use arrow functions with implicit return
2. Avoid using curly braces unless necessary

## Example
\`\`\`javascript
const square = function(x) {
  return x * x;
}

// Convert to:
const square = x => x * x;
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Array Methods with Arrow Functions',
    description: `# Array Methods with Arrow Functions

Refactor a series of \`map\`, \`filter\`, and \`reduce\` operations using arrow functions.

## Requirements
1. Use arrow functions for callbacks
2. Maintain readable formatting

## Example
\`\`\`javascript
const nums = [1, 2, 3, 4];
const result = nums.map(function(n) {
  return n * 2;
});

// Refactor to:
const result = nums.map(n => n * 2);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Event Handler Conversion',
    description: `# Event Handler Conversion

Convert function-based DOM event handlers to arrow functions, ensuring \`this\` context remains correct.

## Requirements
1. Use arrow functions in addEventListener
2. Properly bind methods when using inside classes

## Example
\`\`\`javascript
button.addEventListener('click', function() {
  this.handleClick(); // Needs attention with arrow conversion
});
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Arrow Functions in Object Methods',
    description: `# Arrow Functions in Object Methods

Evaluate the behavior of arrow functions in object literals and fix context-related issues.

## Requirements
1. Understand lexical \`this\`
2. Identify when not to use arrows in methods

## Example
\`\`\`javascript
const obj = {
  name: "Box",
  getName: () => this.name // Problem: this refers to outer scope
};
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Arrow Function Parameter Rules',
    description: `# Arrow Function Parameter Rules

Rewrite functions with different parameter counts (zero, one, multiple) using arrow function rules.

## Requirements
1. Use correct parenthesis syntax
2. Validate behavior is unchanged

## Example
\`\`\`javascript
// No parameters
() => console.log('Hi')

// One parameter
x => x * 2

// Multiple parameters
(x, y) => x + y
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Advanced Arrow Patterns',
    description: `# Advanced Arrow Patterns

Implement advanced composition logic using arrow functions and functional chaining.

## Requirements
1. Create reusable compose or pipe function
2. Use arrow function for cleaner code

## Example
\`\`\`javascript
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Currying with Arrow Functions',
    description: `# Currying with Arrow Functions

Use arrow functions to create a curried version of a sum function.

## Requirements
1. Return functions in each step
2. Final call should compute the result

## Example
\`\`\`javascript
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Arrow Functions Inside setTimeout',
    description: `# Arrow Functions Inside setTimeout

Refactor setTimeout-based callbacks using arrow functions and understand their lexical \`this\`.

## Requirements
1. Use arrow inside setTimeout to preserve outer \`this\`
2. Compare with function expressions

## Example
\`\`\`javascript
function Timer() {
  this.time = 0;
  setTimeout(() => {
    console.log(this.time); // refers to Timer object
  }, 1000);
}
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Arrays': [
  {
    title: 'Array Transformation',
    description: `# Array Transformation

Implement basic transformation utilities for arrays using custom implementations.

## Requirements
1. Custom \`map\` that applies a function to each element
2. Custom \`filter\` that includes only elements passing a condition
3. Custom \`reduce\` that accumulates results

## Example
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = customMap(numbers, n => n * 2); // [2, 4, 6, 8, 10]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Array Element Frequency',
    description: `# Array Element Frequency

Create a function that calculates the frequency of each element in an array.

## Requirements
1. Return an object with element counts
2. Handle numbers and strings
3. Case-insensitive support for strings

## Example
\`\`\`javascript
frequency(['apple', 'Apple', 'banana', 'apple']); 
// { apple: 3, banana: 1 }
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Remove Duplicates from Array',
    description: `# Remove Duplicates from Array

Create a function that removes duplicate elements from an array.

## Requirements
1. Maintain original order
2. Do not use Set
3. Works for primitive types only

## Example
\`\`\`javascript
removeDuplicates([1, 2, 2, 3, 1]); // [1, 2, 3]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Array Operations',
    description: `# Array Operations

Recreate native array methods like \`push\`, \`pop\`, \`shift\`, and \`unshift\` without using built-in methods.

## Requirements
1. Use plain JavaScript logic
2. Add/remove items from start/end of array
3. Track array length manually

## Example
\`\`\`javascript
const arr = createArray();
arr.customPush(10);
arr.customPush(20);
arr.customShift(); // Removes first item
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Array Chunking',
    description: `# Array Chunking

Create a function that splits an array into smaller arrays of a given size.

## Requirements
1. Preserve original order
2. Handle edge cases (e.g., uneven split)

## Example
\`\`\`javascript
chunk([1,2,3,4,5], 2); // [[1,2], [3,4], [5]]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Array Zipping',
    description: `# Array Zipping

Implement a zip function that combines two arrays by index into an array of pairs.

## Requirements
1. Stop at shortest array length
2. Return an array of 2-element arrays

## Example
\`\`\`javascript
zip(['a', 'b'], [1, 2, 3]); // [['a', 1], ['b', 2]]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Advanced Array Methods',
    description: `# Advanced Array Methods

Implement utility functions for common advanced array use-cases.

## Requirements
1. Flatten deeply nested arrays
2. Group array of objects by a property
3. Custom sort by value or key

## Example
\`\`\`javascript
flatten([1, [2, 3], [4, [5, 6]]]); // [1, 2, 3, 4, 5, 6]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Multi-level Array Merge',
    description: `# Multi-level Array Merge

Merge multiple arrays of objects and group them by a key (like \`id\`), combining values where needed.

## Requirements
1. Combine object arrays by a shared property
2. Merge properties of matching items
3. Use reduce or map internally

## Example
\`\`\`javascript
mergeById([
  [{ id: 1, name: 'A' }],
  [{ id: 1, score: 10 }, { id: 2, name: 'B' }]
]);
// Output: [{ id: 1, name: 'A', score: 10 }, { id: 2, name: 'B' }]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Sliding Window Maximum',
    description: `# Sliding Window Maximum

Given an array and a window size, return an array of the maximums of each sliding window.

## Requirements
1. Return array of max in each window
2. Use a deque or optimize beyond O(n²)
3. Works on integers only

## Example
\`\`\`javascript
slidingWindowMax([1,3,-1,-3,5,3,6,7], 3); 
// [3,3,5,5,6,7]
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Key-Value Pairs': [
  {
    title: 'Dictionary Operations',
    description: `# Dictionary Operations

Create a simple Dictionary class to manage key-value pairs.

## Requirements
1. Add a new key-value pair
2. Remove a key
3. Update the value of an existing key
4. Clear all dictionary entries

## Example
\`\`\`javascript
const dict = new Dictionary();
dict.add('name', 'Alice');
dict.update('name', 'Bob');
dict.remove('name');
dict.clear();
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Object Key Manipulation',
    description: `# Object Key Manipulation

Write utility functions to interact with keys of a JavaScript object.

## Requirements
1. Return an array of keys
2. Check if a key exists
3. Count total keys

## Example
\`\`\`javascript
getKeys({ a: 1, b: 2 }); // ['a', 'b']
hasKey({ a: 1 }, 'a'); // true
countKeys({ a: 1, b: 2, c: 3 }); // 3
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Invert Key-Value Pair',
    description: `# Invert Key-Value Pair

Create a function that inverts keys and values of an object.

## Requirements
1. All values must be stringifiable
2. Return a new object

## Example
\`\`\`javascript
invert({ a: '1', b: '2' }); // { '1': 'a', '2': 'b' }
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Cache Implementation',
    description: `# Cache Implementation

Design a basic cache system using JavaScript objects.

## Requirements
1. Set and retrieve key-value pairs
2. Allow setting expiration in seconds
3. Auto-expire keys when accessed after timeout
4. Handle fixed-size cache limit (evict LRU)

## Example
\`\`\`javascript
const cache = new Cache();
cache.set('user1', 'data', 60); // Expires in 60s
cache.get('user1'); // Returns 'data'
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Group By Key',
    description: `# Group By Key

Write a function that groups an array of objects by a specific key.

## Requirements
1. Use a JavaScript object as a grouping map
2. Support dynamic grouping key

## Example
\`\`\`javascript
groupBy([{ type: 'fruit', name: 'apple' }, { type: 'fruit', name: 'banana' }, { type: 'vegetable', name: 'carrot' }], 'type');
// Output: { fruit: [...], vegetable: [...] }
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Key Frequency Counter',
    description: `# Key Frequency Counter

Count how many times each key appears across multiple objects in an array.

## Requirements
1. Merge keys and track frequency
2. Ignore missing or null values

## Example
\`\`\`javascript
const input = [{ a: 1, b: 2 }, { a: 3, c: 4 }, { b: 5 }];
countKeyFrequency(input); 
// Output: { a: 2, b: 2, c: 1 }
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Implement HashMap',
    description: `# Implement HashMap

Build a custom HashMap class with basic functionalities.

## Requirements
1. Set and retrieve key-value pairs
2. Handle collisions via separate chaining or open addressing
3. Support delete operation
4. Store string keys efficiently

## Example
\`\`\`javascript
const map = new HashMap();
map.set('key1', 'value1');
map.get('key1'); // 'value1'
map.delete('key1');
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Nested Key Accessor',
    description: `# Nested Key Accessor

Write a utility that accesses deeply nested keys in an object using a dot-path string.

## Requirements
1. Return value at provided path or default
2. Avoid crashing on undefined paths

## Example
\`\`\`javascript
getDeep(obj, 'user.address.city', 'N/A');
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'LRU Cache Class',
    description: `# LRU Cache Class

Create an LRU (Least Recently Used) cache with a fixed capacity using a Map or custom logic.

## Requirements
1. Track recently used keys
2. Evict the least recently used key when capacity exceeds
3. Get and set operations

## Example
\`\`\`javascript
const cache = new LRUCache(2);
cache.set('a', 1);
cache.set('b', 2);
cache.get('a'); // 1
cache.set('c', 3); // Evicts 'b'
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Linked List': [
  {
    title: 'Circular Linked List',
    description: `# Circular Linked List

Implement a circular linked list data structure.

## Requirements
1. Support inserting nodes (at head and tail)
2. Detect cycle in the list
3. Support deletion of a specific value
4. Looping through the list should not crash

## Example
\`\`\`javascript
const list = new CircularList();
list.insert(1);
list.insert(2);
list.hasCycle(); // true (circular reference check)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Find Middle of Linked List',
    description: `# Find Middle of Linked List

Write a function to return the middle node of a singly linked list.

## Requirements
1. Use the slow and fast pointer technique
2. Return node or value
3. Handle edge cases like empty list or one node

## Example
\`\`\`javascript
const list = new LinkedList();
list.insert(1);
list.insert(2);
list.insert(3);
findMiddle(list.head); // returns 2
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Detect Loop in Linked List',
    description: `# Detect Loop in Linked List

Check if a linked list contains a cycle using Floyd's Cycle Detection Algorithm.

## Requirements
1. Use fast and slow pointer method
2. Return true if loop is detected

## Example
\`\`\`javascript
const list = new LinkedList();
list.insert(1);
list.insert(2);
// Manually create a cycle for testing
list.head.next.next = list.head;
hasCycle(list.head); // true
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Singly Linked List',
    description: `# Singly Linked List

Implement a singly linked list with common operations.

## Requirements
1. Insert node at head or tail
2. Delete node by value
3. Search node by value
4. Reverse the list iteratively

## Example
\`\`\`javascript
const list = new LinkedList();
list.insert(1);
list.insert(2);
list.delete(1);
list.reverse();
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Merge Two Sorted Linked Lists',
    description: `# Merge Two Sorted Linked Lists

Merge two sorted singly linked lists into one sorted list.

## Requirements
1. Handle edge cases (one empty, both empty)
2. Return merged head
3. Maintain sorting order

## Example
\`\`\`javascript
mergeLists(list1.head, list2.head); // returns head of merged list
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Remove Duplicates in Linked List',
    description: `# Remove Duplicates in Linked List

Remove duplicate values from a sorted linked list.

## Requirements
1. Traverse and skip duplicate values
2. Maintain original relative order
3. Update list in-place

## Example
\`\`\`javascript
removeDuplicatesFromList([1, 1, 2, 3, 3]); // [1, 2, 3]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Doubly Linked List',
    description: `# Doubly Linked List

Create a doubly linked list with full CRUD operations.

## Requirements
1. Insert at head and tail
2. Remove from head and tail
3. Traverse forward and backward
4. Search from either direction

## Example
\`\`\`javascript
const list = new DoublyLinkedList();
list.insertAtHead(1);
list.insertAtTail(2);
list.traverseForward(); // [1, 2]
list.traverseBackward(); // [2, 1]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Reverse Linked List Recursively',
    description: `# Reverse Linked List Recursively

Reverse a singly linked list using recursion.

## Requirements
1. Use recursion (not iteration)
2. Return new head
3. Handle base cases

## Example
\`\`\`javascript
reverseRecursive(head); // returns head of reversed list
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'LRU Cache with Linked List',
    description: `# LRU Cache with Linked List

Implement a Least Recently Used (LRU) cache using a doubly linked list and a hash map.

## Requirements
1. O(1) get and put operations
2. Use doubly linked list to track order
3. Evict least recently used item on overflow

## Example
\`\`\`javascript
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1); // returns 1
cache.put(3, 3); // evicts key 2
cache.get(2); // returns -1
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Sorting': [
  {
    title: 'Bubble Sort',
    description: `# Bubble Sort

Implement the classic bubble sort algorithm to sort an array of numbers.

## Requirements
1. Swap adjacent elements to sort
2. Optimize for early exit if array is already sorted
3. Track total number of comparisons

## Example
\`\`\`javascript
bubbleSort([64, 34, 25, 12, 22, 11, 90]); 
// Output: [11, 12, 22, 25, 34, 64, 90]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Selection Sort',
    description: `# Selection Sort

Implement the selection sort algorithm.

## Requirements
1. Find the smallest element and move to front
2. Perform in-place sorting
3. Track number of swaps made

## Example
\`\`\`javascript
selectionSort([5, 3, 6, 2, 10]); 
// Output: [2, 3, 5, 6, 10]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Insertion Sort',
    description: `# Insertion Sort

Implement insertion sort for sorting numbers in ascending order.

## Requirements
1. Shift elements to insert unsorted element at correct position
2. Work well on small or nearly sorted arrays
3. In-place sorting

## Example
\`\`\`javascript
insertionSort([8, 4, 2, 9]); 
// Output: [2, 4, 8, 9]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Merge Sort Implementation',
    description: `# Merge Sort Implementation

Implement merge sort using the divide and conquer approach.

## Requirements
1. Recursively divide the array
2. Merge sorted halves into final sorted array
3. Space complexity should be discussed

## Example
\`\`\`javascript
mergeSort([3, 1, 4, 1, 5, 9, 2]); 
// Output: [1, 1, 2, 3, 4, 5, 9]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Sort By Object Property',
    description: `# Sort By Object Property

Sort an array of objects based on a given numeric or string property.

## Requirements
1. Use comparison logic
2. Sort in ascending or descending order based on flag
3. Do not mutate original array (return new one)

## Example
\`\`\`javascript
sortByProperty([{ age: 30 }, { age: 20 }], 'age');
// Output: [{ age: 20 }, { age: 30 }]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Stable Sort by Multiple Keys',
    description: `# Stable Sort by Multiple Keys

Sort a list of objects first by one key, then another (e.g., sort by age, then name).

## Requirements
1. Prioritize sort keys in given order
2. Maintain stability
3. Return sorted array

## Example
\`\`\`javascript
multiKeySort([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 25 },
  { name: 'Alice', age: 22 }
], ['name', 'age']);
// Output: sorted by name, then by age
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Implement Quick Sort',
    description: `# Implement Quick Sort

Write a recursive quick sort function using a pivot strategy.

## Requirements
1. Choose a pivot (e.g., middle or random)
2. Partition into less-than and greater-than arrays
3. Return sorted array

## Example
\`\`\`javascript
quickSort([3, 1, 4, 1, 5, 9]); 
// Output: [1, 1, 3, 4, 5, 9]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Counting Sort',
    description: `# Counting Sort

Implement the counting sort algorithm for non-negative integers.

## Requirements
1. Use frequency array to count occurrences
2. Reconstruct sorted array from frequencies
3. Only works for integers in known range

## Example
\`\`\`javascript
countingSort([4, 2, 2, 8, 3, 3, 1]); 
// Output: [1, 2, 2, 3, 3, 4, 8]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Sort Nearly Sorted Array',
    description: `# Sort Nearly Sorted Array

Given an array where each element is at most k positions away from its sorted position, sort the array efficiently.

## Requirements
1. Use a min-heap or priority queue
2. Optimize for O(n log k)
3. Return sorted array

## Example
\`\`\`javascript
sortNearlySorted([6, 5, 3, 2, 8, 10, 9], 3); 
// Output: [2, 3, 5, 6, 8, 9, 10]
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Recursive algos': [
// EASY
  {
    title: 'Fibonacci Sequence',
    description: `# Fibonacci Sequence

Implement a recursive function to compute the nth Fibonacci number.

## Requirements
1. Use basic recursion
2. Return 0 for n = 0, and 1 for n = 1
3. Optimize using memoization (optional)

## Example
\`\`\`javascript
fibonacci(10); // Returns 55
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Factorial Calculator',
    description: `# Factorial Calculator

Write a recursive function to calculate the factorial of a number.

## Requirements
1. Base case: factorial(0) = 1
2. Recursive case: n * factorial(n - 1)

## Example
\`\`\`javascript
factorial(5); // Returns 120
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Sum of Array Elements',
    description: `# Sum of Array Elements

Recursively calculate the sum of all elements in an array.

## Requirements
1. Handle empty arrays
2. Do not use loops

## Example
\`\`\`javascript
sumArray([1, 2, 3, 4]); // Returns 10
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Reverse a String',
    description: `# Reverse a String

Use recursion to reverse a string.

## Requirements
1. Do not use built-in reverse
2. Base + recursive step

## Example
\`\`\`javascript
reverse("hello"); // "olleh"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Count Digits of a Number',
    description: `# Count Digits of a Number

Write a recursive function to count the number of digits in a positive integer.

## Requirements
1. Do not use string conversion
2. Base: single digit number

## Example
\`\`\`javascript
countDigits(1234); // 4
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Print Natural Numbers',
    description: `# Print Natural Numbers

Use recursion to print all natural numbers up to n.

## Requirements
1. Use console.log
2. Ascending order

## Example
\`\`\`javascript
printNumbers(5); // 1 2 3 4 5
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Check Palindrome',
    description: `# Check Palindrome

Check if a string is a palindrome using recursion.

## Requirements
1. Ignore casing
2. Base + recursive comparison

## Example
\`\`\`javascript
isPalindrome("madam"); // true
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Power of a Number',
    description: `# Power of a Number

Calculate a^b using recursion.

## Requirements
1. Base: a^0 = 1
2. Recursive multiplication

## Example
\`\`\`javascript
power(2, 3); // 8
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Find Maximum in Array',
    description: `# Find Maximum in Array

Use recursion to find the largest element in an array.

## Requirements
1. Compare elements recursively
2. Handle base case for single-element arrays

## Example
\`\`\`javascript
findMax([1, 4, 3, 7, 2]); // 7
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Tree Traversal',
    description: `# Tree Traversal

Implement recursive traversal methods for a binary tree.

## Requirements
1. Inorder traversal
2. Preorder traversal
3. Postorder traversal

## Example
\`\`\`javascript
inorderTraversal(root);
preorderTraversal(root);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Generate All Subsets',
    description: `# Generate All Subsets

Generate all subsets (power set) of a given array recursively.

## Requirements
1. Include/exclude pattern
2. Return array of subsets

## Example
\`\`\`javascript
generateSubsets([1, 2]);
// [[], [1], [2], [1,2]]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Permutations of String',
    description: `# Permutations of String

Recursively generate all permutations of a string.

## Requirements
1. Track visited characters
2. Avoid duplicates

## Example
\`\`\`javascript
permute("abc");
// ["abc", "acb", "bac", "bca", "cab", "cba"]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Decimal to Binary',
    description: `# Decimal to Binary

Convert a number to binary using recursion.

## Requirements
1. Return a string
2. Use % and floor division

## Example
\`\`\`javascript
decimalToBinary(5); // "101"
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Flatten Nested Array',
    description: `# Flatten Nested Array

Recursively flatten an arbitrarily nested array.

## Requirements
1. Avoid Array.flat
2. Handle multiple nested levels

## Example
\`\`\`javascript
flatten([1, [2, [3, 4]], 5]);
// [1, 2, 3, 4, 5]
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Sum of Digits',
    description: `# Sum of Digits

Calculate the sum of digits in a number using recursion.

## Requirements
1. Do not convert number to string
2. Use % and floor division

## Example
\`\`\`javascript
sumDigits(123); // 6
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Count Ways to Climb Stairs',
    description: `# Count Ways to Climb Stairs

Given n steps, count the number of distinct ways to reach the top by taking 1 or 2 steps at a time.

## Requirements
1. Use recursion
2. Optimize with memoization

## Example
\`\`\`javascript
climbStairs(4); // 5
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'GCD (Euclidean Algorithm)',
    description: `# GCD (Euclidean Algorithm)

Find the greatest common divisor (GCD) of two numbers using recursion.

## Requirements
1. Use Euclidean algorithm
2. Base: GCD(a, 0) = a

## Example
\`\`\`javascript
gcd(24, 36); // 12
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Remove Kth Element',
    description: `# Remove Kth Element

Recursively remove the kth element from an array.

## Requirements
1. Return new array without kth element
2. Do not mutate original array

## Example
\`\`\`javascript
removeKth([1, 2, 3, 4], 2); // [1, 2, 4]
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Backtracking Problems',
    description: `# Backtracking Problems

Implement solutions using recursive backtracking.

## Requirements
1. N-Queens problem
2. Sudoku solver
3. Valid combinations/pathfinding

## Example
\`\`\`javascript
solveNQueens(4); // Returns valid boards
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Maze Solver',
    description: `# Maze Solver

Find a path from start to end in a 2D maze using recursion.

## Requirements
1. Return boolean grid of valid path
2. Avoid obstacles (0s), follow allowed path (1s)

## Example
\`\`\`javascript
solveMaze(maze); // returns path matrix
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Word Search in Grid',
    description: `# Word Search in Grid

Determine if a word exists in a 2D grid of letters using recursion and backtracking.

## Requirements
1. Allow movement in 4 directions
2. Letters must be adjacent

## Example
\`\`\`javascript
exist(board, "WORD"); // true/false
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Generate Valid Parentheses',
    description: `# Generate Valid Parentheses

Generate all combinations of n pairs of valid parentheses using recursion.

## Requirements
1. Track open and close counts
2. Ensure parentheses are valid

## Example
\`\`\`javascript
generateParentheses(3);
// ["((()))", "(()())", "(())()", "()(())", "()()()"]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Recursive Merge Sort',
    description: `# Recursive Merge Sort

Implement merge sort recursively.

## Requirements
1. Split array into halves
2. Merge sorted subarrays

## Example
\`\`\`javascript
mergeSort([5, 2, 4, 1]);
// [1, 2, 4, 5]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Recursive Subset Sum',
    description: `# Recursive Subset Sum

Determine if a subset exists that adds up to target.

## Requirements
1. Return true if such subset exists
2. Use recursion + backtracking

## Example
\`\`\`javascript
subsetSum([3, 4, 5], 9); // true
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'K-th Symbol in Grammar',
    description: `# K-th Symbol in Grammar

Given row N, find the K-th symbol using recursive pattern building.

## Requirements
1. Build rules: 0 -> 01, 1 -> 10
2. Do not build full rows

## Example
\`\`\`javascript
kthGrammar(4, 5); // 1
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'All Binary Strings of N Bits',
    description: `# All Binary Strings of N Bits

Print all binary strings of length N using recursion.

## Requirements
1. Base: when N = 0
2. Recurse with "0" and "1"

## Example
\`\`\`javascript
generateBinary(2);
// ["00", "01", "10", "11"]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Rat in a Maze – All Paths',
    description: `# Rat in a Maze – All Paths

Return all possible paths for a rat to reach from top-left to bottom-right in a maze grid.

## Requirements
1. Use recursion + backtracking
2. Return array of strings (directions like "DRDR")

## Example
\`\`\`javascript
findPaths(maze);
// ["DRDR", "RRDD", ...]
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'useEffect': [
// EASY
  {
    title: 'Simple Timer',
    description: `# Simple Timer

Implement a basic timer using the \`useEffect\` hook.

## Requirements
1. Start counting seconds after component mounts
2. Use \`setInterval\` inside \`useEffect\`
3. Clean up interval on unmount

## Example
\`\`\`javascript
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer);
}, []);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Event Listener on Mount',
    description: `# Event Listener on Mount

Add a window resize event listener using \`useEffect\`.

## Requirements
1. Log the window width on resize
2. Set up event on mount
3. Remove event on unmount

## Example
\`\`\`javascript
useEffect(() => {
  const onResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Document Title Updater',
    description: `# Document Title Updater

Update the document title with a counter using \`useEffect\`.

## Requirements
1. Listen to a state variable
2. Update title whenever it changes

## Example
\`\`\`javascript
useEffect(() => {
  document.title = \`Clicked \${count} times\`;
}, [count]);
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Data Fetching',
    description: `# Data Fetching with useEffect

Fetch data from an API on component mount.

## Requirements
1. Show loading state
2. Catch and display errors
3. Clean up on unmount

## Example
\`\`\`javascript
useEffect(() => {
  let isMounted = true;
  fetchData().then(data => {
    if (isMounted) setData(data);
  });
  return () => { isMounted = false };
}, []);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Conditional Effect Execution',
    description: `# Conditional Effect Execution

Run \`useEffect\` only when a certain prop changes.

## Requirements
1. Avoid unnecessary reruns
2. Update effect based on specific dependency

## Example
\`\`\`javascript
useEffect(() => {
  console.log("name changed");
}, [name]);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Dependent State Synchronization',
    description: `# Dependent State Synchronization

Synchronize one state with another using \`useEffect\`.

## Requirements
1. Derive value from other state
2. Avoid infinite loop

## Example
\`\`\`javascript
useEffect(() => {
  setTotal(price * quantity);
}, [price, quantity]);
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Subscription Management',
    description: `# Subscription Management

Manage a WebSocket or custom subscription using \`useEffect\`.

## Requirements
1. Subscribe on mount
2. Unsubscribe on unmount
3. Handle dependency cleanup

## Example
\`\`\`javascript
useEffect(() => {
  const socket = subscribeToChannel("chat");
  return () => socket.unsubscribe();
}, []);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Polling with Cleanup',
    description: `# Polling with Cleanup

Implement polling every X seconds using \`useEffect\`.

## Requirements
1. Fetch data every interval
2. Clear interval on unmount
3. Avoid memory leaks

## Example
\`\`\`javascript
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'useEffect with AbortController',
    description: `# useEffect with AbortController

Use \`AbortController\` to cancel fetch on unmount.

## Requirements
1. Attach controller to fetch
2. Abort on cleanup
3. Handle abort error separately

## Example
\`\`\`javascript
useEffect(() => {
  const controller = new AbortController();
  fetch('/api', { signal: controller.signal })
    .catch(err => {
      if (err.name !== "AbortError") console.error(err);
    });
  return () => controller.abort();
}, []);
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'useState': [
// EASY
  {
    title: 'Counter Component',
    description: `# Counter Component

Create a simple counter using the \`useState\` hook.

## Requirements
1. Increment and decrement
2. Reset functionality
3. Optional step size
4. Add min and max constraints

## Example
\`\`\`javascript
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Toggle Button',
    description: `# Toggle Button

Create a button that toggles between "ON" and "OFF".

## Requirements
1. Maintain boolean state
2. Display state in UI
3. Use \`useState\` for toggle logic

## Example
\`\`\`javascript
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  return <button onClick={() => setIsOn(!isOn)}>{isOn ? 'ON' : 'OFF'}</button>;
}
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Input Binding',
    description: `# Input Binding

Create a text input that updates its value in state and displays it live.

## Requirements
1. Bind input to state
2. Display current value
3. Clear input button

## Example
\`\`\`javascript
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Form Management',
    description: `# Form Management

Manage multiple form fields using \`useState\`.

## Requirements
1. Track \`name\` and \`email\` fields
2. Validate fields on submit
3. Reset form on success

## Example
\`\`\`javascript
const [formData, setFormData] = useState({ name: '', email: '' });
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Manage Checkbox Group',
    description: `# Manage Checkbox Group

Use \`useState\` to manage a group of checkboxes.

## Requirements
1. Track checked values in array
2. Handle checking/unchecking
3. Display selected values

## Example
\`\`\`javascript
const [selected, setSelected] = useState([]);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Tab Switcher',
    description: `# Tab Switcher

Implement a simple tab UI with \`useState\`.

## Requirements
1. Maintain active tab index
2. Show different content per tab
3. Highlight active tab

## Example
\`\`\`javascript
const [activeTab, setActiveTab] = useState(0);
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Complex State Logic',
    description: `# Complex State Logic

Manage complex object and array-based state using \`useState\`.

## Requirements
1. Update nested objects
2. Add/remove from arrays
3. Use functional updates when needed

## Example
\`\`\`javascript
const [state, setState] = useState({ users: [], settings: {} });
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Dynamic Form Builder',
    description: `# Dynamic Form Builder

Build a dynamic form using state arrays to add or remove fields.

## Requirements
1. Use array state
2. Add and remove input fields
3. Update field values

## Example
\`\`\`javascript
const [fields, setFields] = useState([{ value: '' }]);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Undo/Redo State',
    description: `# Undo/Redo State

Implement undo and redo for a basic text editor using \`useState\`.

## Requirements
1. Maintain history stack
2. Undo last change
3. Redo undone change

## Example
\`\`\`javascript
const [history, setHistory] = useState([]);
const [current, setCurrent] = useState('');
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'contextAPI': [
// EASY
  {
    title: 'Language Switcher',
    description: `# Language Switcher

Implement a basic language switcher using the Context API.

## Requirements
1. Create a language context
2. Provide default language
3. Allow switching languages from a dropdown
4. Consume and display current language

## Example
\`\`\`javascript
const LanguageContext = React.createContext();
function useTranslation() { return useContext(LanguageContext); }
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'User Context Basic',
    description: `# User Context Basic

Create a simple UserContext to share username across components.

## Requirements
1. Store username in context
2. Provide context to all children
3. Consume in any nested component

## Example
\`\`\`javascript
const UserContext = React.createContext();
function useUser() { return useContext(UserContext); }
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Toggle Feature Flag',
    description: `# Toggle Feature Flag

Use Context API to toggle a feature flag across your app.

## Requirements
1. FeatureFlagContext with default values
2. Provider with toggle functionality
3. Conditionally render components

## Example
\`\`\`javascript
const FeatureContext = React.createContext();
<FeatureProvider><SomeComponent /></FeatureProvider>
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Theme Provider',
    description: `# Theme Provider

Implement light/dark mode switching using Context API.

## Requirements
1. Provide theme context and toggle
2. Change class/style based on theme
3. Persist preference (optional)

## Example
\`\`\`javascript
const ThemeContext = React.createContext();
function ThemeProvider({ children }) {
  // Implementation
}
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Notification Context',
    description: `# Notification Context

Create a global notification (toast) system using Context API.

## Requirements
1. Expose \`showToast()\` method
2. Maintain list of toasts
3. Auto-dismiss logic

## Example
\`\`\`javascript
const NotificationContext = React.createContext();
useNotification().showToast("Saved!");
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Cart State Context',
    description: `# Cart State Context

Manage cart state globally using Context API.

## Requirements
1. Add/remove items to cart
2. Persist cart count
3. Update cart across unrelated components

## Example
\`\`\`javascript
const CartContext = React.createContext();
const { addItem } = useCart();
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Authentication Context',
    description: `# Authentication Context

Implement full authentication flow using Context API.

## Requirements
1. Provide auth state and user info
2. Implement \`login\`, \`logout\` methods
3. Handle protected routes
4. Store token (optional)

## Example
\`\`\`javascript
const AuthContext = React.createContext();
function useAuth() { return useContext(AuthContext); }
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Multi-Context Composition',
    description: `# Multi-Context Composition

Build a system using multiple contexts: theme, auth, and language.

## Requirements
1. Compose providers using a wrapper
2. Consume all 3 contexts in a component
3. Organize context files

## Example
\`\`\`javascript
<AuthProvider><ThemeProvider><LangProvider>...</LangProvider></ThemeProvider></AuthProvider>
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Dynamic Context Loader',
    description: `# Dynamic Context Loader

Load context dynamically based on external config or environment.

## Requirements
1. Switch between different context providers based on runtime
2. Dynamically select context implementation
3. Useful for plugin architecture or environments

## Example
\`\`\`javascript
const AppProvider = IS_ENTERPRISE ? EnterpriseContext : DefaultContext;
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Routing': [
// EASY
  {
    title: 'Basic Navigation',
    description: `# Basic Navigation

Set up basic navigation using React Router.

## Requirements
1. Define routes using \`<Routes>\` and \`<Route>\`
2. Add \`<Link>\` navigation
3. Handle unmatched routes using fallback
4. Add a default redirect (optional)

## Example
\`\`\`javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} />
</Routes>
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Active Link Styling',
    description: `# Active Link Styling

Highlight the currently active navigation link.

## Requirements
1. Use \`<NavLink>\` to style active link
2. Apply active class or inline styles
3. Test for multiple routes

## Example
\`\`\`javascript
<NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Route Redirect',
    description: `# Route Redirect

Redirect from one route to another on load.

## Requirements
1. Use \`<Navigate />\` for redirection
2. Redirect from "/" to "/home"
3. Optional: delay redirection via effect

## Example
\`\`\`javascript
<Route path="/" element={<Navigate to="/home" />} />
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Dynamic Routes',
    description: `# Dynamic Routes

Implement routing with dynamic path segments.

## Requirements
1. Use \`:id\` or \`:slug\` in route
2. Extract params using \`useParams()\`
3. Render data based on param

## Example
\`\`\`javascript
<Route path="/user/:id" element={<User />} />
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Nested Routes',
    description: `# Nested Routes

Build a parent-child route structure with nested layout.

## Requirements
1. Parent route with shared layout
2. Use \`<Outlet />\` for nested views
3. Nest children in route config

## Example
\`\`\`javascript
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="overview" element={<Overview />} />
  <Route path="settings" element={<Settings />} />
</Route>
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Search Params & Filters',
    description: `# Search Params & Filters

Implement filtering using URL query parameters.

## Requirements
1. Use \`useSearchParams()\` to read/write query strings
2. Filter a list based on param value
3. Reflect state in the URL

## Example
\`\`\`javascript
const [params, setParams] = useSearchParams();
const sort = params.get("sort");
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Protected Routes',
    description: `# Protected Routes

Implement a route guard to protect pages based on authentication.

## Requirements
1. Check auth state
2. Redirect unauthenticated users to login
3. Allow access to private route otherwise

## Example
\`\`\`javascript
function ProtectedRoute({ children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Route-Based Code Splitting',
    description: `# Route-Based Code Splitting

Lazy load route components using React's \`lazy\` and \`Suspense\`.

## Requirements
1. Use \`React.lazy()\` for importing components
2. Wrap routes in \`<Suspense>\`
3. Show loading fallback

## Example
\`\`\`javascript
const About = React.lazy(() => import('./About'));
<Route path="/about" element={<Suspense fallback={<Loading />}><About /></Suspense>} />
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Scroll Restoration on Navigation',
    description: `# Scroll Restoration on Navigation

Ensure page scroll resets to top on route change.

## Requirements
1. Use a custom \`<ScrollToTop />\` component
2. Hook into route change using \`useLocation()\`
3. Reset scroll via \`window.scrollTo\`

## Example
\`\`\`javascript
useEffect(() => {
  window.scrollTo(0, 0);
}, [location.pathname]);
\`\`\`
`,
    difficulty: 'hard'
  }
], 
'Optimization': [
// EASY
  {
    title: 'Basic useMemo Usage',
    description: `# Basic useMemo Usage

Use \`useMemo\` to avoid recomputing a derived value unnecessarily.

## Requirements
1. Compute a derived value (e.g., filtered array)
2. Recompute only when dependencies change

## Example
\`\`\`javascript
const filtered = useMemo(() => items.filter(i => i.active), [items]);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Memoized Expensive Function',
    description: `# Memoized Expensive Function

Wrap an expensive calculation in \`useMemo\`.

## Requirements
1. Expensive computation (e.g., factorial)
2. Avoid recalculation on unrelated state updates

## Example
\`\`\`javascript
const result = useMemo(() => factorial(n), [n]);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Simple useCallback Handler',
    description: `# Simple useCallback Handler

Use \`useCallback\` to memoize a function passed to child component.

## Requirements
1. Function defined in parent
2. Memoize it to avoid re-renders

## Example
\`\`\`javascript
const handleClick = useCallback(() => console.log("clicked"), []);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'React.memo Basic Usage',
    description: `# React.memo Basic Usage

Use \`React.memo\` to prevent re-renders of a pure component.

## Requirements
1. Create a stateless component
2. Wrap with \`React.memo()\`
3. Validate that parent re-renders don’t affect it

## Example
\`\`\`javascript
const MemoButton = React.memo(Button);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Avoid Unnecessary Computation',
    description: `# Avoid Unnecessary Computation

Move a computation outside the component body using \`useMemo\`.

## Requirements
1. Only compute when a specific prop changes
2. Avoid recomputing on unrelated prop changes

## Example
\`\`\`javascript
const doubled = useMemo(() => value * 2, [value]);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Inline vs useCallback',
    description: `# Inline vs useCallback

Compare an inline function vs a memoized version to see the re-render effect.

## Requirements
1. Pass both to \`React.memo\` child
2. Show re-render difference

## Example
\`\`\`javascript
const handleClick = useCallback(() => increment(), []);
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Memoized Sorting',
    description: `# Memoized Sorting

Use \`useMemo\` to sort a list only when it changes.

## Requirements
1. Avoid re-sorting on unrelated renders
2. Keep original array unmodified

## Example
\`\`\`javascript
const sorted = useMemo(() => [...items].sort(), [items]);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'useCallback in Form Inputs',
    description: `# useCallback in Form Inputs

Use \`useCallback\` to prevent unnecessary input re-renders.

## Requirements
1. Input handler must not recreate on each render
2. Used inside controlled form

## Example
\`\`\`javascript
const handleChange = useCallback(e => setName(e.target.value), []);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Parent-Child Optimization',
    description: `# Parent-Child Optimization

Use \`React.memo\` and \`useCallback\` to prevent child re-renders on parent updates.

## Requirements
1. Parent has unrelated state updates
2. Child should not re-render

## Example
\`\`\`javascript
const Child = React.memo(({ onClick }) => { ... });
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Avoid Re-render with useMemo',
    description: `# Avoid Re-render with useMemo

Prevent re-renders caused by passing a computed prop to a memoized component.

## Requirements
1. Pass memoized derived data
2. Child must be wrapped in \`React.memo\`

## Example
\`\`\`javascript
const derived = useMemo(() => compute(data), [data]);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Memoize Component Tree',
    description: `# Memoize Component Tree

Wrap deeply nested components in \`React.memo\` and use stable props with \`useCallback\` and \`useMemo\`.

## Requirements
1. Avoid unnecessary re-renders in complex UI
2. Extract child as separate component

## Example
\`\`\`javascript
<HeavyTree data={memoizedData} />
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Selective Memoization',
    description: `# Selective Memoization

Memoize only parts of a component that benefit from it.

## Requirements
1. Identify expensive parts
2. Use \`React.memo\` and \`useMemo\` selectively

## Example
\`\`\`javascript
const Chart = React.memo(() => renderChart(data));
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Custom Comparison in React.memo',
    description: `# Custom Comparison in React.memo

Use custom \`areEqual\` function with \`React.memo\` to control updates.

## Requirements
1. Compare nested props manually
2. Optimize deep comparison

## Example
\`\`\`javascript
React.memo(Component, (prev, next) => isEqual(prev.config, next.config));
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Memoization with Dynamic Keys',
    description: `# Memoization with Dynamic Keys

Use \`useMemo\` to memoize computed values for dynamic inputs (e.g., filter, groupBy).

## Requirements
1. Efficient recalculation
2. Avoid stale data with correct deps

## Example
\`\`\`javascript
const grouped = useMemo(() => groupBy(data, key), [data, key]);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Prevent Prop Drilling with Memo',
    description: `# Prevent Prop Drilling with Memo

Use context + memoized components to avoid prop drilling and re-renders.

## Requirements
1. Use context in deep component
2. Prevent unnecessary updates via memoization

## Example
\`\`\`javascript
const MemoizedConsumer = React.memo(() => useContext(MyContext));
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Heavy Component Optimization',
    description: `# Heavy Component Optimization

Optimize rendering of a graph/table with hundreds of rows.

## Requirements
1. Use \`React.memo\`
2. Only render visible rows (virtualization optional)
3. Use memoized props and callbacks

## Example
\`\`\`javascript
const TableRow = React.memo(({ row }) => <tr>...</tr>);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Memoizing Class Component',
    description: `# Memoizing Class Component

Simulate memoization for class components using \`shouldComponentUpdate\`.

## Requirements
1. Prevent updates when props/state haven’t changed
2. Compare incoming props manually

## Example
\`\`\`javascript
shouldComponentUpdate(nextProps) {
  return nextProps.count !== this.props.count;
}
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Optimize Large Form',
    description: `# Optimize Large Form

Prevent re-renders of fields not affected by updates.

## Requirements
1. Break form into memoized components
2. Memoize handlers using \`useCallback\`
3. Use \`React.memo\` on each field

## Example
\`\`\`javascript
const InputField = React.memo(({ value, onChange }) => ...);
\`\`\`
`,
    difficulty: 'hard'
  }
]
, 
'Redux': [
// EASY
  {
    title: 'Counter Reducer',
    description: `# Counter Reducer

Create a simple Redux reducer to manage a counter.

## Requirements
1. Handle increment and decrement
2. Use action types: INCREMENT, DECREMENT
3. Return new state on each action

## Example
\`\`\`javascript
dispatch({ type: 'INCREMENT' });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Basic Action Creator',
    description: `# Basic Action Creator

Write action creators for counter actions.

## Requirements
1. Return action object
2. Handle optional payloads

## Example
\`\`\`javascript
const increment = () => ({ type: 'INCREMENT' });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Redux Store Setup',
    description: `# Redux Store Setup

Set up a Redux store with a single reducer.

## Requirements
1. Create root reducer
2. Pass it to \`createStore\`
3. Provide store via \`<Provider>\`

## Example
\`\`\`javascript
const store = createStore(counterReducer);
<Provider store={store}><App /></Provider>
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Connect Component to Store',
    description: `# Connect Component to Store

Use \`useSelector\` and \`useDispatch\` to connect a component to Redux.

## Requirements
1. Read state with \`useSelector\`
2. Dispatch actions with \`useDispatch\`

## Example
\`\`\`javascript
const count = useSelector(state => state.count);
const dispatch = useDispatch();
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Toggle Boolean State',
    description: `# Toggle Boolean State

Create a reducer that toggles a boolean value (e.g. isDarkMode).

## Requirements
1. Use TOGGLE action
2. Flip boolean state on every action

## Example
\`\`\`javascript
dispatch({ type: 'TOGGLE_THEME' });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Redux DevTools Integration',
    description: `# Redux DevTools Integration

Set up Redux with browser DevTools extension support.

## Requirements
1. Use \`window.__REDUX_DEVTOOLS_EXTENSION__\`
2. Verify state logging works

## Example
\`\`\`javascript
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Form State in Redux',
    description: `# Form State in Redux

Manage a login form (email, password) in Redux.

## Requirements
1. Create slice for form
2. Update form state on input change
3. Clear form on logout

## Example
\`\`\`javascript
dispatch({ type: 'UPDATE_FORM', payload: { field: 'email', value: 'abc@test.com' } });
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Todos List with Redux',
    description: `# Todos List with Redux

Create a todo list using Redux with add, delete, and toggle functionality.

## Requirements
1. Add new todos
2. Toggle completed
3. Remove by id

## Example
\`\`\`javascript
dispatch(addTodo('Learn Redux'));
dispatch(toggleTodo(2));
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Normalize State Shape',
    description: `# Normalize State Shape

Design a normalized Redux state structure for a blog app.

## Requirements
1. Separate entities by ID
2. Store references in arrays
3. Update without duplication

## Example
\`\`\`javascript
state = {
  posts: { byId: {}, allIds: [] },
  users: { byId: {}, allIds: [] }
}
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Async Action with Redux Thunk',
    description: `# Async Action with Redux Thunk

Use redux-thunk to fetch data from an API.

## Requirements
1. Dispatch loading, success, and failure
2. Fetch from URL
3. Handle errors

## Example
\`\`\`javascript
dispatch(fetchPosts());
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Redux Toolkit Slice',
    description: `# Redux Toolkit Slice

Use Redux Toolkit to create a slice with reducers and actions.

## Requirements
1. Create slice with name, initialState, reducers
2. Export actions and reducer

## Example
\`\`\`javascript
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: state => state + 1
  }
});
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Selector Composition',
    description: `# Selector Composition

Create reusable selectors for filtered data.

## Requirements
1. Compose multiple selectors
2. Use \`reselect\` or memoization

## Example
\`\`\`javascript
const selectVisibleTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => ...
);
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Redux Middleware Logger',
    description: `# Redux Middleware Logger

Write a custom Redux middleware to log actions and state.

## Requirements
1. Log every action dispatched
2. Log resulting new state
3. Use middleware signature

## Example
\`\`\`javascript
const logger = store => next => action => { ... }
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Pagination with Redux',
    description: `# Pagination with Redux

Manage paginated data with Redux.

## Requirements
1. Track current page and total pages
2. Fetch data based on page number
3. Store results in normalized format

## Example
\`\`\`javascript
dispatch(fetchPage(2));
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Redux Persist Integration',
    description: `# Redux Persist Integration

Persist part of Redux state across reloads using \`redux-persist\`.

## Requirements
1. Use \`persistReducer\`
2. Configure storage
3. Persist only selected slices

## Example
\`\`\`javascript
persistReducer(persistConfig, rootReducer)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Optimistic UI Update',
    description: `# Optimistic UI Update

Implement optimistic update with rollback on failure.

## Requirements
1. Immediately update state on user action
2. Revert if async fails
3. Use temporary IDs or cache

## Example
\`\`\`javascript
dispatch(addCommentOptimistic('Nice!'));
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Modular Feature Slice Design',
    description: `# Modular Feature Slice Design

Structure Redux slices by domain using feature-based folders.

## Requirements
1. Separate logic into domain modules
2. Dynamically inject reducers (optional)
3. Use slice-specific selectors/actions

## Example
\`\`\`javascript
features/posts/postsSlice.js
features/auth/authSlice.js
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Redux Toolkit + RTK Query Integration',
    description: `# Redux Toolkit + RTK Query Integration

Use RTK Query to fetch and cache API data.

## Requirements
1. Define endpoints using \`createApi\`
2. Use \`useGetXQuery()\` hooks in components
3. Handle loading and error states

## Example
\`\`\`javascript
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: builder => ({
    getUsers: builder.query({ query: () => '/users' })
  })
});
\`\`\`
`,
    difficulty: 'hard'
  }
]

,
  'SQL': [
// EASY
  {
    title: 'Basic CRUD',
    description: `# Basic CRUD Operations

Implement basic CRUD operations in SQL.

## Requirements
1. Insert data
2. Select data
3. Update records
4. Delete records

## Example
\`\`\`sql
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Simple SELECT',
    description: `# Simple SELECT

Query specific columns from a single table.

## Requirements
1. Select columns
2. Use WHERE clause
3. Limit results

## Example
\`\`\`sql
SELECT name, email FROM users WHERE active = true LIMIT 5;
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Sorting Results',
    description: `# Sorting Results

Sort records using ORDER BY.

## Requirements
1. Ascending and descending sorting
2. Use ORDER BY with multiple columns

## Example
\`\`\`sql
SELECT name, age FROM employees ORDER BY age DESC;
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Using BETWEEN and IN',
    description: `# Using BETWEEN and IN

Filter data using BETWEEN and IN clauses.

## Requirements
1. Use BETWEEN for numeric ranges
2. Use IN for discrete values

## Example
\`\`\`sql
SELECT * FROM orders WHERE amount BETWEEN 100 AND 500;
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'LIKE and Wildcards',
    description: `# LIKE and Wildcards

Query text columns using pattern matching.

## Requirements
1. Use % and _ wildcards
2. Combine with WHERE

## Example
\`\`\`sql
SELECT * FROM products WHERE name LIKE 'Pro%';
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Basic Aggregate Functions',
    description: `# Basic Aggregate Functions

Use COUNT, SUM, AVG, MAX, and MIN.

## Requirements
1. Simple aggregations
2. GROUP BY optional

## Example
\`\`\`sql
SELECT COUNT(*) FROM users WHERE active = true;
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'NULL Handling',
    description: `# NULL Handling

Handle NULL values in queries.

## Requirements
1. Use IS NULL and IS NOT NULL
2. Use COALESCE

## Example
\`\`\`sql
SELECT COALESCE(phone, 'N/A') FROM users;
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Simple JOIN',
    description: `# Simple JOIN

Join two related tables.

## Requirements
1. INNER JOIN
2. Use table aliases

## Example
\`\`\`sql
SELECT u.name, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id;
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'LIMIT and OFFSET',
    description: `# LIMIT and OFFSET

Paginate SQL results.

## Requirements
1. Use LIMIT and OFFSET
2. Simulate pagination

## Example
\`\`\`sql
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 20;
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Data Analysis',
    description: `# SQL Data Analysis

Write analytical SQL queries.

## Requirements
1. Window functions
2. CTEs
3. Subqueries
4. Analytics

## Example
\`\`\`sql
WITH monthly_sales AS (
  SELECT date_trunc('month', order_date) AS month,
         SUM(amount) AS total
  FROM orders
  GROUP BY 1
)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Subqueries',
    description: `# Subqueries

Use subqueries in SELECT and WHERE.

## Requirements
1. Nested SELECT
2. Scalar and correlated subqueries

## Example
\`\`\`sql
SELECT name FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Multiple Table Joins',
    description: `# Multiple Table Joins

Join more than two tables.

## Requirements
1. Use INNER JOINs
2. Combine customer, orders, products

## Example
\`\`\`sql
SELECT c.name, p.name, o.amount
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN products p ON o.product_id = p.id;
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Group By with HAVING',
    description: `# Group By with HAVING

Use GROUP BY and filter with HAVING.

## Requirements
1. Use aggregation
2. Filter groups

## Example
\`\`\`sql
SELECT customer_id, COUNT(*) 
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 3;
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Case When Logic',
    description: `# CASE WHEN Logic

Apply conditional logic with CASE.

## Requirements
1. Categorize records
2. Use multiple conditions

## Example
\`\`\`sql
SELECT name,
CASE 
  WHEN score >= 90 THEN 'A'
  WHEN score >= 75 THEN 'B'
  ELSE 'C'
END AS grade
FROM students;
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Self Join',
    description: `# Self Join

Use self join to relate rows in the same table.

## Requirements
1. Use table aliasing
2. Find hierarchical data

## Example
\`\`\`sql
SELECT e.name, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'UNION and UNION ALL',
    description: `# UNION and UNION ALL

Combine data from multiple SELECTs.

## Requirements
1. Combine data
2. Remove/keep duplicates

## Example
\`\`\`sql
SELECT name FROM customers
UNION
SELECT name FROM vendors;
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Update from Join',
    description: `# Update from Join

Update values using another table.

## Requirements
1. JOIN in UPDATE
2. Set value based on match

## Example
\`\`\`sql
UPDATE orders o
SET status = 'expired'
FROM payments p
WHERE o.id = p.order_id AND p.failed = true;
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Find Duplicates',
    description: `# Find Duplicates

Identify duplicate entries using GROUP BY.

## Requirements
1. Use HAVING with COUNT
2. Return duplicate rows only

## Example
\`\`\`sql
SELECT email, COUNT(*) 
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Complex Joins',
    description: `# Complex SQL Joins

Write SQL queries with multiple joins and aggregations.

## Requirements
1. Multiple table joins
2. Aggregation functions
3. Group by clauses
4. Having clauses

## Example
\`\`\`sql
SELECT * FROM orders
JOIN customers ON orders.customer_id = customers.id
GROUP BY customer_id
HAVING COUNT(*) > 5;
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Window Functions',
    description: `# Window Functions

Use ROW_NUMBER, RANK, and PARTITION BY.

## Requirements
1. Use OVER()
2. Rank grouped results

## Example
\`\`\`sql
SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)
FROM employees;
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Recursive CTEs',
    description: `# Recursive CTEs

Use recursive CTE to build hierarchical queries.

## Requirements
1. CTE with UNION ALL
2. Traverse hierarchical data

## Example
\`\`\`sql
WITH RECURSIVE hierarchy AS (
  SELECT id, manager_id, name FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.manager_id, e.name
  FROM employees e
  JOIN hierarchy h ON e.manager_id = h.id
)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Lead and Lag',
    description: `# LEAD and LAG Functions

Use window functions to compare current and next/prev row.

## Requirements
1. Use OVER() with ORDER BY
2. Use LEAD() and LAG()

## Example
\`\`\`sql
SELECT name, sales, 
       LAG(sales) OVER (ORDER BY month) AS prev_sales
FROM monthly_sales;
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Rolling Aggregates',
    description: `# Rolling Aggregates

Calculate running total or average using window functions.

## Requirements
1. Cumulative sums
2. Rolling window frame

## Example
\`\`\`sql
SELECT date, 
       SUM(amount) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_sum
FROM orders;
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Pivoting Data',
    description: `# Pivoting Data

Transform rows into columns using aggregation.

## Requirements
1. Use FILTER with aggregation
2. Simulate pivot without PIVOT clause

## Example
\`\`\`sql
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE status = 'success') AS success_count,
  COUNT(*) FILTER (WHERE status = 'fail') AS fail_count
FROM logs
GROUP BY user_id;
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Anti Join with NOT EXISTS',
    description: `# Anti Join with NOT EXISTS

Find unmatched rows using NOT EXISTS.

## Requirements
1. Use correlated subquery
2. Identify missing relations

## Example
\`\`\`sql
SELECT * FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Top N per Group',
    description: `# Top N per Group

Find top N rows within each group using window functions.

## Requirements
1. Use ROW_NUMBER() or RANK()
2. Filter top N from each group

## Example
\`\`\`sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
  FROM employees
) ranked
WHERE rank <= 3;
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Dynamic Filtering with CASE',
    description: `# Dynamic Filtering with CASE

Apply dynamic filters based on input conditions.

## Requirements
1. Use CASE inside WHERE or SELECT
2. Flexible filtering logic

## Example
\`\`\`sql
SELECT name,
       CASE WHEN status = 'active' THEN '✔' ELSE '✖' END AS active_symbol
FROM users;
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'NoSQL': [
// EASY
  {
    title: 'Basic Queries',
    description: `# Basic NoSQL Queries

Implement basic MongoDB queries.

## Requirements
1. Find documents
2. Use simple filters
3. Sort by fields
4. Limit results

## Example
\`\`\`javascript
db.collection.find({ status: "active" }).sort({ date: -1 }).limit(10);
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Find by ID',
    description: `# Find by Document ID

Query a document using its \`_id\`.

## Requirements
1. Use \`ObjectId\`
2. Handle cases where no match is found

## Example
\`\`\`javascript
db.users.find({ _id: ObjectId("64ac3bcd9fc13a001e99a123") });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Simple Insert',
    description: `# Insert Documents

Insert a new document into a collection.

## Requirements
1. Use \`insertOne()\`
2. Include nested structure

## Example
\`\`\`javascript
db.products.insertOne({ name: "Laptop", specs: { cpu: "i5", ram: "16GB" } });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Field Projection',
    description: `# Field Projection

Return only selected fields in a query result.

## Requirements
1. Include/exclude specific fields
2. Exclude \`_id\` when needed

## Example
\`\`\`javascript
db.users.find({}, { name: 1, email: 1, _id: 0 });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Simple Delete',
    description: `# Delete Document

Remove a single document from a collection.

## Requirements
1. Use \`deleteOne()\`
2. Match by value or condition

## Example
\`\`\`javascript
db.users.deleteOne({ email: "test@example.com" });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Array Query',
    description: `# Array Query

Find documents where an array contains a value.

## Requirements
1. Use \`$in\` or direct array matching

## Example
\`\`\`javascript
db.posts.find({ tags: "mongodb" });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Exists and Type Checks',
    description: `# Exists and Type Checks

Query documents where a field exists or has a specific type.

## Requirements
1. Use \`$exists\` and \`$type\`

## Example
\`\`\`javascript
db.logs.find({ error: { $exists: true, $type: "string" } });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Regex Matching',
    description: `# Regex Matching

Search documents using pattern matching.

## Requirements
1. Use case-insensitive regex

## Example
\`\`\`javascript
db.users.find({ name: { $regex: "^j", $options: "i" } });
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Count Documents',
    description: `# Count Documents

Count the number of matching documents.

## Requirements
1. Use \`countDocuments()\`

## Example
\`\`\`javascript
db.orders.countDocuments({ status: "completed" });
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Document Operations',
    description: `# Document Operations

Implement document-level updates and bulk operations.

## Requirements
1. Use \`updateOne()\`, \`updateMany()\`
2. Perform nested updates
3. Array updates using \`$push\`, \`$pull\`

## Example
\`\`\`javascript
db.collection.updateMany(
  { status: "pending" },
  { $set: { status: "processed" } }
);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Multi-Condition Filters',
    description: `# Multi-Condition Filters

Query documents using complex logical conditions.

## Requirements
1. Combine \`$and\`, \`$or\`, \`$not\`, \`$nor\`

## Example
\`\`\`javascript
db.products.find({
  $and: [
    { price: { $gt: 100 } },
    { category: { $in: ["electronics", "gadgets"] } }
  ]
});
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Nested Array Updates',
    description: `# Nested Array Updates

Update values inside nested arrays using positional operators.

## Requirements
1. Use \`$[]\`, \`$[<identifier>]\`

## Example
\`\`\`javascript
db.books.updateMany(
  {},
  { $set: { "authors.$[a].verified": true } },
  { arrayFilters: [{ "a.verified": false }] }
);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Sorting and Pagination',
    description: `# Sorting and Pagination

Implement query pagination logic.

## Requirements
1. Use \`skip()\` and \`limit()\`
2. Sort by field

## Example
\`\`\`javascript
db.products.find().sort({ price: 1 }).skip(10).limit(5);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Partial Updates with $inc and $set',
    description: `# Partial Updates

Use update operators for partial document changes.

## Requirements
1. Use \`$inc\`, \`$set\`

## Example
\`\`\`javascript
db.inventory.updateOne(
  { item: "laptop" },
  { $inc: { quantity: -1 }, $set: { lastSold: new Date() } }
);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Projection with Computed Fields',
    description: `# Projection with Computed Fields

Compute fields during projection using \`$project\`.

## Requirements
1. Use \`$add\`, \`$concat\` in projection

## Example
\`\`\`javascript
db.employees.aggregate([
  { $project: { fullName: { $concat: ["$first", " ", "$last"] } } }
]);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Conditional Updates',
    description: `# Conditional Updates

Update fields only if they meet certain conditions.

## Requirements
1. Use \`$cond\`, \`$mergeObjects\`

## Example
\`\`\`javascript
db.students.updateMany(
  { score: { $gte: 90 } },
  { $set: { grade: "A" } }
);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Find Top N in Group',
    description: `# Find Top N in Group

Find the top N items in a group using aggregation.

## Requirements
1. Use \`$group\`, \`$sort\`, \`$limit\`

## Example
\`\`\`javascript
db.orders.aggregate([
  { $group: { _id: "$customer", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 3 }
]);
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Distinct Values',
    description: `# Distinct Values

Retrieve unique values from a field.

## Requirements
1. Use \`distinct()\`

## Example
\`\`\`javascript
db.orders.distinct("status");
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'MongoDB Aggregation',
    description: `# MongoDB Aggregation Pipeline

Create a complex aggregation pipeline.

## Requirements
1. Multiple stages
2. Grouping operations
3. Lookup operations
4. Project operations

## Example
\`\`\`javascript
db.collection.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: "$category", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
]);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Aggregation with Lookup',
    description: `# Aggregation with $lookup

Perform a join-like operation using \`$lookup\`.

## Requirements
1. Join two collections
2. Filter joined data

## Example
\`\`\`javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customerDetails"
    }
  }
]);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Recursive Graph Lookup',
    description: `# Recursive Graph Lookup

Use \`$graphLookup\` to model tree/graph structures.

## Requirements
1. Recursive parent-child relationship
2. Depth tracking

## Example
\`\`\`javascript
db.categories.aggregate([
  {
    $graphLookup: {
      from: "categories",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "parent_id",
      as: "subcategories"
    }
  }
]);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Merge and Replace Documents',
    description: `# Merge and Replace Documents

Use \`$merge\` to write aggregation results to a collection.

## Requirements
1. Aggregate and write to target
2. Use \`$merge\` or \`$out\`

## Example
\`\`\`javascript
db.orders.aggregate([
  { $match: { status: "complete" } },
  { $group: { _id: "$customer", total: { $sum: "$amount" } } },
  { $merge: "summarized_orders" }
]);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Update Embedded Documents Conditionally',
    description: `# Update Embedded Documents Conditionally

Target nested documents with \`$elemMatch\` and \`arrayFilters\`.

## Requirements
1. Use \`$set\`, \`$[identifier]\`, \`arrayFilters\`

## Example
\`\`\`javascript
db.users.updateMany(
  {},
  { $set: { "orders.$[elem].shipped": true } },
  { arrayFilters: [{ "elem.status": "pending" }] }
);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Aggregation with Facets',
    description: `# Aggregation with $facet

Run multiple aggregation pipelines in parallel.

## Requirements
1. Use \`$facet\` for dashboard-style queries

## Example
\`\`\`javascript
db.products.aggregate([
  {
    $facet: {
      topRated: [ { $sort: { rating: -1 } }, { $limit: 5 } ],
      lowStock: [ { $match: { stock: { $lt: 10 } } } ]
    }
  }
]);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Bucketing Data',
    description: `# Bucketing Data

Use \`$bucket\` to categorize numerical fields.

## Requirements
1. Use boundaries
2. Return count per range

## Example
\`\`\`javascript
db.students.aggregate([
  {
    $bucket: {
      groupBy: "$score",
      boundaries: [0, 60, 80, 100],
      default: "Unknown",
      output: { count: { $sum: 1 } }
    }
  }
]);
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Transactional Writes',
    description: `# Transactional Writes

Use multi-document transactions with sessions.

## Requirements
1. Start session
2. Perform multiple writes atomically

## Example
\`\`\`javascript
const session = client.startSession();
await session.withTransaction(async () => {
  await db.accounts.updateOne(..., { session });
  await db.logs.insertOne(..., { session });
});
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Change Streams',
    description: `# Change Streams

Listen to real-time changes in a collection.

## Requirements
1. Use \`watch()\`
2. Handle insert/update/delete events

## Example
\`\`\`javascript
db.collection.watch().on("change", data => console.log(data));
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'Tuples': [
// EASY
  {
    title: 'Tuple Operations',
    description: `# Python Tuple Operations

Implement various tuple operations.

## Requirements
1. Tuple packing and unpacking
2. Tuple indexing and slicing
3. Tuple immutability
4. Converting list to tuple and vice versa

## Example
\`\`\`python
def swap(a, b):
    return b, a
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Accessing Tuple Elements',
    description: `# Accessing Tuple Elements

Access individual elements of a tuple.

## Requirements
1. Use index-based access
2. Use negative indexing
3. Handle tuple with different data types

## Example
\`\`\`python
t = (1, "hello", 3.5)
second = t[1]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Tuple Length and Membership',
    description: `# Tuple Length and Membership

Use built-in functions with tuples.

## Requirements
1. Use \`len()\`
2. Use \`in\` and \`not in\` operators

## Example
\`\`\`python
t = (10, 20, 30)
exists = 20 in t
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Tuple Concatenation',
    description: `# Tuple Concatenation

Concatenate two or more tuples.

## Requirements
1. Combine multiple tuples into one
2. Use \`+\` operator

## Example
\`\`\`python
t1 = (1, 2)
t2 = (3, 4)
result = t1 + t2
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Tuple Repetition',
    description: `# Tuple Repetition

Repeat a tuple using the \`*\` operator.

## Requirements
1. Use repetition to duplicate elements

## Example
\`\`\`python
t = (1, 2)
repeated = t * 3  # (1, 2, 1, 2, 1, 2)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Single Element Tuple',
    description: `# Single Element Tuple

Create a tuple with only one element.

## Requirements
1. Understand comma syntax
2. Validate type using \`type()\`

## Example
\`\`\`python
t = (5,)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Tuple with Mixed Types',
    description: `# Tuple with Mixed Types

Store values of different types in a tuple.

## Requirements
1. Combine string, int, float, and bool

## Example
\`\`\`python
info = ("Alice", 30, 5.7, True)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Tuple to List Conversion',
    description: `# Tuple to List Conversion

Convert a tuple to a list and modify it.

## Requirements
1. Use \`list()\`
2. Make a modification

## Example
\`\`\`python
t = (1, 2, 3)
l = list(t)
l.append(4)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'List to Tuple Conversion',
    description: `# List to Tuple Conversion

Convert a list to a tuple.

## Requirements
1. Use \`tuple()\`
2. Validate immutability

## Example
\`\`\`python
l = [1, 2, 3]
t = tuple(l)
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Named Tuples',
    description: `# Named Tuples

Work with named tuples in Python.

## Requirements
1. Define named tuple types
2. Access fields by name
3. Convert to dict
4. Replace values

## Example
\`\`\`python
from collections import namedtuple
Point = namedtuple('Point', ['x', 'y'])
p = Point(1, 2)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Tuple Unpacking',
    description: `# Tuple Unpacking

Unpack tuple elements into individual variables.

## Requirements
1. Use standard unpacking
2. Use \`*\` (starred) unpacking

## Example
\`\`\`python
a, b, *rest = (1, 2, 3, 4)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Enumerate with Tuples',
    description: `# Enumerate with Tuples

Use \`enumerate()\` to iterate over a tuple with index.

## Requirements
1. Loop through tuple using \`enumerate()\`

## Example
\`\`\`python
for i, val in enumerate(("a", "b", "c")):
    print(i, val)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Sorting Tuples by Second Element',
    description: `# Sorting Tuples by Second Element

Sort a list of tuples based on the second value.

## Requirements
1. Use \`sorted()\` with \`key=\`

## Example
\`\`\`python
data = [(1, 3), (2, 1), (3, 2)]
sorted_data = sorted(data, key=lambda x: x[1])
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Zip and Unzip Tuples',
    description: `# Zip and Unzip Tuples

Combine and separate tuples using \`zip()\`.

## Requirements
1. Use \`zip()\` to combine
2. Use \`zip(*)\` to unzip

## Example
\`\`\`python
a = (1, 2)
b = (3, 4)
zipped = list(zip(a, b))
unzipped = list(zip(*zipped))
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Count and Index Methods',
    description: `# Count and Index Methods

Use tuple methods for element occurrence.

## Requirements
1. Use \`count()\` and \`index()\` on tuples

## Example
\`\`\`python
t = (1, 2, 2, 3)
print(t.count(2))  # 2
print(t.index(3))  # 3
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Tuple Slicing',
    description: `# Tuple Slicing

Extract sub-tuples using slicing.

## Requirements
1. Slice tuples like lists

## Example
\`\`\`python
t = (1, 2, 3, 4, 5)
print(t[1:4])  # (2, 3, 4)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Swapping Variables',
    description: `# Swapping Variables Using Tuple

Swap values of two variables using tuple unpacking.

## Requirements
1. Perform without temp variable

## Example
\`\`\`python
a, b = 1, 2
a, b = b, a
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Tuples in Sets',
    description: `# Tuples in Sets

Use tuples as keys or unique set elements.

## Requirements
1. Validate tuple hashability
2. Use as set element or dict key

## Example
\`\`\`python
coords = set()
coords.add((1, 2))
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Advanced Tuple Usage',
    description: `# Advanced Tuple Usage

Work with nested and complex tuple patterns.

## Requirements
1. Nesting tuples
2. Use tuples as keys
3. Tuple-based algorithms

## Example
\`\`\`python
def merge_tuples(t1, t2):
    return tuple(sorted(t1 + t2))
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Tuple Compression',
    description: `# Tuple Compression

Flatten nested tuple structures.

## Requirements
1. Recursively flatten
2. Preserve order

## Example
\`\`\`python
def flatten(t):
    result = []
    for i in t:
        result.extend(flatten(i) if isinstance(i, tuple) else [i])
    return tuple(result)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Tuple-Based Frequency Map',
    description: `# Tuple-Based Frequency Map

Use tuples to count frequency of key combinations.

## Requirements
1. Use dict with tuple keys

## Example
\`\`\`python
freq = {}
for item in data:
    key = (item['category'], item['type'])
    freq[key] = freq.get(key, 0) + 1
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Cartesian Product with Tuples',
    description: `# Cartesian Product with Tuples

Generate all pairs of tuples from two sets.

## Requirements
1. Use nested loops or \`itertools.product\`

## Example
\`\`\`python
import itertools
pairs = list(itertools.product((1, 2), ('a', 'b')))
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Sliding Window Tuples',
    description: `# Sliding Window Tuples

Implement a sliding window using tuples.

## Requirements
1. Generate overlapping tuple windows

## Example
\`\`\`python
def windows(t, k):
    return [t[i:i+k] for i in range(len(t) - k + 1)]
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Tuples for Memoization',
    description: `# Tuples for Memoization

Use tuple keys to memoize function calls.

## Requirements
1. Use \`functools.lru_cache()\` or custom dict

## Example
\`\`\`python
@lru_cache
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Multi-Value Return',
    description: `# Multi-Value Return from Function

Return multiple values as a tuple and unpack them.

## Requirements
1. Return tuple
2. Unpack in caller

## Example
\`\`\`python
def stats(data):
    return min(data), max(data), sum(data)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Dynamic Tuple Generation',
    description: `# Dynamic Tuple Generation

Generate tuples of combinations or permutations.

## Requirements
1. Use \`itertools.combinations\`

## Example
\`\`\`python
from itertools import combinations
combos = list(combinations((1, 2, 3), 2))
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Tuple Comparison and Sorting',
    description: `# Tuple Comparison and Sorting

Sort tuples with custom comparison logic.

## Requirements
1. Sort tuples by multiple values

## Example
\`\`\`python
data = [(1, 3), (1, 2), (2, 1)]
sorted_data = sorted(data, key=lambda x: (x[0], -x[1]))
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'dictionary': [
// EASY
  {
    title: 'Dictionary Views',
    description: `# Dictionary Views

Work with dictionary views in Python.

## Requirements
1. Get keys using \`keys()\`
2. Get values using \`values()\`
3. Get items using \`items()\`

## Example
\`\`\`python
def process_views(d):
    return list(d.keys()), list(d.values())
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Key Existence Check',
    description: `# Key Existence Check

Check if a key exists in a dictionary.

## Requirements
1. Use \`in\` keyword
2. Return value or default

## Example
\`\`\`python
def get_value(d, key):
    return d[key] if key in d else "Not Found"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Empty Dictionary',
    description: `# Create and Check Empty Dictionary

Work with empty dictionaries.

## Requirements
1. Create empty dict
2. Check if empty

## Example
\`\`\`python
def is_empty(d):
    return len(d) == 0
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Add and Remove Keys',
    description: `# Add and Remove Keys

Add and remove dictionary keys.

## Requirements
1. Add key-value pairs
2. Delete key using \`del\`

## Example
\`\`\`python
d = {}
d["name"] = "Alice"
del d["name"]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Loop Over Dictionary',
    description: `# Loop Over Dictionary

Iterate through dictionary items.

## Requirements
1. Use \`for k, v in d.items()\`

## Example
\`\`\`python
for k, v in d.items():
    print(k, v)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Dictionary Length',
    description: `# Dictionary Length

Find number of key-value pairs in a dictionary.

## Requirements
1. Use \`len()\`

## Example
\`\`\`python
def size(d):
    return len(d)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Update Dictionary',
    description: `# Update Dictionary

Use \`update()\` to merge new entries.

## Requirements
1. Use \`update()\` method

## Example
\`\`\`python
d1 = {"a": 1}
d2 = {"b": 2}
d1.update(d2)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Default Value with get()',
    description: `# Default Value with get()

Use \`get()\` method to provide fallback values.

## Requirements
1. Avoid KeyError

## Example
\`\`\`python
def get_safe(d, k):
    return d.get(k, "Not Present")
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Dictionary from Keys',
    description: `# Dictionary from Keys

Create a dictionary using \`fromkeys()\`.

## Requirements
1. Create with same default value

## Example
\`\`\`python
d = dict.fromkeys(["x", "y", "z"], 0)
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Dictionary Manipulation',
    description: `# Python Dictionary Manipulation

Implement dictionary operations and transformations.

## Requirements
1. Merge dictionaries
2. Nested updates
3. Dictionary comprehension
4. Default values

## Example
\`\`\`python
def merge_dicts(dict1, dict2):
    return {**dict1, **dict2}
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Dictionary Comprehension',
    description: `# Dictionary Comprehension

Create dictionaries using comprehensions.

## Requirements
1. Use \`{k: v for ...}\`

## Example
\`\`\`python
squares = {x: x*x for x in range(5)}
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Inverting Dictionary',
    description: `# Inverting Dictionary

Swap keys and values.

## Requirements
1. Handle unique values only

## Example
\`\`\`python
def invert(d):
    return {v: k for k, v in d.items()}
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Merge Two Dictionaries',
    description: `# Merge Two Dictionaries

Merge two dictionaries with overlapping keys.

## Requirements
1. Prefer second dict's values

## Example
\`\`\`python
merged = dict1 | dict2  # Python 3.9+
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Group By Value Type',
    description: `# Group By Value Type

Categorize dictionary values by type.

## Requirements
1. Use \`type()\`
2. Build new grouped dict

## Example
\`\`\`python
{type(v).__name__: [] for v in d.values()}
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Filter Dictionary',
    description: `# Filter Dictionary

Remove key-value pairs that don’t meet a condition.

## Requirements
1. Use comprehension or \`filter()\`

## Example
\`\`\`python
filtered = {k: v for k, v in d.items() if v > 10}
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Nested Dictionary Access',
    description: `# Nested Dictionary Access

Access deep dictionary values safely.

## Requirements
1. Use \`get()\` with default
2. Handle missing keys

## Example
\`\`\`python
user.get("profile", {}).get("email")
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Frequency Counter',
    description: `# Frequency Counter

Count occurrences of elements in a list.

## Requirements
1. Use \`dict\` or \`defaultdict\`

## Example
\`\`\`python
for item in arr:
    counts[item] = counts.get(item, 0) + 1
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Sorting by Dictionary Value',
    description: `# Sorting by Dictionary Value

Sort a dictionary by values.

## Requirements
1. Return sorted list of tuples

## Example
\`\`\`python
sorted_items = sorted(d.items(), key=lambda x: x[1])
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Custom Dictionary',
    description: `# Custom Dictionary Implementation

Implement a custom dictionary class.

## Requirements
1. Custom methods
2. Special methods
3. Dictionary protocol
4. Custom behavior

## Example
\`\`\`python
class CustomDict(dict):
    def __missing__(self, key):
        return 'Not Found'
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Nested Dictionary Merge',
    description: `# Nested Dictionary Merge

Merge deeply nested dictionaries.

## Requirements
1. Use recursion
2. Preserve structure

## Example
\`\`\`python
def deep_merge(a, b): ...
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Multi-Key Mapping',
    description: `# Multi-Key Mapping

Simulate compound keys in dictionary.

## Requirements
1. Use tuple keys
2. Store coordinates or composite IDs

## Example
\`\`\`python
grid[(x, y)] = "value"
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Immutable Dict Wrapper',
    description: `# Immutable Dict Wrapper

Prevent modifications to a dictionary.

## Requirements
1. Subclass or wrap dict
2. Override mutating methods

## Example
\`\`\`python
class FrozenDict(dict):
    def __setitem__(self, key, value): raise TypeError
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Nested Comprehension',
    description: `# Nested Dictionary Comprehension

Create nested dictionaries using comprehension.

## Requirements
1. Build 2D matrix as dict of dicts

## Example
\`\`\`python
matrix = {i: {j: 0 for j in range(3)} for i in range(3)}
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'ChainMap Usage',
    description: `# ChainMap Usage

Combine multiple dicts logically.

## Requirements
1. Use \`collections.ChainMap\`

## Example
\`\`\`python
from collections import ChainMap
config = ChainMap(env, default)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Dictionary Tree Structure',
    description: `# Dictionary Tree Structure

Build a tree-like data structure using nested dictionaries.

## Requirements
1. Dynamically build tree structure

## Example
\`\`\`python
tree = {}
tree["parent"] = {"child": {"grandchild": {}}}
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Serialize Dictionary to JSON',
    description: `# Serialize Dictionary to JSON

Convert nested dictionary into a JSON string.

## Requirements
1. Use \`json.dumps()\`
2. Handle indentation

## Example
\`\`\`python
import json
json_string = json.dumps(data, indent=2)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Custom __getitem__ Behavior',
    description: `# Custom __getitem__ Behavior

Override dictionary access logic.

## Requirements
1. Use class with \`__getitem__\`
2. Add fallback logic

## Example
\`\`\`python
class FallbackDict(dict):
    def __getitem__(self, key):
        return super().get(key, "default")
\`\`\`
`,
    difficulty: 'hard'
  }
],
'functions': [
// EASY
  {
    title: 'Basic Functions',
    description: `# Basic Python Functions

Implement basic function patterns.

## Requirements
1. Function definition
2. Return values
3. Parameters
4. Docstrings

## Example
\`\`\`python
def greet(name):
    """Greet a person"""
    return f"Hello, {name}!"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Return Multiple Values',
    description: `# Return Multiple Values

Write a function that returns multiple values.

## Requirements
1. Use tuple return
2. Unpack in caller

## Example
\`\`\`python
def stats(numbers):
    return min(numbers), max(numbers), sum(numbers)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Default Parameters',
    description: `# Default Parameters

Use default values for function arguments.

## Requirements
1. Define function with default arguments

## Example
\`\`\`python
def greet(name="Guest"):
    return f"Hello, {name}"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Keyword Arguments',
    description: `# Keyword Arguments

Call functions using keyword arguments.

## Requirements
1. Define with named parameters
2. Call using keywords

## Example
\`\`\`python
def describe_pet(name, type="dog"):
    return f"{name} is a {type}"
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Simple Calculator Function',
    description: `# Simple Calculator Function

Create a function that adds, subtracts, multiplies, or divides two numbers.

## Requirements
1. Use conditionals inside function
2. Handle unsupported ops

## Example
\`\`\`python
def calc(a, b, op="+"):
    if op == "+": return a + b
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Function with Type Hints',
    description: `# Function with Type Hints

Use Python type annotations in function signatures.

## Requirements
1. Add type hints to parameters and return value

## Example
\`\`\`python
def add(a: int, b: int) -> int:
    return a + b
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Print N Times',
    description: `# Print N Times

Create a function that prints a message N times.

## Requirements
1. Use a loop
2. Accept both message and count as parameters

## Example
\`\`\`python
def repeat(msg, times):
    for _ in range(times): print(msg)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Square a Number',
    description: `# Square a Number

Define a function that returns the square of a number.

## Requirements
1. Use return
2. Function name: \`square\`

## Example
\`\`\`python
def square(n):
    return n * n
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Boolean Checker',
    description: `# Boolean Checker

Check if a number is even using a function.

## Requirements
1. Return \`True\` or \`False\`

## Example
\`\`\`python
def is_even(n):
    return n % 2 == 0
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'Function Arguments',
    description: `# Function Arguments

Work with different types of function arguments.

## Requirements
1. Positional args
2. Keyword args
3. Default values
4. Variable args

## Example
\`\`\`python
def flexible_function(*args, **kwargs):
    pass
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Lambda Function',
    description: `# Lambda Function

Use lambda expressions to perform quick calculations.

## Requirements
1. Write inline lambda
2. Pass to \`map()\`, \`filter()\`

## Example
\`\`\`python
squared = list(map(lambda x: x**2, [1, 2, 3]))
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Recursive Function',
    description: `# Recursive Function

Use recursion to calculate factorial of a number.

## Requirements
1. Use base + recursive case

## Example
\`\`\`python
def factorial(n):
    return 1 if n == 0 else n * factorial(n-1)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Higher Order Function',
    description: `# Higher Order Function

Accept a function as an argument.

## Requirements
1. Pass function as parameter
2. Call it inside wrapper

## Example
\`\`\`python
def apply(f, x): return f(x)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Function with Validation',
    description: `# Function with Validation

Validate inputs and raise exceptions.

## Requirements
1. Use \`raise ValueError\`

## Example
\`\`\`python
def safe_divide(a, b):
    if b == 0: raise ValueError("Divide by zero")
    return a / b
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Closures',
    description: `# Python Closures

Create a closure that retains state.

## Requirements
1. Define outer function
2. Inner function references outer scope

## Example
\`\`\`python
def make_multiplier(x):
    def multiply(y):
        return x * y
    return multiply
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Docstring Generator',
    description: `# Docstring Generator

Write a function with a complete docstring.

## Requirements
1. Use \`"""Description..."""\` syntax

## Example
\`\`\`python
def greet(name):
    """Return a greeting message."""
    return f"Hello, {name}"
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Keyword-Only Arguments',
    description: `# Keyword-Only Arguments

Define a function that requires named arguments.

## Requirements
1. Use \`*\` in signature

## Example
\`\`\`python
def describe(*, name, age): ...
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Function Factory',
    description: `# Function Factory

Generate functions dynamically.

## Requirements
1. Return new functions from a function

## Example
\`\`\`python
def power(n):
    return lambda x: x ** n
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Python Decorators',
    description: `# Python Function Decorators

Implement function decorators for various purposes.

## Requirements
1. Timing decorator
2. Logging decorator
3. Cache decorator
4. Retry decorator

## Example
\`\`\`python
@timing_decorator
def slow_function():
    time.sleep(1)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Memoization with Decorator',
    description: `# Memoization with Decorator

Build a decorator to cache function results.

## Requirements
1. Use \`functools.lru_cache\` or custom

## Example
\`\`\`python
@memoize
def fib(n): ...
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Function Introspection',
    description: `# Function Introspection

Access function metadata dynamically.

## Requirements
1. Use \`__name__\`, \`__doc__\`, \`inspect\`

## Example
\`\`\`python
import inspect
def get_signature(f): return inspect.signature(f)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Chained Function Decorators',
    description: `# Chained Function Decorators

Apply multiple decorators on one function.

## Requirements
1. Define 2 decorators
2. Wrap a function in both

## Example
\`\`\`python
@logger
@timer
def foo(): ...
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Partial Functions',
    description: `# Partial Functions

Use \`functools.partial\` to pre-fill arguments.

## Requirements
1. Create partially applied version

## Example
\`\`\`python
from functools import partial
multiply_by_2 = partial(pow, exp=2)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Function Registry',
    description: `# Function Registry

Create a function registry using decorators.

## Requirements
1. Store functions by name
2. Lookup and invoke by key

## Example
\`\`\`python
registry = {}
def register(fn):
    registry[fn.__name__] = fn
    return fn
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Asynchronous Function Wrapper',
    description: `# Asynchronous Function Wrapper

Wrap an async function with decorator.

## Requirements
1. Support \`await\`
2. Handle exceptions

## Example
\`\`\`python
async def log_async(f):
    async def wrapper(*args, **kwargs):
        try:
            return await f(*args, **kwargs)
        except Exception as e:
            print("Error:", e)
    return wrapper
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Parameter Validation Decorator',
    description: `# Parameter Validation Decorator

Use decorator to validate function parameters.

## Requirements
1. Raise errors for invalid types/values

## Example
\`\`\`python
def validate_positive(f):
    def wrapper(x):
        if x < 0: raise ValueError()
        return f(x)
    return wrapper
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Dynamic Dispatch System',
    description: `# Dynamic Dispatch System

Implement function dispatch based on argument type.

## Requirements
1. Use \`@singledispatch\`
2. Register type-based handlers

## Example
\`\`\`python
from functools import singledispatch

@singledispatch
def process(arg): ...
@process.register(int)
def _(arg): return arg * 2
\`\`\`
`,
    difficulty: 'hard'
  }
]
,
  'file handling': [
// EASY
  {
    title: 'CSV Operations',
    description: `# CSV File Operations

Work with CSV files in Python.

## Requirements
1. Read CSV
2. Write CSV
3. Data processing
4. Custom dialects

## Example
\`\`\`python
import csv
with open('data.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Basic Text File Read',
    description: `# Basic Text File Read

Read content from a text file.

## Requirements
1. Use context manager
2. Read entire content

## Example
\`\`\`python
with open('sample.txt', 'r') as f:
    data = f.read()
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Basic Text File Write',
    description: `# Basic Text File Write

Write content to a text file.

## Requirements
1. Use write mode
2. Overwrite existing content

## Example
\`\`\`python
with open('output.txt', 'w') as f:
    f.write("Hello, File!")
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Append to Text File',
    description: `# Append to Text File

Append new content to an existing file.

## Requirements
1. Use \`a\` mode
2. Add newline for each entry

## Example
\`\`\`python
with open('log.txt', 'a') as f:
    f.write("New log entry\\n")
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Line-by-Line File Read',
    description: `# Line-by-Line File Read

Read a file line by line and print.

## Requirements
1. Use loop to read each line

## Example
\`\`\`python
with open('sample.txt', 'r') as f:
    for line in f:
        print(line.strip())
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'File Exists Check',
    description: `# File Exists Check

Check whether a file exists before reading.

## Requirements
1. Use \`os.path.exists()\`

## Example
\`\`\`python
import os
if os.path.exists('file.txt'):
    print("File exists")
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Count Lines in File',
    description: `# Count Lines in File

Count the number of lines in a file.

## Requirements
1. Use loop or \`len(f.readlines())\`

## Example
\`\`\`python
with open('sample.txt') as f:
    print(len(f.readlines()))
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'File Extension Filter',
    description: `# File Extension Filter

List all files with a specific extension.

## Requirements
1. Use \`os.listdir()\`
2. Filter with \`.endswith()\`

## Example
\`\`\`python
import os
files = [f for f in os.listdir() if f.endswith('.txt')]
\`\`\`
`,
    difficulty: 'easy'
  },
  {
    title: 'Path Join Utility',
    description: `# Path Join Utility

Join folder and filename using path tools.

## Requirements
1. Use \`os.path.join()\`

## Example
\`\`\`python
import os
path = os.path.join('folder', 'file.txt')
\`\`\`
`,
    difficulty: 'easy'
  },

// MEDIUM
  {
    title: 'File Processing',
    description: `# Python File Processing

Implement file processing operations.

## Requirements
1. Read operations
2. Write operations
3. Context managers
4. Error handling

## Example
\`\`\`python
with open('file.txt', 'r') as f:
    content = f.read()
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Read Specific Lines',
    description: `# Read Specific Lines

Read a file and print only Nth lines.

## Requirements
1. Loop with condition
2. Line number indexing

## Example
\`\`\`python
with open('file.txt') as f:
    for i, line in enumerate(f):
        if i % 2 == 0:
            print(line)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Text File Word Count',
    description: `# Text File Word Count

Count the number of words in a file.

## Requirements
1. Split and count words

## Example
\`\`\`python
with open('sample.txt') as f:
    print(len(f.read().split()))
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'JSON File Handling',
    description: `# JSON File Handling

Read and write JSON files.

## Requirements
1. Use \`json.load()\` and \`json.dump()\`

## Example
\`\`\`python
import json
with open('data.json') as f:
    data = json.load(f)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Safe File Write',
    description: `# Safe File Write

Ensure file is safely closed using try/finally.

## Requirements
1. Avoid context manager
2. Use \`try/finally\` manually

## Example
\`\`\`python
f = open('file.txt', 'w')
try:
    f.write("data")
finally:
    f.close()
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'CSV DictReader and DictWriter',
    description: `# CSV DictReader and DictWriter

Use dictionary interface for CSV operations.

## Requirements
1. Read and write rows as dictionaries

## Example
\`\`\`python
import csv
with open('data.csv') as f:
    reader = csv.DictReader(f)
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Backup File Creator',
    description: `# Backup File Creator

Create a backup copy of a text file.

## Requirements
1. Read original
2. Write to new file

## Example
\`\`\`python
with open('original.txt') as src, open('backup.txt', 'w') as dst:
    dst.write(src.read())
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Line Number Prefixer',
    description: `# Line Number Prefixer

Prefix each line in a file with its line number.

## Requirements
1. Use loop with enumerate

## Example
\`\`\`python
with open('file.txt') as f:
    for i, line in enumerate(f, 1):
        print(f"{i}: {line}", end="")
\`\`\`
`,
    difficulty: 'medium'
  },
  {
    title: 'Strip Blank Lines',
    description: `# Strip Blank Lines

Remove blank lines while copying to new file.

## Requirements
1. Filter lines
2. Write only non-blank lines

## Example
\`\`\`python
with open('input.txt') as f, open('output.txt', 'w') as out:
    for line in f:
        if line.strip(): out.write(line)
\`\`\`
`,
    difficulty: 'medium'
  },

// HARD
  {
    title: 'Binary Files',
    description: `# Binary File Handling

Work with binary files in Python.

## Requirements
1. Read binary
2. Write binary
3. Seek operations
4. Buffer handling

## Example
\`\`\`python
with open('data.bin', 'rb') as f:
    data = f.read(1024)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Hex Viewer Tool',
    description: `# Hex Viewer Tool

Print a binary file in hexadecimal format.

## Requirements
1. Use \`binascii.hexlify\` or manual formatting

## Example
\`\`\`python
with open('data.bin', 'rb') as f:
    chunk = f.read()
    print(chunk.hex())
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Directory Tree Dumper',
    description: `# Directory Tree Dumper

Dump file paths recursively into a file.

## Requirements
1. Use \`os.walk()\`
2. Write each path

## Example
\`\`\`python
for root, dirs, files in os.walk('project'):
    for file in files:
        out.write(os.path.join(root, file) + "\\n")
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Large File Chunk Reader',
    description: `# Large File Chunk Reader

Read large files in fixed-size chunks.

## Requirements
1. Use \`read(size)\` inside a loop

## Example
\`\`\`python
with open('big.log') as f:
    while chunk := f.read(1024):
        process(chunk)
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Atomic File Write',
    description: `# Atomic File Write

Write to file safely using temp file and rename.

## Requirements
1. Write to \`tempfile\`
2. Use \`os.replace()\`

## Example
\`\`\`python
import tempfile, os
with tempfile.NamedTemporaryFile(delete=False) as tmp:
    tmp.write(b"new data")
os.replace(tmp.name, 'final.txt')
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Log Rotation Script',
    description: `# Log Rotation Script

Rotate log files based on size.

## Requirements
1. Check file size
2. Rename/backup existing log

## Example
\`\`\`python
if os.path.getsize('log.txt') > 1e6:
    os.rename('log.txt', 'log_backup.txt')
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'File Encryption/Decryption',
    description: `# File Encryption/Decryption

Encrypt and decrypt file content.

## Requirements
1. Use XOR or simple cipher

## Example
\`\`\`python
with open('file.txt', 'rb') as f:
    encrypted = bytes(b ^ 42 for b in f.read())
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Multi-File Reader',
    description: `# Multi-File Reader

Read all text files from a directory.

## Requirements
1. Loop through file list
2. Combine content

## Example
\`\`\`python
for file in os.listdir('logs'):
    if file.endswith('.log'):
        with open(file) as f:
            all_data += f.read()
\`\`\`
`,
    difficulty: 'hard'
  },
  {
    title: 'Seek and Replace in File',
    description: `# Seek and Replace in File

Replace a byte sequence using random access.

## Requirements
1. Use \`seek()\`, \`read()\`, \`write()\`
2. Binary mode

## Example
\`\`\`python
with open('binary.dat', 'r+b') as f:
    f.seek(10)
    f.write(b'PATCHED')
\`\`\`
`,
    difficulty: 'hard'
  }
]

};

const seedDatabase = async () => {
  try {
    await connectDB();
    await Problem.deleteMany({});
    await Topic.deleteMany({});
    await Subject.deleteMany({});
    await Recap.deleteMany({});
    const subjects = await Subject.insertMany(demoData.subjects);
    const topics = await Promise.all(demoData.topics.map(async (topic) => {
      const subject = subjects.find(s => s.name === topic.subjectName);
      return await Topic.create({
        name: topic.name,
        subjectId: subject?._id,
        recap: topic.recap || ''
      });
    }));
    // Insert problems for each topic
    for (const topic of topics) {
      const subject = subjects.find(s => s._id.equals(topic.subjectId));
      if (!subject) throw new Error(`Subject not found for topic: ${topic.name}`);
      const problems = problemsByTopic[topic.name] || [];
      for (const p of problems) {
        await Problem.create({
          title: p.title,
          description: p.description + '\n\n### Expected Input\n' + (p.input || '') + '\n\n### Expected Output\n' + (p.output || ''),
          subjectId: subject._id,
          topicId: topic._id,
          difficulty: topic.name === 'Functions' ? 
            (p.title.includes('Basic') ? 'easy' : p.title.includes('Composition') ? 'medium' : 'hard') :
            topic.name === 'Closures' ?
            (p.title.includes('Counter') ? 'easy' : p.title.includes('Private') ? 'medium' : 'hard') :
            topic.name === 'Fetch' ?
            (p.title.includes('Basic') ? 'easy' : p.title.includes('Timeout') ? 'medium' : 'hard') :
            topic.name === 'Objects' ?
            (p.title.includes('Property') ? 'easy' : p.title.includes('Transform') ? 'medium' : 'hard') :
            topic.name === 'HOFs' ?
            (p.title.includes('Map') ? 'easy' : p.title.includes('Filter') ? 'medium' : 'hard') :
            topic.name === 'Promises' ?
            (p.title.includes('Basic') ? 'easy' : p.title.includes('Chain') ? 'medium' : 'hard') :
            topic.name === 'Arrow functions' ?
            (p.title.includes('Refactor') ? 'easy' : p.title.includes('Handler') ? 'medium' : 'hard') :
            topic.name === 'Arrays' ?
            (p.title.includes('Operations') ? 'easy' : p.title.includes('Transformation') ? 'medium' : 'hard') :
            topic.name === 'Key-Value Pairs' ?
            (p.title.includes('Dictionary') ? 'easy' : p.title.includes('Cache') ? 'medium' : 'hard') :
            topic.name === 'Linked List' ?
            (p.title.includes('Circular') ? 'easy' : p.title.includes('Singly') ? 'medium' : 'hard') :
            topic.name === 'Sorting' ?
            (p.title.includes('Bubble') ? 'easy' : p.title.includes('Merge') ? 'medium' : 'hard') :
            topic.name === 'Searching' ?
            (p.title.includes('Linear') ? 'easy' : p.title.includes('Binary') ? 'medium' : 'hard') :
            topic.name === 'Recursive algos' ?
            (p.title.includes('Fibonacci') ? 'easy' : p.title.includes('Tree') ? 'medium' : 'hard') :
            topic.name === 'useEffect' ?
            (p.title.includes('Simple') ? 'easy' : p.title.includes('Data') ? 'medium' : 'hard') :
            topic.name === 'useState' ?
            (p.title.includes('Counter') ? 'easy' : p.title.includes('Form') ? 'medium' : 'hard') :
            topic.name === 'contextAPI' ?
            (p.title.includes('Language') ? 'easy' : p.title.includes('Theme') ? 'medium' : 'hard') :
            topic.name === 'Routing' ?
            (p.title.includes('Basic') ? 'easy' : p.title.includes('Dynamic') ? 'medium' : 'hard') :
            topic.name === 'SQL' ?
            (p.title.includes('Basic') ? 'easy' : p.title.includes('Data') ? 'medium' : 'hard') :
            topic.name === 'NoSQL' ?
            (p.title.includes('Basic') ? 'easy' : p.title.includes('Document') ? 'medium' : 'hard') :
            topic.name === 'Tuples' ?
            (p.title.includes('Operations') ? 'easy' : p.title.includes('Named') ? 'medium' : 'hard') :
            topic.name === 'dictionary' ?
            (p.title.includes('Views') ? 'easy' : p.title.includes('Manipulation') ? 'medium' : 'hard') :
            topic.name === 'functions' ?
            (p.title.includes('Basic') ? 'easy' : p.title.includes('Arguments') ? 'medium' : 'hard') :
            topic.name === 'file handling' ?
            (p.title.includes('CSV') ? 'easy' : p.title.includes('File') ? 'medium' : 'hard') :
            'medium',
          languages: [subject.name === 'Python' ? 'Python' : subject.name === 'DB' ? 'SQL' : 'JavaScript']
        });
      }
      // Insert recap for this topic
      await Recap.create({
        subjectId: subject._id,
        topicId: topic._id,
        recap: topic.recap || ''
      });
    }
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 