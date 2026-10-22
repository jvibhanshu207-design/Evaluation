export const DEMO_NOTES = [
  {
    id: "note-1",
    title: "Java Memory Model & Heap vs Stack Cheatsheet",
    category: "Java",
    tags: ["Java", "Memory", "Architecture"],
    pinned: true,
    updatedAt: "2026-10-04T16:20:00Z",
    content: `# Java Memory Architecture

### Stack Memory
- Stores primitive values and references to heap objects.
- Each thread gets its own private call stack.
- Fast LIFO allocation/deallocation; no garbage collector overhead.

### Heap Memory
- Stores all instantiated objects (e.g. \`new Employee()\`).
- Shared globally across all application threads.
- Managed automatically by the Garbage Collector (G1, ZGC).
- OutOfMemoryError occurs when heap allocation threshold is breached.

### Quick Tip
Keep object creation minimal inside tight performance loops to minimize GC pauses!`
  },
  {
    id: "note-2",
    title: "React 19 Hooks Golden Rules & Best Practices",
    category: "React",
    tags: ["React", "Hooks", "Frontend"],
    pinned: true,
    updatedAt: "2026-10-03T11:45:00Z",
    content: `# React 19 Hooks Rules

1. **Only Call Hooks at the Top Level**: Never call inside conditions, loops, or nested callbacks.
2. **Only Call Hooks from React Function Components** or custom Hooks.
3. **Always Declare All Dependencies**: When using \`useEffect\`, \`useMemo\`, or \`useCallback\`, specify every reactive value in the dependency array.

### Custom Hook Pattern
\`\`\`jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}
\`\`\``
  },
  {
    id: "note-3",
    title: "Big-O Time Complexity Master Matrix",
    category: "DSA",
    tags: ["Algorithms", "Big-O", "Interviews"],
    pinned: false,
    updatedAt: "2026-10-02T09:15:00Z",
    content: `# Big-O Cheat Sheet

| Data Structure | Access | Search | Insertion | Deletion |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| Stack / Queue | O(n) | O(n) | O(1) | O(1) |
| Singly Linked List | O(n) | O(n) | O(1) | O(1) |
| Binary Search Tree | O(log n) | O(log n) | O(log n) | O(log n) |
| Hash Table | N/A | O(1) avg | O(1) avg | O(1) avg |

*Worst case for Hash Table with complete hash collisions is O(n).*`
  },
  {
    id: "note-4",
    title: "Database Indexing & B-Tree vs Hash Index",
    category: "Database",
    tags: ["SQL", "Performance", "Indexing"],
    pinned: false,
    updatedAt: "2026-09-30T14:10:00Z",
    content: `# B-Tree vs Hash Indexes

### B-Tree Indexes (Default in Postgres & MySQL InnoDB)
- Supports: \`=\`, \`<\`, \`<=\`, \`>\`, \`>=\`, \`BETWEEN\`, \`IN\`, \`LIKE 'prefix%'\`.
- Balanced search tree guarantees O(log N) depth.
- Order is preserved; useful for \`ORDER BY\` queries.

### Hash Indexes
- Fast point queries with O(1) equality lookup (\`=\`).
- CANNOT do range queries (\`<\`, \`>\`, \`BETWEEN\`).
- Cannot assist in sorting.`
  },
  {
    id: "note-5",
    title: "Python Decorators & Wrapper Architecture",
    category: "Python",
    tags: ["Python", "Advanced", "Metaprogramming"],
    pinned: false,
    updatedAt: "2026-09-29T18:00:00Z",
    content: `# Python Decorators

Decorators allow you to wrap another function to extend its behavior without permanently modifying it.

\`\`\`python
import time
from functools import wraps

def timeit(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timeit
def heavy_computation():
    return sum(i * i for i in range(1_000_000))
\`\`\``
  },
  {
    id: "note-6",
    title: "Modern CSS Glassmorphism & Token Guidelines",
    category: "Design",
    tags: ["CSS", "UI", "Glassmorphism"],
    pinned: false,
    updatedAt: "2026-09-25T12:00:00Z",
    content: `# Glassmorphism Tokens

For a premium EdTech hackathon aesthetic:
- **Card Background**: \`rgba(16, 21, 42, 0.75)\`
- **Backdrop Filter**: \`blur(16px)\`
- **Border**: \`1px solid rgba(255, 255, 255, 0.08)\`
- **Shadow**: \`0 10px 30px -5px rgba(0, 0, 0, 0.5)\`
- **Gradients**: Use subtle angle gradients (135deg) with low opacity color stops.`
  }
];
