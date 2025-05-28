<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Models\Problem;

class Platform extends Model
{
    protected $fillable = [
        "name",
        "url",
    ];

    public function problems(): HasMany{
        return $this->hasMany(Problem::class);
    }
}
