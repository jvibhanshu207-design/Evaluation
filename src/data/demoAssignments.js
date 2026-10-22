export const DEMO_ASSIGNMENTS = [
  {
    id: "asg-1",
    title: "Java OOP Hierarchy & Abstract Payroll System",
    courseId: "java-programming",
    courseName: "Java Programming Masterclass",
    dueDate: "Tomorrow at 11:59 PM",
    marks: 20,
    status: "Pending", // 'Pending', 'Submitted', 'Graded'
    grade: null,
    feedback: null,
    submittedAt: null,
    submissionText: "",
    description: "Design an abstract Employee superclass with subclasses SalariedEmployee, HourlyEmployee, and CommissionEmployee. Implement polymorphic earnings calculations and proper encapsulation.",
    instructions: [
      "Create an abstract class Employee with private fields: firstName, lastName, socialSecurityNumber.",
      "Implement abstract method double earnings().",
      "Create subclasses with their respective rate calculation formulas.",
      "Write a test driver program demonstrating polymorphic array iteration over Employee references.",
      "Submit your source code files or paste your complete solution below."
    ]
  },
  {
    id: "asg-2",
    title: "React Custom Hooks & Debounced Search Engine",
    courseId: "react-development",
    courseName: "React 19 & Next-Gen Frontend Engineering",
    dueDate: "In 3 days",
    marks: 25,
    status: "Pending",
    grade: null,
    feedback: null,
    submittedAt: null,
    submissionText: "",
    description: "Implement a custom hook useDebounce(value, delay) and build a real-time instant search component that avoids redundant API queries while the user types.",
    instructions: [
      "Create useDebounce(value, delay) using useEffect and setTimeout with proper cleanup.",
      "Build a searchable interface querying a mock list of 50 products.",
      "Ensure proper TypeScript or PropTypes validation.",
      "Include a loading spinner state while simulated search resolves."
    ]
  },
  {
    id: "asg-3",
    title: "DSA: Balanced Binary Search Tree Validation & LCA",
    courseId: "data-structures",
    courseName: "Data Structures & Algorithms in Depth",
    dueDate: "In 5 days",
    marks: 30,
    status: "Pending",
    grade: null,
    feedback: null,
    submittedAt: null,
    submissionText: "",
    description: "Write algorithms to validate whether an arbitrary binary tree satisfies the BST invariant and find the Lowest Common Ancestor (LCA) of two given nodes in O(h) time.",
    instructions: [
      "Implement boolean isValidBST(TreeNode root) using range-based boundaries (min, max).",
      "Implement TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q).",
      "Analyze the asymptotic time and auxiliary space complexity.",
      "Include unit test assertions covering edge cases such as duplicate keys or null roots."
    ]
  },
  {
    id: "asg-4",
    title: "Relational Normalization & High-Throughput E-Commerce Schema",
    courseId: "database-management",
    courseName: "Database Management & Modern SQL Architecture",
    dueDate: "In 6 days",
    marks: 25,
    status: "Pending",
    grade: null,
    feedback: null,
    submittedAt: null,
    submissionText: "",
    description: "Convert an unnormalized sales ledger into Third Normal Form (3NF). Generate DDL SQL statements with primary keys, foreign key constraints, and performance indexes.",
    instructions: [
      "Produce ERD diagram representing Customers, Orders, OrderItems, Products, and Categories.",
      "Decompose 0NF/1NF tables up to 3NF showing functional dependencies.",
      "Provide CREATE TABLE statements with appropriate ON DELETE CASCADE / RESTRICT rules.",
      "Recommend composite indexes for customer order history lookup."
    ]
  },
  {
    id: "asg-5",
    title: "Python Data Pipeline & JSON API Transformation",
    courseId: "python-fundamentals",
    courseName: "Python 3 Fundamentals & Automation",
    dueDate: "Last Week",
    marks: 20,
    status: "Graded",
    grade: 19,
    feedback: "Exceptional code readability, beautiful use of list comprehensions and clean error handling!",
    submittedAt: "2026-09-28T14:30:00Z",
    submissionText: "def process_pipeline(input_data):\n    return [item for item in input_data if item.get('active')]",
    description: "Automate ingestion of nested JSON weather data, compute 7-day rolling temperature averages, and output a structured CSV report.",
    instructions: [
      "Ingest JSON payload using Python's json standard library.",
      "Compute moving averages without third-party heavy dependencies.",
      "Write error-handling for missing sensor entries."
    ]
  },
  {
    id: "asg-6",
    title: "Responsive Glassmorphic Portfolio with Modern CSS",
    courseId: "web-development",
    courseName: "Full-Stack Web Development Bootcamp",
    dueDate: "3 days ago",
    marks: 25,
    status: "Submitted",
    grade: null,
    feedback: "Under review by instructor Aiden Scott.",
    submittedAt: "2026-10-02T18:15:00Z",
    submissionText: "https://github.com/vibhanshu/glass-portfolio-demo",
    description: "Create a modern personal developer portfolio showcasing projects with CSS Grid, custom properties, and smooth backdrop-filter glassmorphism.",
    instructions: [
      "Must be 100% responsive across mobile, tablet, and desktop viewports.",
      "Implement a sleek dark/light mode toggle.",
      "Achieve zero layout shifts (CLS < 0.1)."
    ]
  }
];
