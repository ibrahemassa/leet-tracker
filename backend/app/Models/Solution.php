<?php

namespace App\Models;

use App\Enums\Status;
use Illuminate\Database\Eloquent\Model;
Use App\Models\User;
Use App\Models\Problem;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Solution extends Model
{
    protected $fillable = [
        "user_id",
        "problem_id",
        "status",
        "language",
        "code",
        "sol_url",
    ];

    protected $casts = [
        "status" => Status::class,
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function problem() : BelongsTo{
        return $this->belongsTo(Problem::class);
    }
}
