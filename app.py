from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Initialize the game board
board = [["" for _ in range(3)] for _ in range(3)]
current_player = "X"

def check_winner():
    # Check rows, columns, and diagonals for a winner
    for row in board:
        if row[0] == row[1] == row[2] != "":
            return row[0]
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] != "":
            return board[0][col]
    if board[0][0] == board[1][1] == board[2][2] != "":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != "":
        return board[0][2]
    return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/move', methods=['POST'])
def move():
    global current_player
    data = request.get_json()
    row, col = int(data['row']), int(data['col'])  # Ensure row and col are integers
    if board[row][col] == "":
        board[row][col] = current_player
        winner = check_winner()
        if winner:
            return jsonify({"winner": winner})
        current_player = "O" if current_player == "X" else "X"
        return jsonify({"board": board, "current_player": current_player})
    return jsonify({"error": "Cell already taken"}), 400

@app.route('/reset', methods=['GET'])
def reset():
    global board, current_player
    board = [["" for _ in range(3)] for _ in range(3)]
    current_player = "X"
    return jsonify({"status": "reset"})

if __name__ == '__main__':
    app.run(debug=True)
