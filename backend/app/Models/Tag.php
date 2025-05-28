<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use App\Models\Problem;

class Tag extends Model
{

    protected $fillable = [
        "id",
        "name",
    ];


    public function problems(): BelongsToMany{
        return $this->belongsToMany(Problem::class, "tag_problems");
    }
}
