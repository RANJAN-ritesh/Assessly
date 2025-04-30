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
    // JS
    { name: 'Promises', subjectName: 'JS', recap: 'Promises represent the eventual completion (or failure) of asynchronous operations in JavaScript. They allow chaining and error handling for async code.' },
    { name: 'Fetch', subjectName: 'JS', recap: 'The fetch API is used to make HTTP requests in JavaScript, returning Promises for async handling of responses.' },
    { name: 'Objects', subjectName: 'JS', recap: 'Objects in JavaScript are collections of key-value pairs, used to store and organize data.' },
    { name: 'HOFs', subjectName: 'JS', recap: 'Higher Order Functions (HOFs) are functions that take other functions as arguments or return them as results.' },
    { name: 'Arrow functions', subjectName: 'JS', recap: 'Arrow functions provide a concise syntax for writing functions and do not have their own this binding.' },
    { name: 'Functions', subjectName: 'JS', recap: 'Functions are reusable blocks of code that perform specific tasks and can accept parameters and return values.' },
    // Data Structure
    { name: 'Arrays', subjectName: 'Data Structure', recap: 'Arrays are ordered collections of elements, allowing indexed access and manipulation.' },
    { name: 'Key-Value Pairs', subjectName: 'Data Structure', recap: 'Key-Value pairs store data as a set of keys mapped to values, commonly used in objects and maps.' },
    { name: 'Linked List', subjectName: 'Data Structure', recap: 'A linked list is a linear data structure where each element points to the next, allowing efficient insertions and deletions.' },
    // Algorithms
    { name: 'Sorting', subjectName: 'Algorithms', recap: 'Sorting algorithms arrange data in a particular order, such as ascending or descending.' },
    { name: 'Searching', subjectName: 'Algorithms', recap: 'Searching algorithms are used to find specific elements within data structures.' },
    { name: 'Recursive algos', subjectName: 'Algorithms', recap: 'Recursive algorithms solve problems by calling themselves with smaller inputs until a base case is reached.' },
    // React
    { name: 'useEffect', subjectName: 'React', recap: 'useEffect is a React hook for running side effects in function components, such as data fetching or subscriptions.' },
    { name: 'useState', subjectName: 'React', recap: 'useState is a React hook that lets you add state to function components.' },
    { name: 'contextAPI', subjectName: 'React', recap: 'The Context API provides a way to pass data through the component tree without having to pass props down manually at every level.' },
    { name: 'Routing', subjectName: 'React', recap: 'Routing in React is handled by libraries like React Router, enabling navigation between different components/views.' },
    // DB
    { name: 'SQL', subjectName: 'DB', recap: 'SQL databases use structured query language for defining and manipulating relational data.' },
    { name: 'NoSQL', subjectName: 'DB', recap: 'NoSQL databases store data in flexible, non-relational formats, such as documents or key-value pairs.' },
    // Python
    { name: 'Tuples', subjectName: 'Python', recap: 'Tuples are immutable sequences in Python, used to store collections of items.' },
    { name: 'dictionary', subjectName: 'Python', recap: 'Dictionaries are mutable mappings of keys to values, allowing fast lookups and updates.' },
    { name: 'functions', subjectName: 'Python', recap: 'Functions in Python are defined using def and can accept parameters and return values.' },
    { name: 'file handling', subjectName: 'Python', recap: 'File handling in Python allows reading from and writing to files using built-in functions.' }
  ]
};

// Problems for each topic
const problemsByTopic: Record<string, { title: string; description: string; input: string; output: string }[]> = {
  'Promises': [
    {
      title: 'Chaining Promises',
      description: 'Write a function that fetches user data and then fetches posts for that user using chained promises. Ensure proper error handling.',
      input: `fetchUser(userId)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => ...);`,
      output: `// Output: Array of posts for the user`
    },
    {
      title: 'Promise.all Usage',
      description: 'Given an array of URLs, fetch all data in parallel using Promise.all and return the results as an array.',
      input: `Promise.all(urls.map(url => fetch(url)))
  .then(responses => ...);`,
      output: `// Output: Array of response objects`
    },
    {
      title: 'Promise Rejection Handling',
      description: 'Demonstrate how to handle rejected promises in a chain and provide a fallback value.',
      input: `fetchData()
  .catch(err => {
    console.error(err);
    return defaultValue;
  });`,
      output: `// Output: defaultValue if fetchData fails`
    }
  ],
  'Fetch': [
    {
      title: 'Basic Fetch',
      description: 'Use fetch to get data from a public API and log the result. Handle errors gracefully.',
      input: `fetch('https://api.example.com/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => ...);`,
      output: `// Output: Data from the API`
    },
    {
      title: 'POST Request with Fetch',
      description: 'Send a POST request using fetch with a JSON body and handle the response.',
      input: `fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
})
  .then(res => res.json())
  .then(data => ...);`,
      output: `// Output: Response from the server`
    },
    {
      title: 'Fetch with Custom Headers',
      description: 'Make a fetch request with custom headers and parse the JSON response.',
      input: `fetch('/api/user', {
  headers: { 'Authorization': 'Bearer token' }
})
  .then(res => res.json())
  .then(user => ...);`,
      output: `// Output: User object from the API`
    }
  ],
  'Objects': [
    {
      title: 'Object Property Access',
      description: 'Write a function that takes an object and a key, and returns the value for that key. Handle missing keys gracefully.',
      input: `const obj = { name: 'Alice', age: 25 };
getValue(obj, 'name');`,
      output: `'Alice'`
    },
    {
      title: 'Object Cloning',
      description: 'Clone an object using the spread operator and verify that changes to the clone do not affect the original.',
      input: `const original = { a: 1, b: 2 };
const clone = { ...original };
clone.a = 10;`,
      output: `// original.a === 1, clone.a === 10`
    },
    {
      title: 'Merging Objects',
      description: 'Merge two objects and return the result. If keys overlap, the second object should override the first.',
      input: `const a = { x: 1, y: 2 };
const b = { y: 3, z: 4 };
mergeObjects(a, b);`,
      output: `{ x: 1, y: 3, z: 4 }`
    }
  ],
  'HOFs': [
    {
      title: 'Map with HOF',
      description: 'Use Array.prototype.map as a higher order function to double each element in an array.',
      input: `const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2);`,
      output: `[2, 4, 6]`
    },
    {
      title: 'Filter with HOF',
      description: 'Use Array.prototype.filter to return only even numbers from an array.',
      input: `const arr = [1, 2, 3, 4];
const evens = arr.filter(x => x % 2 === 0);`,
      output: `[2, 4]`
    },
    {
      title: 'Custom HOF',
      description: 'Write a function that takes another function and a value, and applies the function to the value.',
      input: `applyFn(x => x * 3, 5);`,
      output: `15`
    }
  ],
  'Arrow functions': [
    {
      title: 'Simple Arrow Function',
      description: 'Convert a regular function to an arrow function that adds two numbers.',
      input: `const add = (a, b) => a + b;`,
      output: `add(2, 3) // 5`
    },
    {
      title: 'Arrow Function and this',
      description: 'Demonstrate how arrow functions do not have their own this binding by using them in an object method.',
      input: `const obj = {
  value: 10,
  getValue: () => this.value
};`,
      output: `// Output: undefined (arrow functions do not bind their own this)`
    },
    {
      title: 'Arrow Function with Implicit Return',
      description: 'Write an arrow function that returns the square of a number using implicit return.',
      input: `const square = x => x * x;`,
      output: `square(4) // 16`
    }
  ],
  'Functions': [
    {
      title: 'Function Declaration vs Expression',
      description: 'Show the difference between function declarations and function expressions in JavaScript.',
      input: `function foo() { return 1; }
const bar = function() { return 2; };`,
      output: `foo() // 1, bar() // 2`
    },
    {
      title: 'Default Parameters',
      description: 'Write a function with a default parameter and demonstrate calling it with and without the argument.',
      input: `function greet(name = 'Guest') { return 'Hello ' + name; }`,
      output: `greet() // 'Hello Guest', greet('Alice') // 'Hello Alice'`
    },
    {
      title: 'Rest Parameters',
      description: 'Create a function that sums any number of arguments using rest parameters.',
      input: `function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }`,
      output: `sum(1, 2, 3, 4) // 10`
    }
  ],
  'Arrays': [
    {
      title: 'Array Push and Pop',
      description: 'Demonstrate adding and removing elements from an array using push and pop.',
      input: `const arr = [1, 2];
arr.push(3);
arr.pop();`,
      output: `[1, 2]`
    },
    {
      title: 'Array Map',
      description: 'Use map to square each element in an array.',
      input: `const arr = [1, 2, 3];
const squares = arr.map(x => x * x);`,
      output: `[1, 4, 9]`
    },
    {
      title: 'Array Destructuring',
      description: 'Destructure the first two elements from an array and collect the rest.',
      input: `const arr = [10, 20, 30, 40];
const [a, b, ...rest] = arr;`,
      output: `a = 10, b = 20, rest = [30, 40]`
    }
  ],
  'Key-Value Pairs': [
    {
      title: 'Object as Key-Value Store',
      description: 'Use a JavaScript object to store and retrieve values by key.',
      input: `const store = { apple: 5, banana: 10 };
store['apple'];`,
      output: `5`
    },
    {
      title: 'Map Data Structure',
      description: 'Use the Map object to store key-value pairs and demonstrate set/get.',
      input: `const map = new Map();
map.set('x', 42);
map.get('x');`,
      output: `42`
    },
    {
      title: 'Iterate Key-Value Pairs',
      description: 'Iterate over the keys and values of an object.',
      input: `const obj = { a: 1, b: 2 };
for (const [key, value] of Object.entries(obj)) {
  // ...
}`,
      output: `// Output: key=a, value=1; key=b, value=2`
    }
  ],
  'Linked List': [
    {
      title: 'Create Linked List Node',
      description: 'Define a Node class for a singly linked list and create a node.',
      input: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
const node = new Node(5);`,
      output: `node.value // 5, node.next // null`
    },
    {
      title: 'Traverse Linked List',
      description: 'Write a function to traverse a linked list and collect all values in an array.',
      input: `function traverse(head) {
  const result = [];
  let curr = head;
  while (curr) {
    result.push(curr.value);
    curr = curr.next;
  }
  return result;
}`,
      output: `// Output: Array of node values in order`
    },
    {
      title: 'Insert at End',
      description: 'Add a new node at the end of a singly linked list.',
      input: `function insertEnd(head, value) {
  let curr = head;
  while (curr.next) curr = curr.next;
  curr.next = new Node(value);
}`,
      output: `// Output: Linked list with new node at end`
    }
  ],
  'Sorting': [
    {
      title: 'Bubble Sort',
      description: 'Implement bubble sort to sort an array of numbers in ascending order.',
      input: `function bubbleSort(arr) {
  // ...
}
bubbleSort([5, 2, 9, 1]);`,
      output: `[1, 2, 5, 9]`
    },
    {
      title: 'Sort Objects by Key',
      description: 'Sort an array of objects by a specific key.',
      input: `const arr = [{a: 2}, {a: 1}];
arr.sort((x, y) => x.a - y.a);`,
      output: `[{a: 1}, {a: 2}]`
    },
    {
      title: 'Custom Comparator',
      description: 'Write a sort function that sorts strings by length.',
      input: `const arr = ['apple', 'kiwi', 'banana'];
arr.sort((a, b) => a.length - b.length);`,
      output: `['kiwi', 'apple', 'banana']`
    }
  ],
  'Searching': [
    {
      title: 'Linear Search',
      description: 'Implement linear search to find an element in an array.',
      input: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
linearSearch([1,2,3], 2);`,
      output: `1`
    },
    {
      title: 'Binary Search',
      description: 'Implement binary search for a sorted array.',
      input: `function binarySearch(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    if (arr[m] === target) return m;
    if (arr[m] < target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}
binarySearch([1,2,3,4], 3);`,
      output: `2`
    },
    {
      title: 'Find in Object Array',
      description: 'Find an object in an array by a specific property value.',
      input: `const arr = [{id:1}, {id:2}];
arr.find(x => x.id === 2);`,
      output: `{id:2}`
    }
  ],
  'Recursive algos': [
    {
      title: 'Factorial (Recursive)',
      description: 'Write a recursive function to compute the factorial of a number.',
      input: `function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n-1);
}
fact(5);`,
      output: `120`
    },
    {
      title: 'Fibonacci (Recursive)',
      description: 'Write a recursive function to compute the nth Fibonacci number.',
      input: `function fib(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}
fib(6);`,
      output: `8`
    },
    {
      title: 'Sum Array (Recursive)',
      description: 'Sum all elements in an array using recursion.',
      input: `function sum(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sum(arr.slice(1));
}
sum([1,2,3]);`,
      output: `6`
    }
  ],
  'useEffect': [
    {
      title: 'Basic useEffect',
      description: 'Use useEffect to fetch data when a component mounts.',
      input: `useEffect(() => {
  fetchData();
}, []);`,
      output: `// fetchData called on mount`
    },
    {
      title: 'Cleanup in useEffect',
      description: 'Demonstrate cleanup logic in useEffect for event listeners.',
      input: `useEffect(() => {
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);`,
      output: `// Event listener removed on unmount`
    },
    {
      title: 'Effect Dependencies',
      description: 'Show how useEffect runs when dependencies change.',
      input: `useEffect(() => {
  doSomething();
}, [value]);`,
      output: `// doSomething called when value changes`
    }
  ],
  'useState': [
    {
      title: 'Basic useState',
      description: 'Use useState to create a counter and update it on button click.',
      input: `const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)} />`,
      output: `// count increments on click`
    },
    {
      title: 'useState with Object',
      description: 'Store an object in state and update a property.',
      input: `const [user, setUser] = useState({ name: '', age: 0 });
setUser({ ...user, name: 'Alice' });`,
      output: `// user.name === 'Alice'`
    },
    {
      title: 'Functional Updates',
      description: 'Use a function to update state based on previous value.',
      input: `setCount(prev => prev + 1);`,
      output: `// count increments by 1`
    }
  ],
  'contextAPI': [
    {
      title: 'Create Context',
      description: 'Create a React context and provide a value to child components.',
      input: `const MyContext = React.createContext();
<MyContext.Provider value={...}>...</MyContext.Provider>`,
      output: `// Children can access value via useContext(MyContext)`
    },
    {
      title: 'Consume Context',
      description: 'Use useContext to consume a value from context in a child component.',
      input: `const value = useContext(MyContext);`,
      output: `// value is the context value`
    },
    {
      title: 'Update Context Value',
      description: 'Update the context value and see it reflected in all consumers.',
      input: `setValue(newValue);`,
      output: `// All consumers re-render with new value`
    }
  ],
  'Routing': [
    {
      title: 'Basic Routing',
      description: 'Set up basic routing in a React app using React Router.',
      input: `<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>`,
      output: `// Navigates to Home or About component based on URL`
    },
    {
      title: 'Route Params',
      description: 'Access route parameters in a component.',
      input: `const { id } = useParams();`,
      output: `// id is the route parameter from the URL`
    },
    {
      title: 'Navigate Programmatically',
      description: 'Use useNavigate to change routes programmatically.',
      input: `const navigate = useNavigate();
navigate('/dashboard');`,
      output: `// Navigates to /dashboard`
    }
  ],
  'SQL': [
    {
      title: 'Basic SELECT Query',
      description: 'Write a SQL query to select all users older than 18.',
      input: `SELECT * FROM users WHERE age > 18;`,
      output: `-- Output: All users with age > 18`
    },
    {
      title: 'JOIN Two Tables',
      description: 'Write a SQL query to join users and orders tables on user_id.',
      input: `SELECT users.name, orders.amount FROM users JOIN orders ON users.id = orders.user_id;`,
      output: `-- Output: name and amount for each order`
    },
    {
      title: 'Aggregate Function',
      description: 'Use COUNT to get the number of orders for each user.',
      input: `SELECT user_id, COUNT(*) FROM orders GROUP BY user_id;`,
      output: `-- Output: user_id and order count`
    }
  ],
  'NoSQL': [
    {
      title: 'Insert Document',
      description: 'Insert a new document into a MongoDB collection.',
      input: `db.users.insertOne({ name: 'Alice', age: 25 });`,
      output: `// Output: Inserted document with _id`
    },
    {
      title: 'Find Documents',
      description: 'Find all users older than 18 in MongoDB.',
      input: `db.users.find({ age: { $gt: 18 } });`,
      output: `// Output: All users with age > 18`
    },
    {
      title: 'Update Document',
      description: 'Update a user document to set age to 30.',
      input: `db.users.updateOne({ name: 'Alice' }, { $set: { age: 30 } });`,
      output: `// Output: Modified document count`
    }
  ],
  'Tuples': [
    {
      title: 'Create Tuple',
      description: 'Create a tuple with three elements and access its values.',
      input: `t = (1, 'hello', 3.5)
t[1]`,
      output: `'hello'`
    },
    {
      title: 'Tuple Unpacking',
      description: 'Unpack a tuple into separate variables.',
      input: `a, b, c = (1, 2, 3)`,
      output: `a = 1, b = 2, c = 3`
    },
    {
      title: 'Tuple Immutability',
      description: 'Show that tuples are immutable by attempting to modify an element.',
      input: `t = (1, 2, 3)
t[0] = 10`,
      output: `# Output: TypeError: 'tuple' object does not support item assignment`
    }
  ],
  'dictionary': [
    {
      title: 'Create Dictionary',
      description: 'Create a dictionary and add a new key-value pair.',
      input: `d = {'a': 1}
d['b'] = 2`,
      output: `{'a': 1, 'b': 2}`
    },
    {
      title: 'Dictionary Comprehension',
      description: 'Use a dictionary comprehension to create a mapping of numbers to their squares.',
      input: `squares = {x: x*x for x in range(3)}`,
      output: `{0: 0, 1: 1, 2: 4}`
    },
    {
      title: 'Iterate Dictionary',
      description: 'Iterate over keys and values in a dictionary.',
      input: `d = {'a': 1, 'b': 2}
for k, v in d.items():
    print(k, v)`,
      output: `a 1
b 2`
    }
  ],
  'functions': [
    {
      title: 'Define Function',
      description: 'Define a function that adds two numbers and returns the result.',
      input: `def add(a, b):
    return a + b
add(2, 3)`,
      output: `5`
    },
    {
      title: 'Function with Default Argument',
      description: 'Write a function with a default argument and call it with and without the argument.',
      input: `def greet(name='Guest'):
    return 'Hello ' + name
greet()
greet('Alice')`,
      output: `Hello Guest
Hello Alice`
    },
    {
      title: 'Lambda Function',
      description: 'Use a lambda function to square a number.',
      input: `square = lambda x: x * x
square(4)`,
      output: `16`
    }
  ],
  'file handling': [
    {
      title: 'Read File',
      description: 'Read the contents of a file and print it line by line.',
      input: `with open('file.txt', 'r') as f:
    for line in f:
        print(line.strip())`,
      output: `# Output: Each line of file.txt printed`
    },
    {
      title: 'Write File',
      description: 'Write a list of strings to a file, one per line.',
      input: `lines = ['a', 'b', 'c']
with open('out.txt', 'w') as f:
    for line in lines:
        f.write(line + '\n')`,
      output: `# Output: out.txt contains a\nb\nc`
    },
    {
      title: 'Append to File',
      description: 'Append a new line to an existing file.',
      input: `with open('file.txt', 'a') as f:
    f.write('new line\n')`,
      output: `# Output: file.txt has new line at the end`
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
          description: p.description + '\n\n### Expected Input\n' + p.input + '\n\n### Expected Output\n' + p.output,
          subjectId: subject._id,
          topicId: topic._id,
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