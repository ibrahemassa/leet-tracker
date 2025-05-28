import requests
from utils import Problem, insert_problem
import sqlite3


def get_tag_id_by_name(name, cursor):
    cursor.execute("SELECT id FROM tags WHERE name = ?", (name,))
    row = cursor.fetchone()
    return str(row[0]) if row else None



con = sqlite3.connect("./problem_db.db")
cursor = con.cursor()

number_of_problems = 200
URL = f"https://alfa-leetcode-api.onrender.com/problems?limit={number_of_problems}"


response = requests.get(URL)
if response.status_code == 200:
    problems = response.json().get("problemsetQuestionList", [])

    for problem in problems:
        tags = []
        for tag in problem['topicTags']:
            name = tag['name']
            id = get_tag_id_by_name(name, cursor)
            if id:
                tags.append({
                    "id": id,
                    "name": name
                })

        problem = Problem(
            id=problem["questionFrontendId"],
            name=problem["title"],
            difficulty=problem["difficulty"],
            url=f"https://leetcode.com/problems/{problem['titleSlug']}",
            tags=tags,
            platform=1
        )
        insert_problem(problem)


else:
    print(f"Error: {response.status_code}")



