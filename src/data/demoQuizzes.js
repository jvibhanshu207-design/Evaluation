export const DEMO_QUIZZES = [
  {
    id: "quiz-java-oop",
    title: "Java OOP & Memory Architecture Assessment",
    courseId: "java-programming",
    courseName: "Java Programming Masterclass",
    durationMinutes: 10,
    passingScore: 70,
    questionsCount: 5,
    difficulty: "Medium",
    bestScore: null,
    completed: false,
    questions: [
      {
        id: "q1",
        question: "Where are Java object instances stored in memory?",
        options: [
          "Call Stack",
          "Heap Memory",
          "Method Area / Metaspace",
          "CPU Registers"
        ],
        correctAnswer: 1,
        explanation: "In Java, all object instances created with the 'new' keyword reside in the Heap memory, while local primitive variables and object references reside on the Stack."
      },
      {
        id: "q2",
        question: "Which keyword is used by a Java subclass to invoke the constructor of its immediate superclass?",
        options: [
          "this()",
          "parent()",
          "super()",
          "base()"
        ],
        correctAnswer: 2,
        explanation: "'super()' is used to call the superclass constructor, and it must be the very first statement inside the subclass constructor body."
      },
      {
        id: "q3",
        question: "What happens when you declare a Java method as 'final'?",
        options: [
          "It cannot be invoked more than once",
          "It cannot be overridden by subclasses",
          "It executes only when the JVM terminates",
          "It forces the method to be static"
        ],
        correctAnswer: 1,
        explanation: "A 'final' method in Java cannot be overridden by any subclass, preventing modification of its behavior."
      },
      {
        id: "q4",
        question: "Which of the following interfaces does NOT allow duplicate elements?",
        options: [
          "java.util.List",
          "java.util.Queue",
          "java.util.Set",
          "java.util.Vector"
        ],
        correctAnswer: 2,
        explanation: "The java.util.Set interface represents a mathematical set collection that prohibits duplicate elements."
      },
      {
        id: "q5",
        question: "What is the primary benefit of the 'try-with-resources' statement introduced in Java 7?",
        options: [
          "It automatically catches all unchecked exceptions",
          "It automatically closes resources implementing AutoCloseable without an explicit finally block",
          "It compiles code directly into native machine instructions",
          "It speeds up heap garbage collection"
        ],
        correctAnswer: 1,
        explanation: "The try-with-resources statement ensures that every resource implementing AutoCloseable is automatically closed at the end of the statement."
      }
    ]
  },
  {
    id: "quiz-react-hooks",
    title: "React 19 Hooks, State & Component Architecture",
    courseId: "react-development",
    courseName: "React 19 & Next-Gen Frontend Engineering",
    durationMinutes: 12,
    passingScore: 70,
    questionsCount: 5,
    difficulty: "Medium",
    bestScore: 80,
    completed: true,
    questions: [
      {
        id: "rq1",
        question: "What is the primary rule regarding the placement of React Hook calls?",
        options: [
          "Hooks must be called inside loops for dynamic binding",
          "Hooks can only be called at the top level of React function components or custom hooks",
          "Hooks must always be executed asynchronously inside setTimeout",
          "Hooks can only be called inside class components"
        ],
        correctAnswer: 1,
        explanation: "Hooks must be called at the top level of React functions, never inside conditions, loops, or nested functions to preserve Hook call order across renders."
      },
      {
        id: "rq2",
        question: "When does the cleanup function returned by useEffect execute?",
        options: [
          "Only when the browser window closes",
          "Before the component re-renders with new dependencies, and when the component unmounts",
          "Immediately when the component first mounts",
          "Every 100 milliseconds automatically"
        ],
        correctAnswer: 1,
        explanation: "React runs the cleanup function before executing the effect again on re-render with updated dependencies, and upon component unmounting."
      },
      {
        id: "rq3",
        question: "Why should state never be mutated directly in React (e.g. state.count = 5)?",
        options: [
          "Direct mutation crashes the JavaScript V8 engine",
          "React compares state references by identity (Object.is) to trigger re-renders; mutating existing references skips reconciliation",
          "Direct mutation is deprecated in HTML5",
          "React will automatically delete the object"
        ],
        correctAnswer: 1,
        explanation: "React relies on immutable state updates to detect when state has changed and schedule re-renders via shallow comparison."
      },
      {
        id: "rq4",
        question: "What does the useMemo hook memoize?",
        options: [
          "A callback function reference",
          "The calculated result value of an expensive computation",
          "DOM element node references",
          "Browser LocalStorage keys"
        ],
        correctAnswer: 1,
        explanation: "useMemo caches the returned value of a calculation between renders until one of its dependencies changes."
      },
      {
        id: "rq5",
        question: "What is the main role of the React Context API?",
        options: [
          "To replace REST APIs and database servers",
          "To share data globally across a component tree without manually passing props down at every level",
          "To convert JSX into CSS stylesheets",
          "To prevent cross-site scripting vulnerabilities"
        ],
        correctAnswer: 1,
        explanation: "Context provides a way to pass data through the component tree without having to pass props down manually at every level ('prop drilling')."
      }
    ]
  },
  {
    id: "quiz-dsa-complexity",
    title: "Algorithms, Trees & Asymptotic Complexity Challenge",
    courseId: "data-structures",
    courseName: "Data Structures & Algorithms in Depth",
    durationMinutes: 15,
    passingScore: 70,
    questionsCount: 5,
    difficulty: "Hard",
    bestScore: null,
    completed: false,
    questions: [
      {
        id: "dq1",
        question: "What is the average and worst-case time complexity of QuickSort?",
        options: [
          "Average: O(n log n), Worst: O(n^2)",
          "Average: O(n), Worst: O(n log n)",
          "Average: O(n^2), Worst: O(n^2)",
          "Average: O(log n), Worst: O(n)"
        ],
        correctAnswer: 0,
        explanation: "QuickSort runs in O(n log n) average time, but degrades to O(n^2) in the worst case (e.g., when the pivot is consistently the smallest or largest element on already sorted data without random pivoting)."
      },
      {
        id: "dq2",
        question: "Which data structure is fundamentally used for Breadth-First Search (BFS) on graphs?",
        options: [
          "Stack (LIFO)",
          "Queue (FIFO)",
          "Priority Queue exclusively",
          "Binary Heap"
        ],
        correctAnswer: 1,
        explanation: "BFS explores nodes level by level using a FIFO Queue to ensure vertices closest to the source are processed first."
      },
      {
        id: "dq3",
        question: "In a balanced Binary Search Tree with N nodes, what is the search time complexity?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N log N)"
        ],
        correctAnswer: 1,
        explanation: "A balanced BST has a height of log2(N), which yields O(log N) search, insertion, and deletion complexity."
      },
      {
        id: "dq4",
        question: "What property must a problem possess to be solvable using Dynamic Programming?",
        options: [
          "NP-Complete status and greedy heuristics",
          "Overlapping subproblems and optimal substructure",
          "Infinite memory and parallel execution threads",
          "Linear time verification only"
        ],
        correctAnswer: 1,
        explanation: "Dynamic programming applies when subproblems overlap (saving recomputation) and an optimal solution to the problem contains optimal solutions to subproblems."
      },
      {
        id: "dq5",
        question: "What is the worst-case lookup time in a Hash Table with high hash collisions?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N^2)"
        ],
        correctAnswer: 2,
        explanation: "If all keys collide and hash to the same bucket in a linked list collision chain, search degrades to linear time O(N)."
      }
    ]
  },
  {
    id: "quiz-python-core",
    title: "Python 3 Idioms, Decorators & Collections",
    courseId: "python-fundamentals",
    courseName: "Python 3 Fundamentals & Automation",
    durationMinutes: 10,
    passingScore: 70,
    questionsCount: 5,
    difficulty: "Easy to Medium",
    bestScore: null,
    completed: false,
    questions: [
      {
        id: "pq1",
        question: "Which of the following data types in Python is IMMUTABLE?",
        options: [
          "List",
          "Dictionary",
          "Tuple",
          "Set"
        ],
        correctAnswer: 2,
        explanation: "Tuples (along with strings, ints, and floats) are immutable in Python; their contents cannot be modified after creation."
      },
      {
        id: "pq2",
        question: "What is the output of [x**2 for x in range(4) if x % 2 == 0]?",
        options: [
          "[0, 4]",
          "[0, 1, 4, 9]",
          "[4, 16]",
          "[1, 9]"
        ],
        correctAnswer: 0,
        explanation: "range(4) produces 0, 1, 2, 3. The even numbers are 0 and 2. Squaring them yields [0**2, 2**2] = [0, 4]."
      },
      {
        id: "pq3",
        question: "What is the role of *args and **kwargs in a Python function signature?",
        options: [
          "They declare private variables",
          "*args accepts variable positional arguments as a tuple, **kwargs accepts variable keyword arguments as a dict",
          "They import external C libraries",
          "They enforce type safety checking"
        ],
        correctAnswer: 1,
        explanation: "*args collects excess positional arguments into a tuple, while **kwargs collects excess keyword arguments into a dictionary."
      },
      {
        id: "pq4",
        question: "What does the 'with open(...) as f:' context manager guarantee?",
        options: [
          "The file is encrypted automatically",
          "The file handle is always closed reliably, even if an exception occurs inside the block",
          "The file is copied to cloud backup",
          "The file permissions become read-only"
        ],
        correctAnswer: 1,
        explanation: "Python's context manager invokes __enter__ and __exit__, ensuring that the underlying file descriptor is closed automatically."
      },
      {
        id: "pq5",
        question: "In Python OOP, what special method is called when an object is instantiated?",
        options: [
          "__create__",
          "__init__",
          "__start__",
          "__main__"
        ],
        correctAnswer: 1,
        explanation: "The __init__ method initializes the newly created instance's attributes upon object instantiation."
      }
    ]
  },
  {
    id: "quiz-database-sql",
    title: "SQL Mastery, Normalization & ACID Transactions",
    courseId: "database-management",
    courseName: "Database Management & Modern SQL Architecture",
    durationMinutes: 10,
    passingScore: 70,
    questionsCount: 5,
    difficulty: "Medium",
    bestScore: null,
    completed: false,
    questions: [
      {
        id: "sq1",
        question: "What does the 'A' in ACID transactions represent?",
        options: [
          "Asynchronous",
          "Atomicity",
          "Authentication",
          "Authorization"
        ],
        correctAnswer: 1,
        explanation: "Atomicity ensures that all statements in a transaction either complete successfully together or are completely rolled back (all-or-nothing)."
      },
      {
        id: "sq2",
        question: "Which SQL clause is used to filter the grouped results produced by a GROUP BY clause?",
        options: [
          "WHERE",
          "HAVING",
          "ORDER BY",
          "FILTER BY"
        ],
        correctAnswer: 1,
        explanation: "WHERE filters rows before grouping, whereas HAVING filters aggregate groups after the GROUP BY is performed."
      },
      {
        id: "sq3",
        question: "What is a primary requirement for a relation to be in Second Normal Form (2NF)?",
        options: [
          "It must contain no NULL values",
          "It must be in 1NF and have no partial dependencies on a composite primary key",
          "It must use NoSQL JSON structures",
          "It must have at least 5 tables"
        ],
        correctAnswer: 1,
        explanation: "2NF requires that the relation is in 1NF and that every non-key attribute is fully functionally dependent on the entire primary key, not a proper subset."
      },
      {
        id: "sq4",
        question: "What type of JOIN returns all records from the left table and matched records from the right table?",
        options: [
          "INNER JOIN",
          "LEFT OUTER JOIN",
          "CROSS JOIN",
          "NATURAL JOIN"
        ],
        correctAnswer: 1,
        explanation: "LEFT (OUTER) JOIN preserves all rows from the left table; unmatched columns from the right table are populated with NULLs."
      },
      {
        id: "sq5",
        question: "How do B-Tree indexes speed up SELECT query execution?",
        options: [
          "By deleting duplicate rows automatically",
          "By providing a balanced logarithmic search tree that avoids full table scans",
          "By converting queries into machine code",
          "By caching the entire database in browser RAM"
        ],
        correctAnswer: 1,
        explanation: "B-Tree indexes maintain sorted keys in balanced nodes, allowing O(log N) searches, range scans, and avoiding costly full table scans."
      }
    ]
  }
];
