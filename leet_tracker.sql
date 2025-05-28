-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 27, 2025 at 12:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `leet_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2025_05_04_170353_create_users_table', 1),
(4, '2025_05_04_170354_create_tags_table', 1),
(5, '2025_05_04_170355_create_platforms_table', 1),
(6, '2025_05_04_170427_create_problems_table', 1),
(7, '2025_05_04_170447_create_tag_problems_table', 1),
(8, '2025_05_04_170455_create_solutions_table', 2),
(9, '2025_05_04_183344_create_personal_access_tokens_table', 2),
(10, '2025_05_10_131534_create_sessions_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'IbrahimFaress', 'b53b60a41cd23da2a8f2e750076c10a16dac38f0b679d389b34aac7e2e999029', '[\"*\"]', NULL, NULL, '2025-05-26 16:49:36', '2025-05-26 16:49:36'),
(2, 'App\\Models\\User', 1, 'IbrahimFaress', '8396f58d193c3f9aa323583beaba1679a45b768a94035f65457678cb0dbd7a4f', '[\"*\"]', NULL, NULL, '2025-05-26 16:54:12', '2025-05-26 16:54:12');

-- --------------------------------------------------------

--
-- Table structure for table `platforms`
--

CREATE TABLE `platforms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `platforms`
--

INSERT INTO `platforms` (`id`, `name`, `url`, `created_at`, `updated_at`) VALUES
(1, 'LeetCode', 'https://leetcode.com/', '2025-05-26 16:51:54', '2025-05-26 16:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL,
  `platform_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `problems`
--

INSERT INTO `problems` (`id`, `name`, `url`, `difficulty`, `platform_id`, `created_at`, `updated_at`) VALUES
(2, 'Add Two Numbers', 'https://leetcode.com/problems/add-two-numbers', 'medium', 1, '2025-05-26 17:00:57', '2025-05-26 17:00:57'),
(5, 'Longest Palindromic Substring', 'https://leetcode.com/problems/longest-palindromic-substring', 'medium', 1, '2025-05-26 17:07:32', '2025-05-26 17:07:32'),
(8, 'String to Integer (atoi)', 'https://leetcode.com/problems/string-to-integer-atoi', 'medium', 1, '2025-05-26 17:01:39', '2025-05-26 17:01:39'),
(9, 'Palindrome Number', 'https://leetcode.com/problems/palindrome-number', 'easy', 1, '2025-05-26 19:00:26', '2025-05-26 19:00:26'),
(21, 'Merge Two Sorted Lists', 'https://leetcode.com/problems/merge-two-sorted-lists', 'easy', 1, '2025-05-26 17:08:17', '2025-05-26 17:08:17'),
(22, 'Generate Parentheses', 'https://leetcode.com/problems/generate-parentheses', 'medium', 1, '2025-05-26 17:11:43', '2025-05-26 17:11:43'),
(23, 'Merge k Sorted Lists', 'https://leetcode.com/problems/merge-k-sorted-lists', 'hard', 1, '2025-05-26 17:08:56', '2025-05-26 17:08:56'),
(36, 'Valid Sudoku', 'https://leetcode.com/problems/valid-sudoku', 'medium', 1, '2025-05-26 18:59:15', '2025-05-26 18:59:15'),
(41, 'First Missing Positive', 'https://leetcode.com/problems/first-missing-positive', 'hard', 1, '2025-05-26 17:29:02', '2025-05-26 17:29:02'),
(4001, 'Reverse Linked List', 'https://leetcode.com/problems/reverse-linked-list', 'easy', 1, '2025-05-26 17:10:12', '2025-05-26 17:10:12');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `solutions`
--

CREATE TABLE `solutions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `problem_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('solved','attempted','unsolved') NOT NULL DEFAULT 'unsolved',
  `language` enum('Python','C','C++','C#','JavaScript','TypeScript','Java','Rust','Go','Dart','Swift') DEFAULT NULL,
  `code` text DEFAULT NULL,
  `sol_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `solutions`
--

INSERT INTO `solutions` (`id`, `user_id`, `problem_id`, `status`, `language`, `code`, `sol_url`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'solved', 'Python', 'class Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        d = ListNode()\n        cur = d\n        c = 0\n        while l1 or l2 or c:\n            val1 = l1.val if l1 else 0\n            val2 = l2.val if l2 else 0\n            temp = val1 + val2 + c\n            if temp >= 10:\n                temp -= 10\n                c = 1\n            else:\n                c = 0\n            cur.next = ListNode(temp)\n            l1 = l1.next if l1 else None\n            l2 = l2.next if l2 else None\n            cur = cur.next\n        return d.next', 'https://leetcode.com/problems/add-two-numbers/submissions/1094927126', '2025-05-26 17:00:57', '2025-05-26 17:05:42'),
(3, 1, 5, 'solved', 'Python', 'class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        def pali(word):\n            return word == word[::-1]\n        max_l = 0\n        longest = \'\'\n        for i in range(len(s)):\n            for j in range(i + max_l, len(s)):\n                if pali(s[i:j + 1]):\n                    if j - i + 1 > max_l:\n                        max_l = j - i + 1\n                        longest = s[i:j + 1]\n        return longest', 'https://leetcode.com/problems/longest-palindromic-substring/submissions/1093374708', '2025-05-26 17:07:32', '2025-05-26 17:07:32'),
(4, 1, 21, 'solved', 'Python', 'class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        current = ListNode()\n        head = current\n        \n        while list1 and list2:\n            if list1.val < list2.val:\n                current.next = list1\n                current = list1\n                list1 = list1.next\n            else:\n                current.next = list2\n                current = list2\n                list2 = list2.next\n        if list1 or list2:\n            current.next = list1 if list1 else list2\n\n        return head.next', 'https://leetcode.com/problems/merge-two-sorted-lists/submissions/1048521129', '2025-05-26 17:08:17', '2025-05-26 17:08:17'),
(5, 1, 23, 'solved', 'Python', 'class Heap:\n    def __init__(self):\n        self.heap = [0]\n        self.size = 0\n\n    def float_node(self, n):\n        while n // 2 > 0:\n            if self.heap[n] < self.heap[n // 2]:\n                self.heap[n], self.heap[n // 2] = self.heap[n // 2], self.heap[n]\n            n //= 2\n\n    def insert(self, data):\n        self.heap.append(data)\n        self.size += 1\n        self.float_node(self.size)\n\n    def min_index(self, n):\n        if n * 2 + 1 > self.size:\n            return n * 2\n        elif self.heap[n*2+1] > self.heap[n*2]:\n            return n * 2\n        else:\n            return n * 2 + 1\n\n    def sink(self, n):\n        while n*2 <= self.size:\n            mindex = self.min_index(n)\n            if self.heap[mindex] < self.heap[n]:\n                self.heap[n], self.heap[mindex] = self.heap[mindex], self.heap[n]\n            n = mindex\n\n    def pop(self):\n        data = self.heap[1]\n        self.heap[1] = self.heap[self.size]\n        self.size -= 1\n        self.heap.pop()\n        self.sink(1)\n        return data\n\n    def heap_sort(self):\n        sorted = []\n        for i in range(self.size):\n            sorted.append(self.pop())\n        return sorted\n\nclass Solution:\n    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:\n        h = Heap()\n        for head in lists:\n            cur = head\n            while cur:\n                h.insert(cur.val)\n                cur = cur.next\n        sorted_values = h.heap_sort()\n        \n        dummy = ListNode(0)\n        current = dummy\n        for val in sorted_values:\n            current.next = ListNode(val)\n            current = current.next\n        \n        return dummy.next', 'https://leetcode.com/problems/merge-k-sorted-lists/submissions/1135291580', '2025-05-26 17:08:56', '2025-05-26 17:08:56'),
(6, 1, 4001, 'solved', 'Rust', 'impl Solution {\n    pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {\n        let mut prev = None;\n        let mut cur = head;\n        while let Some(mut i) = cur{\n            cur = i.next;\n            i.next = prev;\n            prev = Some(i);\n        }\n        prev\n    }\n}', 'https://leetcode.com/problems/reverse-linked-list/submissions/1527792173', '2025-05-26 17:10:48', '2025-05-26 17:10:48'),
(7, 1, 22, 'solved', 'Python', 'class Solution:\n    def generateParenthesis(self, n: int) -> List[str]:\n        stack = []\n        ans = []\n\n        def gen(opened, close):\n            if opened == close == n:\n                ans.append(\"\".join(stack))\n                return\n            if opened < n:\n                stack.append(\'(\')\n                gen(opened+1, close)\n                stack.pop()\n            if close < opened:\n                stack.append(\")\")\n                gen(opened, close+1)\n                stack.pop()\n\n        gen(0, 0)\n        return ans', 'https://leetcode.com/problems/generate-parentheses/submissions/1081835267', '2025-05-26 17:11:43', '2025-05-26 17:11:43'),
(8, 1, 41, 'solved', 'Python', 'class Solution:\n    def firstMissingPositive(self, nums: List[int]) -> int:\n        n = len(nums)\n        for i in range(n):\n            if nums[i] <= 0:\n                nums[i] = 0\n        for i in range(n):\n            while 0 < nums[i] < n + 1 and nums[nums[i] - 1] != nums[i]:\n                nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]\n        cur = 1\n        print(nums)\n        for i in range(n):\n            if nums[i] <= 0:\n                continue\n            if nums[i] != cur:\n                return cur\n            cur += 1\n        return max(nums) + 1', 'https://leetcode.com/problems/first-missing-positive/submissions/1213949080', '2025-05-26 17:29:02', '2025-05-26 17:29:02'),
(9, 1, 36, 'solved', 'Go', 'func isValidSudoku(board [][]byte) bool {\n    rows := make([]map[byte]bool, 9)\n    cols := make([]map[byte]bool, 9)\n    boxes := make([]map[byte]bool, 9)\n\n    for i := 0; i < 9; i++ {\n        rows[i] = make(map[byte]bool)\n        cols[i] = make(map[byte]bool)\n        boxes[i] = make(map[byte]bool)\n    }\n\n    for r := 0; r < 9; r++ {\n        for c := 0; c < 9; c++ {\n            val := board[r][c]\n            if val == \'.\' {\n                continue\n            }\n\n            if rows[r][val] {\n                return false\n            }\n            rows[r][val] = true\n\n            if cols[c][val] {\n                return false\n            }\n            cols[c][val] = true\n\n            boxIndex := (r/3)*3 + c/3\n            if boxes[boxIndex][val] {\n                return false\n            }\n            boxes[boxIndex][val] = true\n        }\n    }\n\n    return true\n}', 'https://leetcode.com/problems/valid-sudoku/submissions/1645414451', '2025-05-26 18:59:15', '2025-05-26 18:59:15'),
(10, 1, 9, 'solved', 'C++', 'class Solution {\npublic:\n    bool isPalindrome(int x) {\n        string num = to_string(x);\n        string temp = num;\n        reverse(num.begin(),num.end());\n        if(num == temp)\n            return 1;\n        else\n            return 0;\n    }\n};', 'https://leetcode.com/problems/palindrome-number/submissions/988490477', '2025-05-26 19:00:26', '2025-05-26 19:00:26');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Array', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(2, 'String', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(3, 'Hash Table', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(4, 'Dynamic Programming', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(5, 'Stack', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(6, 'Queue', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(7, 'Linked List', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(8, 'Binary Search', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(9, 'Tree', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(10, 'Graph', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(11, 'Heap (Priority Queue)', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(12, 'Backtracking', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(13, 'Breadth-First Search', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(14, 'Depth-First Search', '2025-05-26 16:50:46', '2025-05-26 16:50:46'),
(15, 'Greedy', '2025-05-26 16:50:46', '2025-05-26 16:50:46');

-- --------------------------------------------------------

--
-- Table structure for table `tag_problems`
--

CREATE TABLE `tag_problems` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL,
  `problem_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tag_problems`
--

INSERT INTO `tag_problems` (`id`, `tag_id`, `problem_id`, `created_at`, `updated_at`) VALUES
(1, 9, 2, NULL, NULL),
(2, 4, 8, NULL, NULL),
(3, 4, 5, NULL, NULL),
(4, 6, 5, NULL, NULL),
(5, 9, 21, NULL, NULL),
(6, 9, 23, NULL, NULL),
(7, 13, 23, NULL, NULL),
(8, 7, 4001, NULL, NULL),
(9, 4, 22, NULL, NULL),
(10, 6, 22, NULL, NULL),
(11, 14, 22, NULL, NULL),
(12, 3, 41, NULL, NULL),
(13, 5, 41, NULL, NULL),
(14, 3, 36, NULL, NULL),
(15, 5, 36, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'IbrahimFaress', 'ibrahem@ibrahem.com', '$2y$12$wHYz6zJ9aTzpuQaR1WHTyOLInboXwdslqIDniwEn/Vp/B8xwzoDZa', '2025-05-26 16:49:36', '2025-05-26 16:49:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `platforms`
--
ALTER TABLE `platforms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `problems_url_unique` (`url`),
  ADD KEY `problems_platform_id_foreign` (`platform_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `solutions`
--
ALTER TABLE `solutions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `solutions_user_id_foreign` (`user_id`),
  ADD KEY `solutions_problem_id_foreign` (`problem_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tag_problems`
--
ALTER TABLE `tag_problems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tag_problems_tag_id_foreign` (`tag_id`),
  ADD KEY `tag_problems_problem_id_foreign` (`problem_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `platforms`
--
ALTER TABLE `platforms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `solutions`
--
ALTER TABLE `solutions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tag_problems`
--
ALTER TABLE `tag_problems`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `problems_platform_id_foreign` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `solutions`
--
ALTER TABLE `solutions`
  ADD CONSTRAINT `solutions_problem_id_foreign` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `solutions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tag_problems`
--
ALTER TABLE `tag_problems`
  ADD CONSTRAINT `tag_problems_problem_id_foreign` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tag_problems_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
