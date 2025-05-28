#!/usr/bin/bash

SESSION_NAME="Servers"

if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "Session $SESSION_NAME already exists. Attaching..."
    tmux attach-session -t "$SESSION_NAME"
    exit 0
fi

tmux new-session -d -s "$SESSION_NAME" -n 'laravel'
tmux send-keys -t "$SESSION_NAME".1 "cd ./backend && php artisan serv" Enter


tmux new-window -t "$SESSION_NAME" -n 'problem-service'
tmux send-keys -t "$SESSION_NAME".1 "cd ./problem_service && source ./env/bin/activate && python app.py" Enter

tmux new-window -t "$SESSION_NAME" -n 'stats-service' 
tmux send-keys -t "$SESSION_NAME".1 "cd ./stats_service && go run main.go" Enter

tmux new-window -t "$SESSION_NAME" -n 'react' 
tmux send-keys -t "$SESSION_NAME".1 'cd ./frontend/leet-tracker && npm run dev' Enter

tmux select-window -t "$SESSION_NAME":1

tmux attach-session -t "$SESSION_NAME"



#
# #!/usr/bin/bash
#
# SESSION_NAME="Servers"
#
# # Check if session already exists
# if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
#     echo "Session $SESSION_NAME already exists. Attaching..."
#     tmux attach-session -t "$SESSION_NAME"
#     exit 0
# fi
#
# # Create a new session in detached mode with an initial window
# tmux new-session -d -s "$SESSION_NAME" -n 'laravel'
#
# # Split the window into 4 panes (2x2 grid)
# tmux split-window -v  # Split vertically (2 panes)
# tmux split-window -h  # Split top pane horizontally
# tmux select-pane -t 0  # Focus back on the original top-left pane
# tmux split-window -h  # Split bottom pane horizontally
#
# # Send commands to each pane
# # First pane (top-left) - Laravel
# tmux send-keys -t "$SESSION_NAME".0 "cd ./backend && php artisan serve" Enter
#
# # Second pane (top-right) - Problem service
# tmux select-pane -t 1
# tmux send-keys -t "$SESSION_NAME".1 "cd ./problem_service && source ./env/bin/activate && python app.py" Enter
#
# # Third pane (bottom-left) - Stats service
# tmux select-pane -t 2
# tmux send-keys -t "$SESSION_NAME".2 "cd ./stats_service && go run main.go" Enter
#
# # Fourth pane (bottom-right) - React app
# tmux select-pane -t 3
# tmux send-keys -t "$SESSION_NAME".3 'cd ./frontend/leet-tracker && npm run dev' Enter
#
# # Attach to the session
# tmux attach-session -t "$SESSION_NAME"
#
