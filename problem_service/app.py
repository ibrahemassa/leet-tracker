from utils import Problem, delete_problem, fetch_problems, fetch_problem_by_id, init_db, insert_problem, update_problem, delete_problem
from flask import Flask, request, jsonify, Response
import json

app = Flask(__name__)

@app.route("/problems", methods=["POST"])
def add_problem():
    try:
        data = request.get_json()
        problem = Problem(**data)
        insert_problem(problem)
        return jsonify({"message": "Problem added successfully."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/problems", methods=["GET"])
def get_problems():
    try:
        problems = fetch_problems()
        return Response(json.dumps(problems), mimetype='application/json')
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/problems/<int:id>", methods=["GET"])
def get_problem(id):
    try:
        problem = fetch_problem_by_id(id)
        if not problem:
            return jsonify({"error": "Not found"}), 404
        return Response(json.dumps(problem), mimetype='application/json')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/problems", methods=["PUT"])
def update_problem_handler():    
    print(f"Received {request.method} request to {request.path}")
    print(f"Request data: {request.get_json()}")
    try:
        data = request.get_json()
        problem = Problem(**data)
        update_problem(problem)
        return jsonify({"message": "Problem updated successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/problems/<int:id>", methods=["DELETE"])
def delete_problem_handler(id):
    try:
        delete_problem(id)
        return jsonify({"message": "Problem deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=8001)

