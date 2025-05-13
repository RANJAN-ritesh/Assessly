import mongoose from 'mongoose';
import { Subject } from './models/Subject';
import { Topic } from './models/Topic';
import { Problem } from './models/Problem';
import { connectDB } from './config/db';
import { Recap } from './models/Recap';

const problemsByTopic: Record<string, { title: string; description: string; input?: string; output?: string; difficulty: 'easy' | 'medium' | 'hard' }[]> = {
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
\`\`\``,
      input: `function myMap(arr, callback) {
  // Your implementation
}

// Test cases
console.log(myMap([1, 2, 3], x => x * 2)); // Should return [2, 4, 6]
console.log(myMap(['a', 'b', 'c'], (x, i) => x + i)); // Should return ['a0', 'b1', 'c2']`,
      output: `[2, 4, 6]
['a0', 'b1', 'c2']`,
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
\`\`\``,
      input: `function myForEach(arr, callback) {
  // Your implementation
}

// Test cases
let sum = 0;
myForEach([1, 2, 3], x => sum += x);
console.log(sum); // Should print 6

let doubled = [];
myForEach([1, 2, 3], x => doubled.push(x * 2));
console.log(doubled); // Should print [2, 4, 6]`,
      output: `6
[2, 4, 6]`,
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
\`\`\``,
      input: `function runIfTrue(functions, value) {
  // Your implementation
}

// Test cases
const results = [];
runIfTrue([
  x => { results.push('A'); return x > 10; },
  x => { results.push('B'); return x % 2 === 0; },
  x => { results.push('C'); return x < 5; }
], 12);
console.log(results); // Should print ['A', 'B']`,
      output: `['A', 'B']`,
      difficulty: 'easy'
    },
    {
      title: 'Memoization Utility',
      description: `# Memoization Utility

Create a function that memoizes the results of expensive computations.

## Requirements
1. Accept a function to memoize
2. Cache results based on arguments
3. Return cached result if available

## Example
\`\`\`javascript
const memoizedFn = memoize(expensiveOperation);
memoizedFn(5); // computes
memoizedFn(5); // returns cached
\`\`\``,
      input: `function memoize(fn) {
  // Your implementation
}

// Test cases
const expensiveOperation = (n) => {
  console.log('Computing...');
  return n * n;
};

const memoizedSquare = memoize(expensiveOperation);
console.log(memoizedSquare(5)); // Should print "Computing..." and 25
console.log(memoizedSquare(5)); // Should print 25 (from cache)
console.log(memoizedSquare(6)); // Should print "Computing..." and 36`,
      output: `Computing...
25
25
Computing...
36`,
      difficulty: 'medium'
    },
    {
      title: 'Function Pipeline Executor',
      description: `# Function Pipeline Executor

Create a utility that executes a series of functions in sequence, passing the result of each to the next.

## Requirements
1. Accept array of functions
2. Execute in order
3. Pass result to next function

## Example
\`\`\`javascript
pipe([
  x => x + 1,
  x => x * 2
])(5); // 12
\`\`\``,
      input: `function pipe(functions) {
  // Your implementation
}

// Test cases
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const pipeline = pipe([addOne, double, square]);
console.log(pipeline(5)); // Should print 144 (5+1=6, 6*2=12, 12*12=144)

const pipeline2 = pipe([double, addOne]);
console.log(pipeline2(3)); // Should print 7 (3*2=6, 6+1=7)`,
      output: `144
7`,
      difficulty: 'medium'
    },
    {
      title: 'Debounce Function',
      description: `# Debounce Function

Implement a debounce function that delays the execution of a function until after a specified wait time.

## Requirements
1. Accept function and wait time
2. Cancel previous pending execution
3. Execute only after wait time

## Example
\`\`\`javascript
const debouncedFn = debounce(fn, 1000);
debouncedFn(); // delayed
debouncedFn(); // previous cancelled
\`\`\``,
      input: `function debounce(fn, wait) {
  // Your implementation
}

// Test cases
let count = 0;
const increment = () => {
  count++;
  console.log('Count:', count);
};

const debouncedIncrement = debounce(increment, 1000);

// Call multiple times
debouncedIncrement();
debouncedIncrement();
debouncedIncrement();

// After 1 second, should only execute once
setTimeout(() => {
  console.log('Final count:', count); // Should print 1
}, 1100);`,
      output: `Count: 1
Final count: 1`,
      difficulty: 'medium'
    },
    {
      title: 'Throttle Function',
      description: `# Throttle Function

Implement a throttle function that limits how often a function can be called.

## Requirements
1. Accept function and time limit
2. Execute at most once per time limit
3. Maintain execution rate

## Example
\`\`\`javascript
const throttledFn = throttle(fn, 1000);
throttledFn(); // executes
throttledFn(); // ignored
// after 1s
throttledFn(); // executes
\`\`\``,
      input: `function throttle(fn, limit) {
  // Your implementation
}

// Test cases
let count = 0;
const increment = () => {
  count++;
  console.log('Count:', count);
};

const throttledIncrement = throttle(increment, 1000);

// Call multiple times
throttledIncrement(); // Should execute
throttledIncrement(); // Should be ignored
throttledIncrement(); // Should be ignored

// After 1 second
setTimeout(() => {
  throttledIncrement(); // Should execute
  console.log('Final count:', count); // Should print 2
}, 1100);`,
      output: `Count: 1
Count: 2
Final count: 2`,
      difficulty: 'medium'
    },
    {
      title: 'Event Emitter',
      description: `# Event Emitter

Create a simple event emitter that allows subscribing to and emitting events.

## Requirements
1. Support multiple event types
2. Allow multiple subscribers
3. Pass data to subscribers

## Example
\`\`\`javascript
const emitter = new EventEmitter();
emitter.on('event', data => console.log(data));
emitter.emit('event', 'hello'); // logs: hello
\`\`\``,
      input: `class EventEmitter {
  // Your implementation
}

// Test cases
const emitter = new EventEmitter();

// Subscribe to events
emitter.on('greet', name => console.log('Hello', name));
emitter.on('greet', name => console.log('Hi', name));
emitter.on('farewell', name => console.log('Goodbye', name));

// Emit events
emitter.emit('greet', 'John');
emitter.emit('farewell', 'John');`,
      output: `Hello John
Hi John
Goodbye John`,
      difficulty: 'hard'
    },
    {
      title: 'Compose Function',
      description: `# Compose Function

Implement a function that composes multiple functions from right to left.

## Requirements
1. Accept multiple functions
2. Execute right to left
3. Pass result through chain

## Example
\`\`\`javascript
const addOne = x => x + 1;
const double = x => x * 2;
compose(addOne, double)(5); // 11
\`\`\``,
      input: `function compose(...functions) {
  // Your implementation
}

// Test cases
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const addOneThenDouble = compose(double, addOne);
console.log(addOneThenDouble(5)); // Should print 12 (5+1=6, 6*2=12)

const complexOperation = compose(square, double, addOne);
console.log(complexOperation(3)); // Should print 49 (3+1=4, 4*2=8, 8*8=64)`,
      output: `12
64`,
      difficulty: 'hard'
    }
  ],
  'Promises': [
    {
      title: 'Delayed Hello Promise',
      description: `# Delayed Hello Promise

Create a function `delayedHello` that returns a Promise which resolves to the string `"Hello, World!"` after 1 second.

## Requirements
1. Return a Promise using `setTimeout`
2. Resolve with the message after 1 second

## Example
```javascript
delayedHello().then(console.log); // "Hello, World!"
```
`,
      input: `function delayedHello() {
  // Your implementation
}

delayedHello().then(console.log); // Should print "Hello, World!" after 1 second`,
      output: `Hello, World!`,
      difficulty: 'easy'
    },
    {
      title: 'Async Sum with Validation',
      description: `# Async Sum with Validation

Write a function `sumAsync(a, b)` that returns a Promise. It resolves with the sum after 500ms. If either input is not a number, reject with an error.

## Requirements
1. Validate inputs
2. Resolve with sum or reject with "Invalid input: numbers expected"

## Example
```javascript
sumAsync(10, 5).then(console.log); // 15
sumAsync("a", 3).catch(console.error); // "Invalid input: numbers expected"
```
`,
      input: `function sumAsync(a, b) {
  // Your implementation
}

sumAsync(10, 5).then(console.log); // Should print 15 after 500ms
sumAsync("a", 3).catch(console.error); // Should print "Invalid input: numbers expected"`,
      output: `15
Invalid input: numbers expected`,
      difficulty: 'easy'
    },
    {
      title: 'Fetch User Data Simulated',
      description: `# Fetch User Data Simulated

Create a function `fetchUser(id)` that returns a Promise. Resolve with user data if `id === 1`, otherwise reject with "User not found".

## Requirements
1. Use `setTimeout` to delay response
2. Conditionally resolve or reject

## Example
```javascript
fetchUser(1).then(console.log); // { id: 1, name: "Alice" }
fetchUser(2).catch(console.error); // "User not found"
```
`,
      input: `function fetchUser(id) {
  // Your implementation
}

fetchUser(1).then(console.log); // Should print { id: 1, name: "Alice" }
fetchUser(2).catch(console.error); // Should print "User not found"`,
      output: `{ id: 1, name: "Alice" }
User not found`,
      difficulty: 'easy'
    },
    {
      title: 'Chained Promise Calls',
      description: `# Chained Promise Calls

Implement `getTopCommentByUser(userId)` that calls three async functions: `getUser`, `getPostsByUser`, and `getTopCommentFromPost`, returning the top comment of the user's first post.

## Requirements
1. Call APIs in sequence using Promises
2. Return the top comment object

## Example
```javascript
getTopCommentByUser(1).then(console.log); 
// { id: 101, text: "Top comment from first post" }
```
`,
      input: `// Assume getUser, getPostsByUser, getTopCommentFromPost are defined
function getTopCommentByUser(userId) {
  // Your implementation
}

getTopCommentByUser(1).then(console.log); // Should print { id: 101, text: "Top comment from first post" }`,
      output: `{ id: 101, text: "Top comment from first post" }`,
      difficulty: 'medium'
    },
    {
      title: 'Print Strings with Delay',
      description: `# Print Strings with Delay

Write a function `printWithDelay(arr)` that prints strings one after another with a 1 second delay between each.

## Requirements
1. Use Promises and `setTimeout`
2. No recursion allowed

## Example
```javascript
printWithDelay(["One", "Two", "Three"]);
// Output (1s apart): One, Two, Three
```
`,
      input: `function printWithDelay(arr) {
  // Your implementation
}

printWithDelay(["One", "Two", "Three"]); // Should print "One", then "Two", then "Three" each 1s apart`,
      output: `One
Two
Three`,
      difficulty: 'medium'
    },
    {
      title: 'Promise with Timeout Fallback',
      description: `# Promise with Timeout Fallback

Create a function `fetchWithTimeout(promise, timeout)` that races a Promise against a timeout duration and rejects with "Request timed out" if exceeded.

## Requirements
1. Use `Promise.race()`
2. Handle timeout fallback

## Example
```javascript
fetchWithTimeout(fetchData(), 2000)
  .then(console.log)
  .catch(console.error);
// Output: "Request timed out" if delayed
```
`,
      input: `function fetchWithTimeout(promise, timeout) {
  // Your implementation
}

// Example usage:
fetchWithTimeout(new Promise(resolve => setTimeout(() => resolve("Done"), 3000)), 1000)
  .then(console.log)
  .catch(console.error); // Should print "Request timed out"`,
      output: `Request timed out`,
      difficulty: 'medium'
    },
    {
      title: 'Custom allSettled Polyfill',
      description: `# Custom allSettled Polyfill

Implement `allSettledPolyfill(promises)` to return an array of result objects indicating status and value or reason, like native `Promise.allSettled`.

## Requirements
1. Accept an array of Promises
2. Return fulfilled/rejected results

## Example
```javascript
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
```
`,
      input: `function allSettledPolyfill(promises) {
  // Your implementation
}

allSettledPolyfill([
  Promise.resolve("A"),
  Promise.reject("B")
]).then(console.log);`,
      output: `[
  { status: "fulfilled", value: "A" },
  { status: "rejected", reason: "B" }
]`,
      difficulty: 'hard'
    },
    {
      title: 'Retry Failed Async Function',
      description: `# Retry Failed Async Function

Write `retry(fn, retries)` that retries a rejected async function up to `retries` times, waiting 500ms between each attempt.

## Requirements
1. Retry on failure
2. Resolve if successful, reject if all attempts fail

## Example
```javascript
retry(() => unstableFetch(), 3)
  .then(console.log)
  .catch(console.error);
// Output: Fetched or "Failed after 3 attempts"
```
`,
      input: `function retry(fn, retries) {
  // Your implementation
}

// Example usage:
let attempt = 0;
function unstableFetch() {
  return new Promise((resolve, reject) => {
    attempt++;
    if (attempt === 3) resolve("Fetched");
    else reject("Fail");
  });
}

retry(unstableFetch, 3)
  .then(console.log)
  .catch(console.error);`,
      output: `Fetched
Failed after 3 attempts`,
      difficulty: 'hard'
    },
    {
      title: 'Limited Concurrent Execution (Pool)',
      description: `# Limited Concurrent Execution (Pool)

Create `promisePool(tasks, limit)` to execute async functions in a pool with a concurrency cap.

## Requirements
1. Run at most `limit` Promises in parallel
2. Resolve when all tasks complete

## Example
```javascript
promisePool([task1, task2, task3], 2)
  .then(() => console.log("All done"));
```
`,
      input: `function promisePool(tasks, limit) {
  // Your implementation
}

// Example usage:
function taskFactory(id, delay) {
  return () => new Promise(resolve => setTimeout(() => {
    console.log("Task", id, "done");
    resolve();
  }, delay));
}

const tasks = [taskFactory(1, 1000), taskFactory(2, 500), taskFactory(3, 1500)];
promisePool(tasks, 2).then(() => console.log("All done"));`,
      output: `Task 1 done
Task 2 done
Task 3 done
All done`,
      difficulty: 'hard'
    }
  ],
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
```javascript
const counter = createCounter(0);
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
```
`,
      input: `function createCounter(start) {
  // Your implementation
}

const counter = createCounter(0);
console.log(counter.increment()); // Should print 1
console.log(counter.increment()); // Should print 2
console.log(counter.decrement()); // Should print 1`,
      output: `1
2
1`,
      difficulty: 'easy'
    },
    {
      title: 'Once Function Executor',
      description: `# Once Function Executor

Write a function `once(fn)` that ensures the passed function can only be executed once. On subsequent calls, it should return the result of the first invocation.

## Requirements
1. Use closures to track internal state
2. Return a new function that wraps the original
3. Ignore subsequent arguments after first call

## Example
```javascript
const initialize = once(() => console.log("Initialized!"));
initialize(); // "Initialized!"
initialize(); // nothing
```
`,
      input: `function once(fn) {
  // Your implementation
}

const initialize = once(() => "Initialized!");
console.log(initialize()); // Should print "Initialized!"
console.log(initialize()); // Should print "Initialized!" (but not call fn again)`,
      output: `Initialized!
Initialized!`,
      difficulty: 'easy'
    },
    {
      title: 'Create Multiplier Factory',
      description: `# Create Multiplier Factory

Write a function `createMultiplier(factor)` that returns a new function which multiplies any number by that factor.

## Requirements
1. Closure must remember the original factor
2. Support multiple independent multipliers

## Example
```javascript
const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5); // 10
triple(4); // 12
```
`,
      input: `function createMultiplier(factor) {
  // Your implementation
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5)); // Should print 10
console.log(triple(4)); // Should print 12`,
      output: `10
12`,
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
```javascript
const account = createAccount();
account.deposit(100);
account.withdraw(30);
account.getBalance(); // 70
```
`,
      input: `function createAccount() {
  // Your implementation
}

const account = createAccount();
account.deposit(100);
account.withdraw(30);
console.log(account.getBalance()); // Should print 70`,
      output: `70`,
      difficulty: 'medium'
    },
    {
      title: 'Custom Event Emitter',
      description: `# Custom Event Emitter

Build a simple event emitter using closures. Allow listeners to subscribe, unsubscribe, and emit events.

## Requirements
1. Register multiple listeners per event
2. Use closures to manage internal event mapping
3. Provide `on`, `off`, and `emit` methods

## Example
```javascript
const emitter = createEmitter();
emitter.on('greet', name => console.log(`Hello, ${name}!`));
emitter.emit('greet', 'Alice'); // "Hello, Alice!"
```
`,
      input: `function createEmitter() {
  // Your implementation
}

const emitter = createEmitter();
emitter.on('greet', name => console.log(`Hello, ${name}!`));
emitter.emit('greet', 'Alice'); // Should print "Hello, Alice!"`,
      output: `Hello, Alice!`,
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
```javascript
const wrapped = timeLogger(slowAdd);
wrapped(5, 10); 
// Output: "Function took 200ms" (example)
```
`,
      input: `function timeLogger(fn) {
  // Your implementation
}

function slowAdd(a, b) {
  const start = Date.now();
  while (Date.now() - start < 100) {}
  return a + b;
}

const wrapped = timeLogger(slowAdd);
console.log(wrapped(5, 10)); // Should print 15 and log time taken`,
      output: `15
Function took 100ms`,
      difficulty: 'medium'
    },
    {
      title: 'Implement Currying',
      description: `# Implement Currying

Write a function `curry(fn)` that transforms a function of N arguments into N chained calls.

## Requirements
1. Support functions of arbitrary arity
2. Return partially applied functions on each call
3. Final call returns result

## Example
```javascript
function add(a, b, c) {
  return a + b + c;
}
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
```
`,
      input: `function curry(fn) {
  // Your implementation
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // Should print 6`,
      output: `6`,
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
```javascript
const square = x => x * x;
const memoizedSquare = memoize(square);
memoizedSquare(4); // computes
memoizedSquare(4); // uses cache
```
`,
      input: `function memoize(fn) {
  // Your implementation
}

const square = x => x * x;
const memoizedSquare = memoize(square);
console.log(memoizedSquare(4)); // Should print 16 (computes)
console.log(memoizedSquare(4)); // Should print 16 (from cache)`,
      output: `16
16`,
      difficulty: 'hard'
    },
    {
      title: 'Throttle Function Execution',
      description: `# Throttle Function Execution

Write a function `throttle(fn, delay)` that limits the execution of `fn` to once every `delay` milliseconds using closures.

## Requirements
1. Return a throttled version of the function
2. Internal state must be preserved using closure
3. Ignore calls made during throttle period

## Example
```javascript
const log = () => console.log('Hello!');
const throttledLog = throttle(log, 2000);
throttledLog(); // executes
throttledLog(); // ignored (within 2s)
```
`,
      input: `function throttle(fn, delay) {
  // Your implementation
}

let count = 0;
const log = () => { count++; console.log('Hello!'); };
const throttledLog = throttle(log, 2000);
throttledLog(); // Should print "Hello!"
throttledLog(); // Should be ignored
setTimeout(() => { throttledLog(); }, 2100); // Should print "Hello!" after 2.1s`,
      output: `Hello!
Hello!`,
      difficulty: 'hard'
    }
  ],
  'Fetch': [
    {
      title: 'Basic Fetch Request',
      description: `# Basic Fetch Request

Create a function to make a simple GET request using the `fetch` API.

## Requirements
1. Use `fetch()` to request data from a given URL
2. Parse the response as JSON
3. Handle HTTP and network errors appropriately using `.catch()`

## Example
```javascript
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error("Fetch failed:", err));
```
`,
      input: `function fetchData(url) {
  // Your implementation
}

fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error("Fetch failed:", err));`,
      output: `{ id: 1, name: 'Alice' } // or error message`,
      difficulty: 'easy'
    },
    {
      title: 'POST Request with JSON Body',
      description: `# POST Request with JSON Body

Create a function that sends a POST request using `fetch`, passing a JavaScript object as JSON in the body.

## Requirements
1. Use `fetch()` with method `POST`
2. Convert JavaScript object to JSON string
3. Set correct headers and handle response

## Example
```javascript
postData('https://api.example.com/users', { name: 'Alice' })
  .then(response => console.log(response))
  .catch(err => console.error(err));
```
`,
      input: `function postData(url, data) {
  // Your implementation
}

postData('https://api.example.com/users', { name: 'Alice' })
  .then(response => console.log(response))
  .catch(err => console.error(err));`,
      output: `{ id: 1, name: 'Alice' } // or error message`,
      difficulty: 'easy'
    },
    {
      title: 'Fetch with Error Status Handling',
      description: `# Fetch with Error Status Handling

Extend your GET request to explicitly check for non-2xx status codes and throw an error.

## Requirements
1. Use `response.ok` to detect status issues
2. Throw custom errors with response status
3. Catch and log errors clearly

## Example
```javascript
fetchAndHandle('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error.message));
```
`,
      input: `function fetchAndHandle(url) {
  // Your implementation
}

fetchAndHandle('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error.message));`,
      output: `{ id: 1, name: 'Alice' } // or error message`,
      difficulty: 'easy'
    },
    {
      title: 'Fetch with Timeout',
      description: `# Fetch with Timeout

Wrap a `fetch` call with a timeout mechanism. If the request takes too long, abort it and throw a timeout error.

## Requirements
1. Use `AbortController` to cancel requests
2. Timeout value should be configurable
3. Catch timeout and handle gracefully

## Example
```javascript
fetchWithTimeout('https://api.example.com/data', 3000)
  .then(data => console.log(data))
  .catch(err => console.error("Timeout or error:", err));
```
`,
      input: `function fetchWithTimeout(url, timeout) {
  // Your implementation
}

fetchWithTimeout('https://api.example.com/data', 3000)
  .then(data => console.log(data))
  .catch(err => console.error("Timeout or error:", err));`,
      output: `{ id: 1, name: 'Alice' } // or "Timeout or error: ..."`,
      difficulty: 'medium'
    },
    {
      title: 'Concurrent Fetch All',
      description: `# Concurrent Fetch All

Write a function that accepts an array of URLs and fetches data from all of them in parallel. Return a list of successful responses only.

## Requirements
1. Use `Promise.allSettled`
2. Filter out failed responses
3. Return array of data from successful calls

## Example
```javascript
fetchMultiple([
  'https://api.example.com/1',
  'https://api.example.com/2'
]).then(results => console.log(results));
```
`,
      input: `function fetchMultiple(urls) {
  // Your implementation
}

fetchMultiple([
  'https://api.example.com/1',
  'https://api.example.com/2'
]).then(results => console.log(results));`,
      output: `[{ id: 1 }, { id: 2 }] // or only successful results`,
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
```javascript
fetchUsers('https://api.example.com/users')
  .then(users => console.log(users)); // [{ id: 1, name: 'Alice' }, ...]
```
`,
      input: `function fetchUsers(url) {
  // Your implementation
}

fetchUsers('https://api.example.com/users')
  .then(users => console.log(users));`,
      output: `[{ id: 1, name: 'Alice' }, ...]`,
      difficulty: 'medium'
    },
    {
      title: 'Implement Fetch Retry',
      description: `# Implement Fetch Retry

Write a `fetchWithRetry` function that retries failed requests using exponential backoff logic.

## Requirements
1. Retry on network failure or 5xx status codes
2. Exponential delay between retries (e.g., 1s → 2s → 4s)
3. Stop after a maximum number of attempts

## Example
```javascript
fetchWithRetry('https://api.example.com/data', 3)
  .then(data => console.log(data))
  .catch(err => console.error("Failed after retries:", err));
```
`,
      input: `function fetchWithRetry(url, attempts) {
  // Your implementation
}

fetchWithRetry('https://api.example.com/data', 3)
  .then(data => console.log(data))
  .catch(err => console.error("Failed after retries:", err));`,
      output: `{ id: 1, name: 'Alice' } // or "Failed after retries: ..."`,
      difficulty: 'hard'
    },
    {
      title: 'Progressive Fetch Stream Reader',
      description: `# Progressive Fetch Stream Reader

Implement a fetch stream reader that reads text content progressively from a large response using `ReadableStream`.

## Requirements
1. Use `response.body.getReader()`
2. Read and decode chunks
3. Log each chunk to console in real-time

## Example
```javascript
readLargeFile('https://api.example.com/large-file');
```
`,
      input: `function readLargeFile(url) {
  // Your implementation
}

readLargeFile('https://api.example.com/large-file'); // Should log chunks progressively`,
      output: `Chunk 1
Chunk 2
...`,
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
```javascript
fetchAllPages('https://api.example.com/items?page=1')
  .then(allItems => console.log(allItems.length));
```
`,
      input: `function fetchAllPages(url) {
  // Your implementation
}

fetchAllPages('https://api.example.com/items?page=1')
  .then(allItems => console.log(allItems.length));`,
      output: `10 // or however many items in all pages`,
      difficulty: 'hard'
    }
  ],
  'Objects': [
    {
      title: 'Object Property Access',
      description: `# Object Property Access

Create a function `get(obj, path, defaultValue)` to safely access deeply nested properties in an object using a dot-separated path string.

## Requirements
1. Support nested keys like `user.address.street`
2. Return `defaultValue` if path is invalid
3. Handle arrays in the path

## Example
```javascript
get(obj, 'user.address.street', 'N/A'); // returns "123 Main St" or "N/A"
```
`,
      input: `function get(obj, path, defaultValue) {
  // Your implementation
}

const obj = { user: { address: { street: '123 Main St' } } };
console.log(get(obj, 'user.address.street', 'N/A')); // Should print "123 Main St"
console.log(get(obj, 'user.address.zip', 'N/A')); // Should print "N/A"`,
      output: `123 Main St
N/A`,
      difficulty: 'easy'
    },
    {
      title: 'Object Key Filtering',
      description: `# Object Key Filtering

Write a function `filterKeys(obj, keys)` that returns a new object containing only the specified keys from the original object.

## Requirements
1. Do not mutate original object
2. Return only requested properties

## Example
```javascript
filterKeys({ name: 'Alice', age: 25, city: 'NY' }, ['name', 'city']);
// { name: 'Alice', city: 'NY' }
```
`,
      input: `function filterKeys(obj, keys) {
  // Your implementation
}

console.log(filterKeys({ name: 'Alice', age: 25, city: 'NY' }, ['name', 'city'])); // Should print { name: 'Alice', city: 'NY' }`,
      output: `{ name: 'Alice', city: 'NY' }`,
      difficulty: 'easy'
    },
    {
      title: 'Object to Array Converter',
      description: `# Object to Array Converter

Convert an object into an array of key-value pair strings.

## Requirements
1. Convert to array like `["key1: value1", "key2: value2"]`
2. Support nested values as `[object Object]`

## Example
```javascript
objectToArray({ a: 1, b: 2 });
// ["a: 1", "b: 2"]
```
`,
      input: `function objectToArray(obj) {
  // Your implementation
}

console.log(objectToArray({ a: 1, b: 2 })); // Should print ["a: 1", "b: 2"]`,
      output: `["a: 1", "b: 2"]`,
      difficulty: 'easy'
    },
    {
      title: 'Object Transformation',
      description: `# Object Transformation

Transform the structure of an object using a mapping schema.

## Requirements
1. Accept a mapping object `{ from: to }`
2. Move or rename keys based on mapping
3. Handle nested paths

## Example
```javascript
transform({ user: { name: 'Alice' } }, { 'user.name': 'profile.fullName' });
// { profile: { fullName: 'Alice' } }
```
`,
      input: `function transform(obj, mapping) {
  // Your implementation
}

console.log(transform({ user: { name: 'Alice' } }, { 'user.name': 'profile.fullName' })); // Should print { profile: { fullName: 'Alice' } }`,
      output: `{ profile: { fullName: 'Alice' } }`,
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
```javascript
flatten({ user: { name: 'Alice', address: { city: 'NY' } } });
// { 'user.name': 'Alice', 'user.address.city': 'NY' }
```
`,
      input: `function flatten(obj) {
  // Your implementation
}

console.log(flatten({ user: { name: 'Alice', address: { city: 'NY' } } })); // Should print { 'user.name': 'Alice', 'user.address.city': 'NY' }`,
      output: `{ 'user.name': 'Alice', 'user.address.city': 'NY' }`,
      difficulty: 'medium'
    },
    {
      title: 'Invert Key-Value Pairs',
      description: `# Invert Key-Value Pairs

Write a function `invert(obj)` that swaps the keys and values of an object.

## Requirements
1. Original keys become values and vice versa
2. Handle non-unique values safely

## Example
```javascript
invert({ a: 'x', b: 'y' });
// { x: 'a', y: 'b' }
```
`,
      input: `function invert(obj) {
  // Your implementation
}

console.log(invert({ a: 'x', b: 'y' })); // Should print { x: 'a', y: 'b' }`,
      output: `{ x: 'a', y: 'b' }`,
      difficulty: 'medium'
    },
    {
      title: 'Deep Object Clone',
      description: `# Deep Object Clone

Create a utility `deepClone(obj)` that deeply clones any object or array.

## Requirements
1. Handle nested structures
2. Clone circular references using a WeakMap
3. Preserve prototypes

## Example
```javascript
const clone = deepClone(complexObj);
```
`,
      input: `function deepClone(obj) {
  // Your implementation
}

const obj = { a: 1, b: { c: 2 } };
const clone = deepClone(obj);
console.log(clone); // Should print { a: 1, b: { c: 2 } }`,
      output: `{ a: 1, b: { c: 2 } }`,
      difficulty: 'hard'
    },
    {
      title: 'Deep Merge Objects',
      description: `# Deep Merge Objects

Implement a `deepMerge(obj1, obj2)` function that recursively merges the properties of two objects.

## Requirements
1. Do not overwrite nested objects
2. Merge arrays by index or concat (configurable)

## Example
```javascript
deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }
```
`,
      input: `function deepMerge(obj1, obj2) {
  // Your implementation
}

console.log(deepMerge({ a: { b: 1 } }, { a: { c: 2 } })); // Should print { a: { b: 1, c: 2 } }`,
      output: `{ a: { b: 1, c: 2 } }`,
      difficulty: 'hard'
    },
    {
      title: 'Dynamic Object Constructor',
      description: `# Dynamic Object Constructor

Build a function `construct(keys, values)` that dynamically constructs an object from two parallel arrays.

## Requirements
1. Use array methods to combine key-value pairs
2. Handle mismatched lengths by ignoring extras

## Example
```javascript
construct(['name', 'age'], ['Alice', 25]);
// { name: 'Alice', age: 25 }
```
`,
      input: `function construct(keys, values) {
  // Your implementation
}

console.log(construct(['name', 'age'], ['Alice', 25])); // Should print { name: 'Alice', age: 25 }`,
      output: `{ name: 'Alice', age: 25 }`,
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
```javascript
const arr = [1, 2, 3, 4, 5];
linearSearch(arr, 3); // Returns 2
linearSearch(arr, 6); // Returns -1
```
`,
      input: `function linearSearch(arr, target) {
  // Your implementation
}

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
```javascript
caseInsensitiveSearch(['apple', 'Banana', 'CHERRY'], 'banana'); // Returns 1
```
`,
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
```javascript
findFirstEven([1, 3, 5, 8, 10]); // 3
```
`,
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
```javascript
const arr = [1, 2, 3, 4, 5];
binarySearch(arr, 3); // Returns 2
binarySearch(arr, 6); // Returns -1
```
`,
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
```javascript
searchRotated([4,5,6,7,0,1,2], 0); // 4
```
`,
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
```javascript
searchMatrix([
  [1, 4, 7],
  [8, 11, 15],
  [20, 22, 30]
], 11); // true
```
`,
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
```javascript
jumpSearch([1, 2, 3, 4, 5], 3); // 2
jumpSearch([1, 2, 3, 4, 5], 6); // -1
```
`,
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
```javascript
findPeak([1, 3, 20, 4, 1]); // 2 (20 is peak)
```
`,
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
```javascript
infiniteSearch(get, 6); // If get(i) gives increasing numbers like 1, 2, 3...

// Output depends on virtual array
```
`,
      input: `function infiniteSearch(getFn, target) {
  // Your implementation
}

const mockArray = [1, 3, 5, 7, 9, 10, 15, 20];
const get = (i) => mockArray[i] ?? Infinity;

console.log(infiniteSearch(get, 10)); // 5`,
      output: `5`,
      difficulty: 'hard'
    }
  ],
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
```javascript
// Convert these functions
function add(a, b) { return a + b; }
const multiply = function(a, b) { return a * b; }

// To arrow functions:
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
```
`,
      input: `// Before
function add(a, b) { return a + b; }
const multiply = function(a, b) { return a * b; }

// After
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;`,
      output: `add(2, 3) // 5
multiply(2, 3) // 6`,
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
```javascript
const square = function(x) {
  return x * x;
}

// Convert to:
const square = x => x * x;
```
`,
      input: `const square = function(x) {
  return x * x;
}

// After
const square = x => x * x;`,
      output: `square(4) // 16`,
      difficulty: 'easy'
    },
    {
      title: 'Array Methods with Arrow Functions',
      description: `# Array Methods with Arrow Functions

Refactor a series of `map`, `filter`, and `reduce` operations using arrow functions.

## Requirements
1. Use arrow functions for callbacks
2. Maintain readable formatting

## Example
```javascript
const nums = [1, 2, 3, 4];
const result = nums.map(function(n) {
  return n * 2;
});

// Refactor to:
const result = nums.map(n => n * 2);
```
`,
      input: `const nums = [1, 2, 3, 4];
const result = nums.map(function(n) { return n * 2; });

// After
const result = nums.map(n => n * 2);`,
      output: `[2, 4, 6, 8]`,
      difficulty: 'easy'
    },
    {
      title: 'Event Handler Conversion',
      description: `# Event Handler Conversion

Convert function-based DOM event handlers to arrow functions, ensuring `this` context remains correct.

## Requirements
1. Use arrow functions in addEventListener
2. Properly bind methods when using inside classes

## Example
```javascript
button.addEventListener('click', function() {
  this.handleClick(); // Needs attention with arrow conversion
});
```
`,
      input: `// Before
button.addEventListener('click', function() {
  this.handleClick();
});

// After
button.addEventListener('click', () => {
  this.handleClick();
});`,
      output: `// this.handleClick() called on click`,
      difficulty: 'medium'
    },
    {
      title: 'Arrow Functions in Object Methods',
      description: `# Arrow Functions in Object Methods

Evaluate the behavior of arrow functions in object literals and fix context-related issues.

## Requirements
1. Understand lexical `this`
2. Identify when not to use arrows in methods

## Example
```javascript
const obj = {
  name: "Box",
  getName: () => this.name // Problem: this refers to outer scope
};
```
`,
      input: `const obj = {
  name: "Box",
  getName: () => this.name
};

// After (fix):
const objFixed = {
  name: "Box",
  getName() { return this.name; }
};`,
      output: `objFixed.getName() // "Box"`,
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
```javascript
// No parameters
() => console.log('Hi')

// One parameter
x => x * 2

// Multiple parameters
(x, y) => x + y
```
`,
      input: `// No parameters
const sayHi = () => console.log('Hi');

// One parameter
const square = x => x * x;

// Multiple parameters
const add = (x, y) => x + y;`,
      output: `sayHi() // "Hi"
square(3) // 9
add(2, 3) // 5`,
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
```javascript
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
```
`,
      input: `const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const add1 = x => x + 1;
const double = x => x * 2;
console.log(compose(double, add1)(3)); // 8`,
      output: `8`,
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
```javascript
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6
```
`,
      input: `const add = a => b => c => a + b + c;
console.log(add(1)(2)(3)); // 6`,
      output: `6`,
      difficulty: 'hard'
    },
    {
      title: 'Arrow Functions Inside setTimeout',
      description: `# Arrow Functions Inside setTimeout

Refactor setTimeout-based callbacks using arrow functions and understand their lexical `this`.

## Requirements
1. Use arrow inside setTimeout to preserve outer `this`
2. Compare with function expressions

## Example
```javascript
function Timer() {
  this.time = 0;
  setTimeout(() => {
    console.log(this.time); // refers to Timer object
  }, 1000);
}
```
`,
      input: `function Timer() {
  this.time = 42;
  setTimeout(() => {
    console.log(this.time);
  }, 1000);
}

new Timer(); // Should print 42 after 1s`,
      output: `42`,
      difficulty: 'hard'
    }
  ]
};

export { problemsByTopic }; 