const db = require('../config/db');

const problems = [
  { title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', platform: 'LeetCode', tags: ['Array', 'Hash Table'] },
  { title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', platform: 'LeetCode', tags: ['Array', 'Dynamic Programming'] },
  { title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', platform: 'LeetCode', tags: ['Array', 'Hash Table'] },
  { title: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Prefix Sum'] },
  { title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'] },
  { title: 'Maximum Product Subarray', slug: 'maximum-product-subarray', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Dynamic Programming'] },
  { title: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Binary Search'] },
  { title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Binary Search'] },
  { title: '3Sum', slug: '3sum', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Two Pointers', 'Sorting'] },
  { title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Two Pointers', 'Greedy'] },
  { title: 'Sum of Two Integers', slug: 'sum-of-two-integers', difficulty: 'Medium', platform: 'LeetCode', tags: ['Math', 'Bit Manipulation'] },
  { title: 'Number of 1 Bits', slug: 'number-of-1-bits', difficulty: 'Easy', platform: 'LeetCode', tags: ['Divide and Conquer', 'Bit Manipulation'] },
  { title: 'Counting Bits', slug: 'counting-bits', difficulty: 'Easy', platform: 'LeetCode', tags: ['Dynamic Programming', 'Bit Manipulation'] },
  { title: 'Missing Number', slug: 'missing-number', difficulty: 'Easy', platform: 'LeetCode', tags: ['Array', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation', 'Sorting'] },
  { title: 'Reverse Bits', slug: 'reverse-bits', difficulty: 'Easy', platform: 'LeetCode', tags: ['Divide and Conquer', 'Bit Manipulation'] },
  { title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', platform: 'LeetCode', tags: ['Math', 'Dynamic Programming', 'Memoization'] },
  { title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'] },
  { title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Binary Search', 'Dynamic Programming'] },
  { title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium', platform: 'LeetCode', tags: ['String', 'Dynamic Programming'] },
  { title: 'Word Break', slug: 'word-break', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'] },
  { title: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Backtracking'] },
  { title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Dynamic Programming'] },
  { title: 'House Robber II', slug: 'house-robber-ii', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Dynamic Programming'] },
  { title: 'Decode Ways', slug: 'decode-ways', difficulty: 'Medium', platform: 'LeetCode', tags: ['String', 'Dynamic Programming'] },
  { title: 'Unique Paths', slug: 'unique-paths', difficulty: 'Medium', platform: 'LeetCode', tags: ['Math', 'Dynamic Programming', 'Combinatorics'] },
  { title: 'Jump Game', slug: 'jump-game', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Dynamic Programming', 'Greedy'] },
  { title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium', platform: 'LeetCode', tags: ['Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Graph'] },
  { title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', platform: 'LeetCode', tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'] },
  { title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'] },
  { title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'] },
  { title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Hash Table', 'Union Find'] },
  { title: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'Hard', platform: 'LeetCode', tags: ['Array', 'String', 'Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'] },
  { title: 'Graph Valid Tree', slug: 'graph-valid-tree', difficulty: 'Medium', platform: 'LeetCode', tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'] },
  { title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'Medium', platform: 'LeetCode', tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'] },
  { title: 'Insert Interval', slug: 'insert-interval', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array'] },
  { title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Sorting'] },
  { title: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'] },
  { title: 'Meeting Rooms', slug: 'meeting-rooms', difficulty: 'Easy', platform: 'LeetCode', tags: ['Array', 'Sorting'] },
  { title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Two Pointers', 'Greedy', 'Sorting', 'Heap (Priority Queue)'] },
  { title: 'Reverse a Linked List', slug: 'reverse-linked-list', difficulty: 'Easy', platform: 'LeetCode', tags: ['Linked List', 'Recursion'] },
  { title: 'Detect Cycle in a Linked List', slug: 'linked-list-cycle', difficulty: 'Easy', platform: 'LeetCode', tags: ['Hash Table', 'Linked List', 'Two Pointers'] },
  { title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', platform: 'LeetCode', tags: ['Linked List', 'Recursion'] },
  { title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'Hard', platform: 'LeetCode', tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'] },
  { title: 'Remove Nth Node From End Of List', slug: 'remove-nth-node-from-end-of-list', difficulty: 'Medium', platform: 'LeetCode', tags: ['Linked List', 'Two Pointers'] },
  { title: 'Reorder List', slug: 'reorder-list', difficulty: 'Medium', platform: 'LeetCode', tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'] },
  { title: 'Set Matrix Zeroes', slug: 'set-matrix-zeroes', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Hash Table', 'Matrix'] },
  { title: 'Spiral Matrix', slug: 'spiral-matrix', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Matrix', 'Simulation'] },
  { title: 'Rotate Image', slug: 'rotate-image', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Math', 'Matrix'] },
  { title: 'Word Search', slug: 'word-search', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Backtracking', 'Matrix'] },
  { title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', platform: 'LeetCode', tags: ['Hash Table', 'String', 'Sliding Window'] },
  { title: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', difficulty: 'Medium', platform: 'LeetCode', tags: ['Hash Table', 'String', 'Sliding Window'] },
  { title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard', platform: 'LeetCode', tags: ['Hash Table', 'String', 'Sliding Window'] },
  { title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy', platform: 'LeetCode', tags: ['Hash Table', 'String', 'Sorting'] },
  { title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Hash Table', 'String', 'Sorting'] },
  { title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', platform: 'LeetCode', tags: ['String', 'Stack'] },
  { title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', platform: 'LeetCode', tags: ['Two Pointers', 'String'] },
  { title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'Medium', platform: 'LeetCode', tags: ['String', 'Dynamic Programming'] },
  { title: 'Palindromic Substrings', slug: 'palindromic-substrings', difficulty: 'Medium', platform: 'LeetCode', tags: ['String', 'Dynamic Programming'] },
  { title: 'Encode and Decode Strings', slug: 'encode-and-decode-strings', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'String', 'Design'] },
  { title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy', platform: 'LeetCode', tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'] },
  { title: 'Same Tree', slug: 'same-tree', difficulty: 'Easy', platform: 'LeetCode', tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'] },
  { title: 'Invert/Flip Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', platform: 'LeetCode', tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'] },
  { title: 'Binary Tree Maximum Path Sum', slug: 'binary-tree-maximum-path-sum', difficulty: 'Hard', platform: 'LeetCode', tags: ['Dynamic Programming', 'Tree', 'Depth-First Search', 'Binary Tree'] },
  { title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium', platform: 'LeetCode', tags: ['Tree', 'Breadth-First Search', 'Binary Tree'] },
  { title: 'Serialize and Deserialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', difficulty: 'Hard', platform: 'LeetCode', tags: ['String', 'Tree', 'Depth-First Search', 'Breadth-First Search', 'Design', 'Binary Tree'] },
  { title: 'Subtree of Another Tree', slug: 'subtree-of-another-tree', difficulty: 'Easy', platform: 'LeetCode', tags: ['Tree', 'Depth-First Search', 'String Matching', 'Binary Tree', 'Hash Function'] },
  { title: 'Construct Binary Tree from Preorder and Inorder Traversal', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Hash Table', 'Tree', 'Binary Tree', 'Divide and Conquer'] },
  { title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'Medium', platform: 'LeetCode', tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'] },
  { title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'Medium', platform: 'LeetCode', tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'] },
  { title: 'Lowest Common Ancestor of BST', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'Medium', platform: 'LeetCode', tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'] },
  { title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree', difficulty: 'Medium', platform: 'LeetCode', tags: ['Hash Table', 'String', 'Design', 'Trie'] },
  { title: 'Add and Search Word', slug: 'design-add-and-search-words-data-structure', difficulty: 'Medium', platform: 'LeetCode', tags: ['String', 'Depth-First Search', 'Design', 'Trie'] },
  { title: 'Word Search II', slug: 'word-search-ii', difficulty: 'Hard', platform: 'LeetCode', tags: ['Array', 'String', 'Backtracking', 'Trie', 'Matrix'] },
  { title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists-2', difficulty: 'Hard', platform: 'LeetCode', tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'] },
  { title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium', platform: 'LeetCode', tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Bucket Sort', 'Counting', 'Quickselect'] },
  { title: 'Find Median from Data Stream', slug: 'find-median-from-data-stream', difficulty: 'Hard', platform: 'LeetCode', tags: ['Two Pointers', 'Design', 'Sorting', 'Heap (Priority Queue)', 'Data Stream'] }
];

async function seed() {
  try {
    console.log('Seeding problems...');
    
    // Clear existing problems to prevent duplicates on rerun
    await db.query('TRUNCATE TABLE problems CASCADE;');
    
    let count = 0;
    for (const p of problems) {
      const query = `
        INSERT INTO problems (title, slug, difficulty, platform, tags)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO NOTHING;
      `;
      const values = [p.title, p.slug, p.difficulty, p.platform, p.tags];
      const res = await db.query(query, values);
      if (res.rowCount > 0) count++;
    }

    console.log(`Successfully seeded ${count} problems.`);
  } catch (err) {
    console.error('Failed to seed problems:', err);
  } finally {
    process.exit();
  }
}

seed();
