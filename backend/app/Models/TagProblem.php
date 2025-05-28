<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TagProblem extends Model
{
    protected $fillable = [
        "tag_id",
        "problem_id",
    ];
}
