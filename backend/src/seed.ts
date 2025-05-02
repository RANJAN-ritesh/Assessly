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
  'Functions': [
    {
      title: 'Basic Function Calculator',
      description: `# Basic Function Calculator\n\nCreate a calculator that performs basic arithmetic operations using functions.\n\n## Requirements\n1. Addition function\n2. Subtraction function\n3. Multiplication function\n4. Division function\n\n## Example\n\`\`\`javascript\ncalculator.add(2, 3) // returns 5\ncalculator.subtract(5, 2) // returns 3\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Function Composition',
      description: `# Function Composition\n\nImplement a function that composes two functions together.\n\n## Requirements\n1. Take two functions as input\n2. Return a new function\n3. The new function should apply the functions in sequence\n\n## Example\n\`\`\`javascript\nconst add2 = x => x + 2;\nconst multiply3 = x => x * 3;\nconst composed = compose(multiply3, add2);\nconsole.log(composed(4)); // (4 + 2) * 3 = 18\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Implement Memoization',
      description: `# Implement Memoization\n\nCreate a higher-order function that adds memoization to any pure function.\n\n## Requirements\n1. Cache function results\n2. Handle multiple arguments\n3. Proper memory management\n\n## Example\n\`\`\`javascript\nconst memoizedFib = memoize(fib);\nconsole.log(memoizedFib(10)); // Uses cache for repeated calls\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'Closures': [
    {
      title: 'Counter Function',
      description: `# Counter Function\n\nCreate a simple counter using closures.\n\n## Requirements\n1. Increment function\n2. Decrement function\n3. Get current count\n\n## Example\n\`\`\`javascript\nconst counter = createCounter(0);\ncounter.increment(); // 1\ncounter.increment(); // 2\ncounter.decrement(); // 1\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Private Variable Pattern',
      description: `# Private Variable Pattern\n\nImplement a module with private variables using closures.\n\n## Requirements\n1. Private data storage\n2. Public methods to access data\n3. Data validation\n\n## Example\n\`\`\`javascript\nconst account = createAccount();\naccount.deposit(100);\naccount.getBalance(); // 100\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Implement Currying',
      description: `# Implement Currying\n\nCreate a function that transforms a function of N arguments into N functions of one argument each.\n\n## Requirements\n1. Handle any number of arguments\n2. Preserve function context\n3. Support partial application\n\n## Example\n\`\`\`javascript\nconst curriedAdd = curry(add);\ncurriedAdd(1)(2)(3); // 6\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'Fetch': [
    {
      title: 'Basic Fetch Request',
      description: `# Basic Fetch Request\n\nCreate a function to make a simple GET request using fetch.\n\n## Requirements\n1. GET request\n2. Error handling\n3. JSON parsing\n\n## Example\n\`\`\`javascript\nfetchData('https://api.example.com/data')\n  .then(data => console.log(data));\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Fetch with Timeout',
      description: `# Fetch with Timeout\n\nImplement a fetch wrapper that adds timeout functionality.\n\n## Requirements\n1. Timeout mechanism\n2. Error handling\n3. Request cancellation\n\n## Example\n\`\`\`javascript\nfetchWithTimeout('https://api.example.com/data', 5000)\n  .then(data => console.log(data));\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Implement Fetch Retry',
      description: `# Implement Fetch Retry\n\nCreate a fetch wrapper that retries failed requests with exponential backoff.\n\n## Requirements\n1. Retry mechanism\n2. Exponential backoff\n3. Maximum retry limit\n\n## Example\n\`\`\`javascript\nfetchWithRetry('https://api.example.com/data')\n  .then(data => console.log(data));\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'Objects': [
    {
      title: 'Object Property Access',
      description: `# Object Property Access\n\nCreate functions to safely access nested object properties.\n\n## Requirements\n1. Safe property access\n2. Default values\n3. Array support\n\n## Example\n\`\`\`javascript\nget(obj, 'user.address.street', 'default');\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Object Transformation',
      description: `# Object Transformation\n\nImplement functions to transform object structures.\n\n## Requirements\n1. Key mapping\n2. Value transformation\n3. Nested object support\n\n## Example\n\`\`\`javascript\ntransform(obj, { 'user.name': 'person.fullName' });\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Deep Object Clone',
      description: `# Deep Object Clone\n\nImplement a function to create a deep clone of an object.\n\n## Requirements\n1. Handle circular references\n2. Clone all types\n3. Preserve prototypes\n\n## Example\n\`\`\`javascript\nconst cloned = deepClone(complexObject);\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'HOFs': [
    {
      title: 'Array Map Implementation',
      description: `# Array Map Implementation\n\nCreate your own version of Array.map.\n\n## Requirements\n1. Same behavior as native map\n2. Context binding\n3. Index and array arguments\n\n## Example\n\`\`\`javascript\nmyMap([1, 2, 3], x => x * 2);\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Custom Filter Chain',
      description: `# Custom Filter Chain\n\nImplement a chainable filter system using higher-order functions.\n\n## Requirements\n1. Multiple filters\n2. Chain operations\n3. Lazy evaluation\n\n## Example\n\`\`\`javascript\nfilter(users)\n  .byAge(18)\n  .byCountry('US')\n  .execute();\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Implement Event System',
      description: `# Implement Event System\n\nCreate a custom event system with higher-order functions.\n\n## Requirements\n1. Event subscription\n2. Event emission\n3. Middleware support\n\n## Example\n\`\`\`javascript\neventSystem.on('user:created', handler);\neventSystem.emit('user:created', data);\n\`\`\``,
      difficulty: 'hard'
    }
  ],
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

// Test cases
console.log(binarySearch([1, 2, 3, 4, 5], 3)); // Should return 2
console.log(binarySearch([1, 2, 3, 4, 5], 6)); // Should return -1
console.log(binarySearch([], 1)); // Should return -1`,
      output: `2
-1
-1`,
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
3. Handle edge cases (empty array, null/undefined inputs)
4. Ensure the input array is sorted
5. Add appropriate error handling

## Example
\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
jumpSearch(arr, 3); // Returns 2
jumpSearch(arr, 6); // Returns -1
\`\`\``,
      input: `function jumpSearch(arr, target) {
  // Your implementation
}

// Test cases
console.log(jumpSearch([1, 2, 3, 4, 5], 3)); // Should return 2
console.log(jumpSearch([1, 2, 3, 4, 5], 6)); // Should return -1
console.log(jumpSearch([], 1)); // Should return -1`,
      output: `2
-1
-1`,
      difficulty: 'hard'
    }
  ],
  'Promises': [
    {
      title: 'Implement Promise.all',
      description: `# Implement Promise.all\n\nCreate your own implementation of Promise.all.\n\n## Requirements\n1. Handle multiple promises\n2. Maintain order of results\n3. Handle errors properly\n\n## Example\n\`\`\`javascript\nmyPromiseAll([p1, p2, p3]).then(console.log);\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Promise Chain Builder',
      description: `# Promise Chain Builder\n\nCreate a utility to build and manage promise chains.\n\n## Requirements\n1. Chain multiple promises\n2. Handle errors in chain\n3. Support parallel execution\n\n## Example\n\`\`\`javascript\nchain()\n  .then(fetchUser)\n  .then(fetchPosts)\n  .catch(handleError);\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Basic Promise Creation',
      description: `# Basic Promise Creation\n\nCreate promises to handle async operations.\n\n## Requirements\n1. Create promise wrapper\n2. Handle success and failure\n3. Add timeout support\n\n## Example\n\`\`\`javascript\nconst promise = createPromise((resolve, reject) => {\n  // async operation\n});\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'Arrow functions': [
    {
      title: 'Refactor to Arrow Functions',
      description: `# Refactor to Arrow Functions\n\nRefactor traditional functions to arrow functions while maintaining correct behavior.\n\n## Requirements\n1. Handle this binding correctly\n2. Preserve function behavior\n3. Use concise syntax where appropriate\n\n## Example\n\`\`\`javascript\n// Convert these functions\nfunction add(a, b) { return a + b; }\nconst multiply = function(a, b) { return a * b; }\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Event Handler Conversion',
      description: `# Event Handler Conversion\n\nConvert event handlers to arrow functions.\n\n## Requirements\n1. Maintain this context\n2. Handle event parameters\n3. Support method chaining\n\n## Example\n\`\`\`javascript\nbutton.addEventListener('click', function() { this.handleClick(); });\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Advanced Arrow Patterns',
      description: `# Advanced Arrow Patterns\n\nImplement advanced patterns using arrow functions.\n\n## Requirements\n1. Currying with arrows\n2. Composition with arrows\n3. Generator integration\n\n## Example\n\`\`\`javascript\nconst compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'Arrays': [
    {
      title: 'Array Operations',
      description: `# Array Operations\n\nImplement common array operations without using built-in methods.\n\n## Requirements\n1. Push implementation\n2. Pop implementation\n3. Shift implementation\n4. Unshift implementation\n\n## Example\n\`\`\`javascript\nconst arr = createArray();\narr.customPush(1);\narr.customPop();\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Array Transformation',
      description: `# Array Transformation\n\nImplement array transformation utilities.\n\n## Requirements\n1. Map implementation\n2. Filter implementation\n3. Reduce implementation\n\n## Example\n\`\`\`javascript\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = customMap(numbers, n => n * 2);\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Advanced Array Methods',
      description: `# Advanced Array Methods\n\nImplement advanced array manipulation methods.\n\n## Requirements\n1. Flatten nested arrays\n2. Group by property\n3. Custom sorting\n\n## Example\n\`\`\`javascript\nconst nested = [1, [2, 3], [4, [5, 6]]];\nflatten(nested); // [1, 2, 3, 4, 5, 6]\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'Key-Value Pairs': [
    {
      title: 'Implement HashMap',
      description: `# Implement HashMap\n\nCreate a HashMap implementation with basic operations.\n\n## Requirements\n1. Set key-value pairs\n2. Get values by key\n3. Handle collisions\n4. Delete key-value pairs\n\n## Example\n\`\`\`javascript\nconst map = new HashMap();\nmap.set('key', 'value');\nmap.get('key');\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Cache Implementation',
      description: `# Cache Implementation\n\nCreate a simple cache using key-value pairs.\n\n## Requirements\n1. Set cache entries\n2. Get cached values\n3. Implement expiry\n4. Handle cache size\n\n## Example\n\`\`\`javascript\nconst cache = new Cache();\ncache.set('key', 'value', 60); // 60 seconds expiry\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Dictionary Operations',
      description: `# Dictionary Operations\n\nImplement basic dictionary operations.\n\n## Requirements\n1. Add entries\n2. Remove entries\n3. Update values\n4. Clear dictionary\n\n## Example\n\`\`\`javascript\nconst dict = new Dictionary();\ndict.add('key', 'value');\ndict.remove('key');\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'Linked List': [
    {
      title: 'Singly Linked List',
      description: `# Singly Linked List\n\nImplement a singly linked list with basic operations.\n\n## Requirements\n1. Insert nodes\n2. Delete nodes\n3. Search for values\n4. Reverse the list\n\n## Example\n\`\`\`javascript\nconst list = new LinkedList();\nlist.insert(1);\nlist.delete(1);\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Doubly Linked List',
      description: `# Doubly Linked List\n\nImplement a doubly linked list.\n\n## Requirements\n1. Forward traversal\n2. Backward traversal\n3. Insert/delete operations\n4. Node manipulation\n\n## Example\n\`\`\`javascript\nconst list = new DoublyLinkedList();\nlist.insertAtHead(1);\nlist.insertAtTail(2);\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Circular Linked List',
      description: `# Circular Linked List\n\nImplement a circular linked list.\n\n## Requirements\n1. Circular traversal\n2. Insert operations\n3. Delete operations\n4. Find cycle\n\n## Example\n\`\`\`javascript\nconst list = new CircularList();\nlist.insert(1);\nlist.hasCycle(); // true\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'Sorting': [
    {
      title: 'Implement Quick Sort',
      description: `# Implement Quick Sort\n\nImplement the quick sort algorithm.\n\n## Requirements\n1. In-place sorting\n2. Handle edge cases\n3. Choose good pivot\n4. Handle duplicates\n\n## Example\n\`\`\`javascript\nquickSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]);\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Merge Sort Implementation',
      description: `# Merge Sort Implementation\n\nImplement the merge sort algorithm.\n\n## Requirements\n1. Divide and conquer\n2. Merge operation\n3. Handle edge cases\n4. Space complexity\n\n## Example\n\`\`\`javascript\nmergeSort([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]);\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Bubble Sort',
      description: `# Bubble Sort\n\nImplement the bubble sort algorithm.\n\n## Requirements\n1. Basic implementation\n2. Optimization\n3. Early termination\n4. Comparison count\n\n## Example\n\`\`\`javascript\nbubbleSort([64, 34, 25, 12, 22, 11, 90]);\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'Recursive algos': [
    {
      title: 'Tree Traversal',
      description: `# Tree Traversal\n\nImplement recursive tree traversal algorithms.\n\n## Requirements\n1. Inorder traversal\n2. Preorder traversal\n3. Postorder traversal\n4. Level-order traversal\n\n## Example\n\`\`\`javascript\ninorderTraversal(root);\npreorderTraversal(root);\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Fibonacci Sequence',
      description: `# Fibonacci Sequence\n\nImplement recursive fibonacci sequence calculator.\n\n## Requirements\n1. Basic recursion\n2. Memoization\n3. Handle edge cases\n4. Performance optimization\n\n## Example\n\`\`\`javascript\nfibonacci(10); // Returns 55\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Backtracking Problems',
      description: `# Backtracking Problems\n\nImplement solutions using backtracking.\n\n## Requirements\n1. N-Queens problem\n2. Sudoku solver\n3. Path finding\n4. Combination generation\n\n## Example\n\`\`\`javascript\nsolveNQueens(4); // Returns all valid placements\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'useEffect': [
    {
      title: 'Data Fetching',
      description: `# Data Fetching with useEffect\n\nImplement data fetching using useEffect hook.\n\n## Requirements\n1. Fetch data on mount\n2. Handle loading state\n3. Handle errors\n4. Clean up resources\n\n## Example\n\`\`\`javascript\nuseEffect(() => {\n  fetchData();\n  return () => cleanup();\n}, []);\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Subscription Management',
      description: `# Subscription Management\n\nManage subscriptions with useEffect.\n\n## Requirements\n1. Subscribe to events\n2. Unsubscribe cleanup\n3. Handle dependencies\n4. Prevent memory leaks\n\n## Example\n\`\`\`javascript\nuseEffect(() => {\n  const subscription = subscribe();\n  return () => subscription.unsubscribe();\n}, []);\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Simple Timer',
      description: `# Simple Timer\n\nImplement a timer using useEffect.\n\n## Requirements\n1. Start timer\n2. Stop timer\n3. Reset functionality\n4. Cleanup interval\n\n## Example\n\`\`\`javascript\nuseEffect(() => {\n  const timer = setInterval(() => tick(), 1000);\n  return () => clearInterval(timer);\n}, []);\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'useState': [
    {
      title: 'Counter Component',
      description: `# Counter Component\n\nCreate a counter component using useState.\n\n## Requirements\n1. Increment/decrement\n2. Reset functionality\n3. Step size control\n4. Min/max limits\n\n## Example\n\`\`\`javascript\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Form Management',
      description: `# Form Management\n\nManage form state with useState.\n\n## Requirements\n1. Multiple fields\n2. Validation\n3. Submit handling\n4. Reset form\n\n## Example\n\`\`\`javascript\nconst [formData, setFormData] = useState({ name: '', email: '' });\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Complex State Logic',
      description: `# Complex State Logic\n\nImplement complex state management.\n\n## Requirements\n1. Nested state\n2. Array state\n3. Object updates\n4. State dependencies\n\n## Example\n\`\`\`javascript\nconst [state, setState] = useState({ users: [], settings: {} });\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'contextAPI': [
    {
      title: 'Theme Provider',
      description: `# Theme Provider\n\nImplement a theme provider using Context API.\n\n## Requirements\n1. Theme context\n2. Theme provider\n3. Theme consumer\n4. Theme toggler\n\n## Example\n\`\`\`javascript\nconst ThemeContext = React.createContext();\nfunction ThemeProvider({ children }) {\n  // Implementation\n}\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Authentication Context',
      description: `# Authentication Context\n\nImplement authentication using Context API.\n\n## Requirements\n1. Auth provider\n2. Login/logout\n3. Protected routes\n4. Auth state management\n\n## Example\n\`\`\`javascript\nconst AuthContext = React.createContext();\nfunction useAuth() { return useContext(AuthContext); }\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Language Switcher',
      description: `# Language Switcher\n\nImplement a language switcher using Context.\n\n## Requirements\n1. Language context\n2. Translation provider\n3. Language selector\n4. Default language\n\n## Example\n\`\`\`javascript\nconst LanguageContext = React.createContext();\nfunction useTranslation() { return useContext(LanguageContext); }\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'Routing': [
    {
      title: 'Protected Routes',
      description: `# Protected Routes\n\nImplement protected routes with React Router.\n\n## Requirements\n1. Authentication check\n2. Redirect logic\n3. Route guards\n4. Nested routes\n\n## Example\n\`\`\`javascript\nfunction ProtectedRoute({ children }) {\n  return isAuthenticated ? children : <Navigate to="/login" />;\n}\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Dynamic Routes',
      description: `# Dynamic Routes\n\nImplement dynamic routing with parameters.\n\n## Requirements\n1. Route parameters\n2. Query parameters\n3. Optional parameters\n4. Nested routes\n\n## Example\n\`\`\`javascript\n<Route path="/user/:id" element={<UserProfile />} />\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Basic Navigation',
      description: `# Basic Navigation\n\nImplement basic navigation with React Router.\n\n## Requirements\n1. Route setup\n2. Navigation links\n3. Route matching\n4. Default routes\n\n## Example\n\`\`\`javascript\n<Routes>\n  <Route path="/" element={<Home />} />\n  <Route path="/about" element={<About />} />\n</Routes>\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'SQL': [
    {
      title: 'Complex Joins',
      description: `# Complex SQL Joins\n\nWrite SQL queries with multiple joins and aggregations.\n\n## Requirements\n1. Multiple table joins\n2. Aggregation functions\n3. Group by clauses\n4. Having clauses\n\n## Example\n\`\`\`sql\nSELECT * FROM orders\nJOIN customers ON orders.customer_id = customers.id\nGROUP BY customer_id\nHAVING COUNT(*) > 5;\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Data Analysis',
      description: `# SQL Data Analysis\n\nWrite analytical SQL queries.\n\n## Requirements\n1. Window functions\n2. CTEs\n3. Subqueries\n4. Analytics\n\n## Example\n\`\`\`sql\nWITH monthly_sales AS (\n  SELECT date_trunc('month', order_date) as month,\n         SUM(amount) as total\n  FROM orders\n  GROUP BY 1\n)\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Basic CRUD',
      description: `# Basic CRUD Operations\n\nImplement basic CRUD operations in SQL.\n\n## Requirements\n1. Insert data\n2. Select data\n3. Update records\n4. Delete records\n\n## Example\n\`\`\`sql\nINSERT INTO users (name, email) VALUES ('John', 'john@example.com');\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'NoSQL': [
    {
      title: 'MongoDB Aggregation',
      description: `# MongoDB Aggregation Pipeline\n\nCreate a complex aggregation pipeline.\n\n## Requirements\n1. Multiple stages\n2. Grouping operations\n3. Lookup operations\n4. Project operations\n\n## Example\n\`\`\`javascript\ndb.collection.aggregate([\n  { $match: { status: "active" } },\n  { $group: { _id: "$category" } }\n]);\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Document Operations',
      description: `# Document Operations\n\nImplement document-level operations.\n\n## Requirements\n1. CRUD operations\n2. Nested updates\n3. Array operations\n4. Bulk operations\n\n## Example\n\`\`\`javascript\ndb.collection.updateMany(\n  { status: "pending" },\n  { $set: { status: "processed" } }\n);\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Basic Queries',
      description: `# Basic NoSQL Queries\n\nImplement basic NoSQL queries.\n\n## Requirements\n1. Find documents\n2. Simple filters\n3. Sort operations\n4. Limit results\n\n## Example\n\`\`\`javascript\ndb.collection.find({ status: "active" }).sort({ date: -1 }).limit(10);\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'Tuples': [
    {
      title: 'Tuple Operations',
      description: `# Python Tuple Operations\n\nImplement various tuple operations.\n\n## Requirements\n1. Tuple packing\n2. Tuple unpacking\n3. Tuple methods\n4. Tuple conversions\n\n## Example\n\`\`\`python\ndef swap(a, b):\n    return b, a\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Named Tuples',
      description: `# Named Tuples\n\nWork with named tuples in Python.\n\n## Requirements\n1. Create named tuples\n2. Access fields\n3. Convert to dict\n4. Replace fields\n\n## Example\n\`\`\`python\nfrom collections import namedtuple\nPoint = namedtuple('Point', ['x', 'y'])\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Advanced Tuple Usage',
      description: `# Advanced Tuple Usage\n\nImplement advanced tuple patterns.\n\n## Requirements\n1. Multiple assignment\n2. Tuple as keys\n3. Nested tuples\n4. Tuple algorithms\n\n## Example\n\`\`\`python\ndef merge_tuples(t1, t2):\n    return tuple(sorted(t1 + t2))\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'dictionary': [
    {
      title: 'Dictionary Manipulation',
      description: `# Python Dictionary Manipulation\n\nImplement dictionary operations and transformations.\n\n## Requirements\n1. Merge dictionaries\n2. Nested updates\n3. Dictionary comprehension\n4. Default values\n\n## Example\n\`\`\`python\ndef merge_dicts(dict1, dict2):\n    return {**dict1, **dict2}\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Dictionary Views',
      description: `# Dictionary Views\n\nWork with dictionary views in Python.\n\n## Requirements\n1. Keys view\n2. Values view\n3. Items view\n4. View operations\n\n## Example\n\`\`\`python\ndef process_views(d):\n    return list(d.keys()), list(d.values())\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Custom Dictionary',
      description: `# Custom Dictionary Implementation\n\nImplement a custom dictionary class.\n\n## Requirements\n1. Custom methods\n2. Special methods\n3. Dictionary protocol\n4. Custom behavior\n\n## Example\n\`\`\`python\nclass CustomDict(dict):\n    def __missing__(self, key):\n        return 'Not Found'\n\`\`\``,
      difficulty: 'hard'
    }
  ],
  'functions': [
    {
      title: 'Python Decorators',
      description: `# Python Function Decorators\n\nImplement function decorators for various purposes.\n\n## Requirements\n1. Timing decorator\n2. Logging decorator\n3. Cache decorator\n4. Retry decorator\n\n## Example\n\`\`\`python\n@timing_decorator\ndef slow_function():\n    time.sleep(1)\n\`\`\``,
      difficulty: 'hard'
    },
    {
      title: 'Function Arguments',
      description: `# Function Arguments\n\nWork with different types of function arguments.\n\n## Requirements\n1. Positional args\n2. Keyword args\n3. Default values\n4. Variable args\n\n## Example\n\`\`\`python\ndef flexible_function(*args, **kwargs):\n    pass\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'Basic Functions',
      description: `# Basic Python Functions\n\nImplement basic function patterns.\n\n## Requirements\n1. Function definition\n2. Return values\n3. Parameters\n4. Docstrings\n\n## Example\n\`\`\`python\ndef greet(name):\n    """Greet a person"""\n    return f"Hello, {name}!"\n\`\`\``,
      difficulty: 'easy'
    }
  ],
  'file handling': [
    {
      title: 'File Processing',
      description: `# Python File Processing\n\nImplement file processing operations.\n\n## Requirements\n1. Read operations\n2. Write operations\n3. Context managers\n4. Error handling\n\n## Example\n\`\`\`python\nwith open('file.txt', 'r') as f:\n    content = f.read()\n\`\`\``,
      difficulty: 'medium'
    },
    {
      title: 'CSV Operations',
      description: `# CSV File Operations\n\nWork with CSV files in Python.\n\n## Requirements\n1. Read CSV\n2. Write CSV\n3. Data processing\n4. Custom dialects\n\n## Example\n\`\`\`python\nimport csv\nwith open('data.csv', 'r') as f:\n    reader = csv.reader(f)\n\`\`\``,
      difficulty: 'easy'
    },
    {
      title: 'Binary Files',
      description: `# Binary File Handling\n\nWork with binary files in Python.\n\n## Requirements\n1. Read binary\n2. Write binary\n3. Seek operations\n4. Buffer handling\n\n## Example\n\`\`\`python\nwith open('data.bin', 'rb') as f:\n    data = f.read(1024)\n\`\`\``,
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