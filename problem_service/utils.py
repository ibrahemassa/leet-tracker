from pydantic import BaseModel
from collections import OrderedDict
import sqlite3

class Problem(BaseModel):
    id: int
    name: str
    difficulty: str
    platform: int
    url: str
    tags: list[dict[str, str | int]]

class Tag(BaseModel):
    id: int
    name: str


def get_db_connection():
    connection = sqlite3.connect("./problem_db.db")
    return connection

def init_db():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("CREATE TABLE IF NOT EXISTS tags(id INT PRIMARY KEY, name TEXT UNIQUE)")
    cursor.execute("CREATE TABLE IF NOT EXISTS problems (id INT PRIMARY KEY, name TEXT, difficulty TEXT, url TEXT UNIQUE, platform INT)")

    cursor.execute("CREATE TABLE IF NOT EXISTS problems_tags(problem_id INT, tag_id INT, PRIMARY KEY(problem_id, tag_id))")

    connection.commit()
    connection.close()


def insert_problem(problem: Problem):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("INSERT OR IGNORE INTO problems VALUES(?, ?, ?, ?, ?)", (problem.id, problem.name, problem.difficulty, problem.url, problem.platform))

    for tag in problem.tags:
        cursor.execute("INSERT OR IGNORE INTO tags VALUES(?, ?)", (tag['id'], tag['name']))
        cursor.execute("INSERT OR IGNORE INTO problems_tags VALUES(?, ?)", (problem.id, tag['id']))
    

    connection.commit()
    connection.close()


def fetch_problem_by_id(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM problems WHERE id=?", (id,))
    problem = cursor.fetchone()

    problem_id, name, difficulty, url, platform = problem

    cursor.execute("""
        SELECT tags.id, tags.name
        FROM tags
        JOIN problems_tags ON tags.id = problems_tags.tag_id
        WHERE problems_tags.problem_id = ?
    """, (problem_id,))

    tags_raw = cursor.fetchall()
    tags = [{"id":tag_id, "name": tag_name} for tag_id, tag_name in tags_raw]

    problem = Problem(id=problem_id, name=name, difficulty=difficulty, url=url, platform=platform, tags=tags)

    return OrderedDict([
        ("id", problem.id),
        ("name", problem.name),
        ("difficulty", problem.difficulty),
        ("platform", problem.platform),
        ("url", problem.url),
        ("tags", problem.tags)
    ]) 

def fetch_problems():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM problems")
    problems_raw = cursor.fetchall()
    problems = []
    for problem in problems_raw:
        problems.append(fetch_problem_by_id(problem[0]))

    connection.close()
    return problems

def update_problem(problem: Problem):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE problems
        SET name = ?, difficulty = ?, url = ?, platform = ?
        WHERE id = ?
    """, (problem.name, problem.difficulty, problem.url, problem.platform, problem.id))

    for tag in problem.tags:
        cursor.execute("INSERT OR IGNORE INTO tags(id, name) VALUES(?, ?)", (tag['id'], tag['name']))

    cursor.execute("DELETE FROM problems_tags WHERE problem_id = ?", (problem.id,))

    for tag in problem.tags:
        cursor.execute("INSERT OR IGNORE INTO problems_tags(problem_id, tag_id) VALUES(?, ?)", (problem.id, tag['id']))

    connection.commit()
    connection.close()

def delete_problem(id: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM problems_tags WHERE problem_id = ?", (id,))

    cursor.execute("DELETE FROM problems WHERE id = ?", (id, ))

    connection.commit()
    connection.close()
