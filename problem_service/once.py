import sqlite3
connection = sqlite3.connect("./problem_db.db")
cursor = connection.cursor()

command1 = '''INSERT OR IGNORE INTO tags (id, name) VALUES
(3, 'Array'),
(4, 'String'),
(5, 'Hash Table'),
(6, 'Dynamic Programming'),
(7, 'Stack'),
(8, 'Queue'),
(9, 'Linked List'),
(10, 'Binary Search'),
(11, 'Tree'),
(12, 'Graph'),
(13, 'Heap (Priority Queue)'),
(14, 'Backtracking'),
(15, 'Breadth-First Search'),
(16, 'Depth-First Search'),
(17, 'Greedy');
'''

cursor.execute(command1)
connection.commit()
connection.close()
