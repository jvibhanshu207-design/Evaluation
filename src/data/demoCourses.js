export const DEMO_COURSES = [
  {
    id: "java-programming",
    title: "Java Programming Masterclass",
    slug: "java-programming",
    category: "Programming",
    level: "Beginner to Advanced",
    instructor: {
      name: "Dr. Arvind Sharma",
      role: "Lead Java Architect & Professor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 4.9,
      students: 14250,
      bio: "15+ years in Enterprise Java, Spring Boot microservices, and Computer Science pedagogy."
    },
    rating: 4.9,
    reviewsCount: 1840,
    studentsCount: 12480,
    duration: "18.5 hours",
    totalLessons: 10,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    badge: "Bestseller",
    price: 49.99,
    originalPrice: 89.99,
    description: "Master Java from foundational syntax to object-oriented architecture, collections framework, multithreading, and enterprise design patterns.",
    overview: [
      "Core Java syntax, variables, data types, and arithmetic logic",
      "Object-Oriented Programming (Encapsulation, Inheritance, Polymorphism, Abstraction)",
      "Java Collections Framework (ArrayList, HashMap, HashSet)",
      "Exception handling and robust defensive programming",
      "Multithreading, concurrency, and modern Java 17/21 features"
    ],
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Java Fundamentals & Logic",
        lessons: [
          {
            id: "java-l1",
            title: "1. Introduction to Java & Environment Setup",
            videoId: "BGTx91t8q50",
            duration: "14:20",
            description: "Learn how the JVM, JRE, and JDK work together. Write, compile, and run your first Java program.",
            completed: true
          },
          {
            id: "java-l2",
            title: "2. Variables, Data Types & Memory Allocation",
            videoId: "grEKMHGYyns",
            duration: "18:45",
            description: "Understand primitive data types, reference types, memory stack vs heap, and variable scoping.",
            completed: true
          },
          {
            id: "java-l3",
            title: "3. Operators, Expressions & Control Structures",
            videoId: "yRpLlJmRo2w",
            duration: "21:10",
            description: "Control flow with if-else conditions, switch expressions, ternary operators, and logical operators.",
            completed: true
          },
          {
            id: "java-l4",
            title: "4. Loops & Iterative Processing in Java",
            videoId: "ZJe7i_yUo-I",
            duration: "16:30",
            description: "Master while, do-while, and for loops including enhanced for-each iterations over arrays.",
            completed: false
          }
        ]
      },
      {
        id: "mod-2",
        title: "Module 2: Object-Oriented Programming (OOP)",
        lessons: [
          {
            id: "java-l5",
            title: "5. Classes, Objects & Memory Instantiation",
            videoId: "8cm1x4bC610",
            duration: "22:15",
            description: "How blueprint classes instantiate living objects in memory with fields, methods, and constructors.",
            completed: false
          },
          {
            id: "java-l6",
            title: "6. Constructors, Method Overloading & 'this' Keyword",
            videoId: "IUqCuw_PcG8",
            duration: "19:40",
            description: "Custom constructor initialization, default constructors, method overloading, and the 'this' reference.",
            completed: false
          },
          {
            id: "java-l7",
            title: "7. Inheritance, 'super' & Method Overriding",
            videoId: "4e_A_a4pGv8",
            duration: "24:00",
            description: "Extending base classes, code reuse, method overriding, runtime polymorphism, and super calls.",
            completed: false
          },
          {
            id: "java-l8",
            title: "8. Polymorphism, Abstract Classes & Interfaces",
            videoId: "4kKx2I_zXlA",
            duration: "26:50",
            description: "Decoupled architecture using interfaces and abstract classes to achieve high modularity.",
            completed: false
          }
        ]
      },
      {
        id: "mod-3",
        title: "Module 3: Robust Java & Collections",
        lessons: [
          {
            id: "java-l9",
            title: "9. Exception Handling (try-catch-finally, throws)",
            videoId: "1XfA_O_tZ0E",
            duration: "20:30",
            description: "Checked vs unchecked exceptions, writing custom exception classes, and try-with-resources.",
            completed: false
          },
          {
            id: "java-l10",
            title: "10. Java Collections: Lists, Sets & HashMaps",
            videoId: "A74TOX803D0",
            duration: "28:15",
            description: "Working with ArrayList, LinkedList, HashSet, and HashMap for scalable data manipulation.",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "react-development",
    title: "React 19 & Next-Gen Frontend Engineering",
    slug: "react-development",
    category: "Web Development",
    level: "Intermediate",
    instructor: {
      name: "Sophia Chen",
      role: "Senior Frontend Engineer & UI Architect",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      rating: 4.95,
      students: 18900,
      bio: "Former Meta UI engineer, creator of popular React open-source toolkits."
    },
    rating: 4.95,
    reviewsCount: 2310,
    studentsCount: 16750,
    duration: "21.0 hours",
    totalLessons: 10,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    badge: "Trending",
    price: 59.99,
    originalPrice: 99.99,
    description: "Build cutting-edge, ultra-fast web apps using modern React, Hooks, Context, routing, state architecture, and micro-interactions.",
    overview: [
      "Modern React architecture: JSX, Virtual DOM, and component composition",
      "React Hooks in depth: useState, useEffect, useRef, useMemo, useCallback",
      "Global state management with Context API and custom store patterns",
      "React Router 7 / modern client-side routing & layouts",
      "Building accessible, fluid, hackathon-winning user interfaces"
    ],
    modules: [
      {
        id: "react-mod-1",
        title: "Module 1: React Foundations & Components",
        lessons: [
          {
            id: "react-l1",
            title: "1. Modern React Architecture & Mental Model",
            videoId: "bMknfKXIFA8",
            duration: "22:10",
            description: "Why React rules the frontend. Declarative UI, component tree, and the reconciliation engine.",
            completed: true
          },
          {
            id: "react-l2",
            title: "2. Components, JSX & Modern Props System",
            videoId: "SqcY0GlETPk",
            duration: "19:30",
            description: "Creating composable UI blocks, passing typed props, children props, and conditional JSX.",
            completed: true
          },
          {
            id: "react-l3",
            title: "3. State Management with useState",
            videoId: "4ORZ1GmjaMc",
            duration: "24:40",
            description: "Managing local component state, updater functions, and immutable state updates.",
            completed: true
          },
          {
            id: "react-l4",
            title: "4. Lifecycle & Side Effects with useEffect",
            videoId: "O6P86uwfdR0",
            duration: "27:15",
            description: "Connecting to external systems, data fetching, cleanup functions, and dependency array rules.",
            completed: true
          }
        ]
      },
      {
        id: "react-mod-2",
        title: "Module 2: Advanced Hooks & Routing",
        lessons: [
          {
            id: "react-l5",
            title: "5. Global State with React Context API",
            videoId: "lawU_k933e8",
            duration: "25:50",
            description: "Avoid prop drilling. Create clean providers, consumers, and custom Context hooks.",
            completed: true
          },
          {
            id: "react-l6",
            title: "6. Client-Side Routing with React Router",
            videoId: "k2Zk5cbiZhg",
            duration: "26:30",
            description: "Route configuration, nested layouts, URL parameters, query strings, and protected routes.",
            completed: true
          },
          {
            id: "react-l7",
            title: "7. Custom React Hooks for Reusability",
            videoId: "35lXWvCuM8o",
            duration: "21:40",
            description: "Extracting repetitive component logic into modular, testable custom React hooks.",
            completed: false
          }
        ]
      },
      {
        id: "react-mod-3",
        title: "Module 3: Styling, Animation & Performance",
        lessons: [
          {
            id: "react-l8",
            title: "8. Modern Styling, CSS Modules & Design Systems",
            videoId: "00kXCU9S30s",
            duration: "23:15",
            description: "Building resilient design tokens, dark mode themes, and glassmorphic UI patterns.",
            completed: false
          },
          {
            id: "react-l9",
            title: "9. React Performance Optimization (memo, useMemo)",
            videoId: "w7ejDZ8SWv8",
            duration: "20:55",
            description: "Diagnosing unnecessary re-renders with React Profiler and applying memoization strategies.",
            completed: false
          },
          {
            id: "react-l10",
            title: "10. Production Deployment & Hackathon Polish",
            videoId: "2OTq15A58Cw",
            duration: "18:20",
            description: "Bundle optimization, SEO meta tags, lighthouse auditing, and deploying to Vercel/Netlify.",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "data-structures",
    title: "Data Structures & Algorithms in Depth",
    slug: "data-structures",
    category: "Programming",
    level: "Intermediate to Advanced",
    instructor: {
      name: "Prof. Rajesh Kulkarni",
      role: "Competitive Programming Master",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 4.88,
      students: 21300,
      bio: "Author of algorithmic textbooks, coached university teams for ACM-ICPC World Finals."
    },
    rating: 4.88,
    reviewsCount: 3120,
    studentsCount: 19800,
    duration: "24.0 hours",
    totalLessons: 9,
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
    badge: "Essential",
    price: 54.99,
    originalPrice: 94.99,
    description: "Crack technical interviews and develop computational thinking with comprehensive coverage of arrays, trees, graphs, and dynamic programming.",
    overview: [
      "Asymptotic complexity analysis: Big O, Big Theta, and Big Omega",
      "Linear structures: Dynamic arrays, linked lists, stacks, and queues",
      "Hierarchical structures: Binary trees, BSTs, AVL, heaps, and tries",
      "Graph traversal algorithms: BFS, DFS, Dijkstra, and Topological Sort",
      "Dynamic programming: Memoization, tabulation, and recurrence relations"
    ],
    modules: [
      {
        id: "dsa-mod-1",
        title: "Module 1: Complexity & Linear Structures",
        lessons: [
          {
            id: "dsa-l1",
            title: "1. Algorithms, Big-O Notation & Time Complexity",
            videoId: "8hly31xKli0",
            duration: "25:10",
            description: "Master time and space complexity with practical step-by-step mathematical examples.",
            completed: true
          },
          {
            id: "dsa-l2",
            title: "2. Big O Analysis of Common Operations",
            videoId: "RBSGKlAvoiM",
            duration: "18:30",
            description: "Analyzing nested loops, logarithmic operations, and amortized constant time.",
            completed: true
          },
          {
            id: "dsa-l3",
            title: "3. Arrays, Slices & Memory Allocation",
            videoId: "zg9ih6SVACc",
            duration: "22:15",
            description: "Contiguous memory layout, dynamic array resizing, and two-pointer array algorithms.",
            completed: false
          },
          {
            id: "dsa-l4",
            title: "4. Singly & Doubly Linked Lists",
            videoId: "WwfhLC16bis",
            duration: "26:40",
            description: "Pointer manipulation, reversal, cycle detection (Floyd's algorithm), and edge cases.",
            completed: false
          }
        ]
      },
      {
        id: "dsa-mod-2",
        title: "Module 2: Stacks, Queues & Trees",
        lessons: [
          {
            id: "dsa-l5",
            title: "5. Stacks, Queues & Monotonic Deque",
            videoId: "F1F2imiOJfk",
            duration: "24:10",
            description: "LIFO and FIFO operations, expression evaluation, sliding window maximum.",
            completed: false
          },
          {
            id: "dsa-l6",
            title: "6. Binary Trees & Binary Search Trees (BST)",
            videoId: "oSWTXtMGlKE",
            duration: "29:30",
            description: "Inorder, preorder, postorder traversals, search, insertion, and balancing BSTs.",
            completed: false
          }
        ]
      },
      {
        id: "dsa-mod-3",
        title: "Module 3: Graphs & Dynamic Programming",
        lessons: [
          {
            id: "dsa-l7",
            title: "7. Graph Algorithms: BFS, DFS & Shortest Path",
            videoId: "g_sexCX2HFI",
            duration: "32:00",
            description: "Adjacency matrix vs list, breadth-first search, depth-first search, and cycle detection.",
            completed: false
          },
          {
            id: "dsa-l8",
            title: "8. Sorting Algorithms: QuickSort, MergeSort",
            videoId: "KEEKn7Me-ms",
            duration: "27:45",
            description: "Divide and conquer sorting paradigms, pivot selection, and stability analysis.",
            completed: false
          },
          {
            id: "dsa-l9",
            title: "9. Dynamic Programming Fundamentals",
            videoId: "oBt53YbR9Kk",
            duration: "35:10",
            description: "Overlapping subproblems, optimal substructure, memoization vs bottom-up tabulation.",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "python-fundamentals",
    title: "Python 3 Fundamentals & Automation",
    slug: "python-fundamentals",
    category: "Programming",
    level: "Beginner",
    instructor: {
      name: "Elena Rostova",
      role: "Data Scientist & Python Core Contributor",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      rating: 4.92,
      students: 15600,
      bio: "Python educator with 1M+ students worldwide, specializing in scripting and data science."
    },
    rating: 4.92,
    reviewsCount: 1950,
    studentsCount: 14200,
    duration: "16.0 hours",
    totalLessons: 8,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    badge: "Free Access",
    isFree: true,
    price: 0,
    originalPrice: 0,
    description: "Start coding with Python. Learn clean Pythonic syntax, list comprehensions, object-oriented concepts, and practical automation scripts.",
    overview: [
      "Python 3 installation, interactive shell, variables, and data types",
      "Control flow, conditional logic, and looping structures",
      "Data structures: Lists, Tuples, Dictionaries, and Sets",
      "Functions, *args, **kwargs, lambda expressions, and decorators",
      "File I/O, JSON processing, and real-world task automation"
    ],
    modules: [
      {
        id: "py-mod-1",
        title: "Module 1: Python Core Syntax",
        lessons: [
          {
            id: "py-l1",
            title: "1. Python Setup & Your First Script",
            videoId: "_uQrJ0TkZlc",
            duration: "17:40",
            description: "Setting up Python 3, virtual environments, and writing clean PEP 8 compliant code.",
            completed: true
          },
          {
            id: "py-l2",
            title: "2. Variables, Numbers & String Formatting",
            videoId: "kqtD5dpn9C8",
            duration: "19:20",
            description: "Working with f-strings, numeric precision, casting, and string manipulation methods.",
            completed: true
          },
          {
            id: "py-l3",
            title: "3. Conditionals, Match-Case & Loops",
            videoId: "rfscVS0vtbw",
            duration: "21:05",
            description: "Logical branching, ternary statements, while loops, and for-range iterations.",
            completed: false
          }
        ]
      },
      {
        id: "py-mod-2",
        title: "Module 2: Collections & OOP",
        lessons: [
          {
            id: "py-l4",
            title: "4. Python Lists, Tuples & Dictionaries",
            videoId: "JeznW_703ts",
            duration: "26:30",
            description: "Deep dive into list comprehensions, dictionary lookups, and unpacking operators.",
            completed: false
          },
          {
            id: "py-l5",
            title: "5. Object-Oriented Python (Classes & Dunder Methods)",
            videoId: "HGOBQPFzWKo",
            duration: "28:10",
            description: "Defining classes, __init__, __str__, inheritance, and encapsulation in Python.",
            completed: false
          }
        ]
      },
      {
        id: "py-mod-3",
        title: "Module 3: Practical Python",
        lessons: [
          {
            id: "py-l6",
            title: "6. File Handling & JSON Serialization",
            videoId: "1bKzH2uWp0M",
            duration: "22:15",
            description: "Reading and writing files with context managers ('with open'), JSON APIs, and CSV parsing.",
            completed: false
          },
          {
            id: "py-l7",
            title: "7. Exception Handling & Defensive Coding",
            videoId: "C-gEQdGVXbk",
            duration: "18:40",
            description: "try-except-else-finally blocks, catching specific exceptions, and raising errors.",
            completed: false
          },
          {
            id: "py-l8",
            title: "8. Automation Scripting & Web Requests",
            videoId: "xxPC-SXZeWQ",
            duration: "24:30",
            description: "Automate repetitive daily tasks using requests and built-in Python standard libraries.",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "database-management",
    title: "Database Management & Modern SQL Architecture",
    slug: "database-management",
    category: "Database",
    level: "Intermediate",
    instructor: {
      name: "Marcus Vance",
      role: "Principal Database Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      rating: 4.89,
      students: 11200,
      bio: "High-scale database consultant, veteran DBA for banking & fintech distributed systems."
    },
    rating: 4.89,
    reviewsCount: 1420,
    studentsCount: 10400,
    duration: "17.5 hours",
    totalLessons: 8,
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
    badge: "High Demand",
    price: 44.99,
    originalPrice: 79.99,
    description: "Design relational schemas, optimize complex SQL queries, master database indexing, ACID transactions, and compare SQL vs NoSQL systems.",
    overview: [
      "Relational schema design, entity relationship diagrams (ERD), and normalization (1NF-3NF)",
      "Advanced SQL querying: Aggregate functions, GROUP BY, HAVING, and Subqueries",
      "Multi-table JOINs (INNER, LEFT, RIGHT, FULL OUTER) and set operators",
      "Indexing strategies (B-Trees, Hash indexes) and query execution plan analysis",
      "ACID transactions, isolation levels, concurrency locks, and NoSQL comparison"
    ],
    modules: [
      {
        id: "db-mod-1",
        title: "Module 1: Relational Design & Basic SQL",
        lessons: [
          {
            id: "db-l1",
            title: "1. Relational Database Concepts & SQL Intro",
            videoId: "HXV3zeQKqGY",
            duration: "23:45",
            description: "Tables, primary keys, foreign keys, constraints, and relational database management systems.",
            completed: true
          },
          {
            id: "db-l2",
            title: "2. Schema Design, Normalization & ERDs",
            videoId: "7S_tz1z_5bA",
            duration: "27:10",
            description: "Eliminate data redundancy. Understanding first, second, and third normal forms (1NF, 2NF, 3NF).",
            completed: true
          },
          {
            id: "db-l3",
            title: "3. Mastering SELECT, WHERE, ORDER BY & LIMIT",
            videoId: "p3qvj9hO_Bo",
            duration: "25:20",
            description: "Filtering records, pattern matching with LIKE, boolean expressions, and sorting results.",
            completed: false
          }
        ]
      },
      {
        id: "db-mod-2",
        title: "Module 2: Advanced Queries & Indexes",
        lessons: [
          {
            id: "db-l4",
            title: "4. Database Indexing & Query Execution Plans",
            videoId: "o3638p_6yBo",
            duration: "24:35",
            description: "How B-tree indexes speed up queries, index selectivity, and analyzing EXPLAIN output.",
            completed: false
          },
          {
            id: "db-l5",
            title: "5. NoSQL Document Databases (MongoDB vs SQL)",
            videoId: "W2Z7TSt420Q",
            duration: "22:50",
            description: "When to choose SQL vs NoSQL document stores, flexible schemas, and horizontal scaling.",
            completed: false
          }
        ]
      },
      {
        id: "db-mod-3",
        title: "Module 3: Transactions & App Integration",
        lessons: [
          {
            id: "db-l6",
            title: "6. ACID Transactions, Locks & Concurrency",
            videoId: "cz3wczrU_p4",
            duration: "28:15",
            description: "Atomicity, Consistency, Isolation, Durability, rollback mechanisms, and deadlock prevention.",
            completed: false
          },
          {
            id: "db-l7",
            title: "7. Connecting Databases to Web Applications",
            videoId: "K6w0bZmvHPU",
            duration: "26:40",
            description: "Connection pooling, ORMs vs raw query builders, and environment variable configuration.",
            completed: false
          },
          {
            id: "db-l8",
            title: "8. Database Security, Backups & SQL Injection Prevention",
            videoId: "OF_366ZJ1jY",
            duration: "20:10",
            description: "Parameterized queries, prepared statements, role-based access control, and automated backups.",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "web-development",
    title: "Full-Stack Web Development Bootcamp",
    slug: "web-development",
    category: "Web Development",
    level: "All Levels",
    instructor: {
      name: "Aiden Scott",
      role: "Full-Stack Developer & Tech Speaker",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      rating: 4.94,
      students: 26500,
      bio: "12+ years building scalable SaaS web platforms and mentor to 500+ junior engineers."
    },
    rating: 4.94,
    reviewsCount: 3890,
    studentsCount: 24300,
    duration: "22.5 hours",
    totalLessons: 8,
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80",
    badge: "Comprehensive",
    price: 49.99,
    originalPrice: 84.99,
    description: "From semantic HTML5 and modern CSS Grid to JavaScript ES6+, asynchronous API communication, Git version control, and production deployment.",
    overview: [
      "Semantic HTML5 tags, accessibility (a11y), and SEO foundation",
      "CSS3 modern layouts: Flexbox, Grid, custom properties, and animations",
      "JavaScript ES6+: Arrow functions, destructuring, promises, and async/await",
      "DOM manipulation, event delegation, and browser APIs",
      "Git version control, collaborative workflows, and live hosting"
    ],
    modules: [
      {
        id: "web-mod-1",
        title: "Module 1: Semantic HTML & Modern CSS",
        lessons: [
          {
            id: "web-l1",
            title: "1. HTML5 Semantic Architecture & Clean Code",
            videoId: "mU6anWqZJcc",
            duration: "24:15",
            description: "Building accessible document structures with modern semantic elements and metadata.",
            completed: true
          },
          {
            id: "web-l2",
            title: "2. Modern CSS Grid & Responsive Flexbox",
            videoId: "y17RuWkWdn8",
            duration: "27:50",
            description: "Craft responsive fluid layouts without media query overload using CSS Grid and Flexbox.",
            completed: true
          }
        ]
      },
      {
        id: "web-mod-2",
        title: "Module 2: JavaScript Mastery",
        lessons: [
          {
            id: "web-l3",
            title: "3. JavaScript Foundations & Modern ES6+",
            videoId: "W6NZfCO5SIk",
            duration: "29:30",
            description: "Variables (let/const), scope, functions, arrow syntax, template literals, and objects.",
            completed: false
          },
          {
            id: "web-l4",
            title: "4. DOM Manipulation & Event Handling",
            videoId: "hdI2bqOjy3c",
            duration: "25:40",
            description: "Selecting elements, manipulating styles, listening to events, and event bubbling.",
            completed: false
          },
          {
            id: "web-l5",
            title: "5. Asynchronous JavaScript, Promises & Fetch API",
            videoId: "cuEtnrL9-H0",
            duration: "31:20",
            description: "Handling asynchronous data, consuming RESTful APIs, error handling with async/await.",
            completed: false
          }
        ]
      },
      {
        id: "web-mod-3",
        title: "Module 3: Professional Web Workflow",
        lessons: [
          {
            id: "web-l6",
            title: "6. Building Real-World REST API Integrations",
            videoId: "PoRJizFvM7s",
            duration: "28:10",
            description: "CRUD operations, HTTP verbs (GET, POST, PUT, DELETE), headers, and auth tokens.",
            completed: false
          },
          {
            id: "web-l7",
            title: "7. Git & GitHub for Collaborative Engineering",
            videoId: "VlPiVmYuoqw",
            duration: "22:00",
            description: "Branching strategies, commit conventions, resolving merge conflicts, and pull requests.",
            completed: false
          },
          {
            id: "web-l8",
            title: "8. Web Performance Optimization & Lighthouse Auditing",
            videoId: "2OTq15A58Cw",
            duration: "20:30",
            description: "Image optimization, code splitting, critical CSS, and achieving 100/100 Lighthouse scores.",
            completed: false
          }
        ]
      }
    ]
  }
];
