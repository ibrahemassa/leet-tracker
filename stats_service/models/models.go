package models

type UserStats struct {
	UserID          int            `json:"user_id"`
	TotalSolved     int            `json:"total_solved"`
	DifficultyStats map[string]int `json:"difficulty_stats"`
	TagsStat        map[int]int    `json:"tags_stat"`
}

type Submission struct {
	Difficulty string `json:"difficulty"`
	Tags       []int  `json:"tags"`
}
