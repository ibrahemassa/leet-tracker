<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\Tag;
use App\Models\Platform;
use App\Models\User;

use App\Enums\Difficulty;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Problem extends Model
{
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        "id",
        "name",
        "url",
        "difficulty",
        "platform_id",
    ];

    protected $casts = [
        "difficulty" => Difficulty::class,
    ];

    public function tags(): BelongsToMany{
        return $this->belongsToMany(Tag::class, "tag_problems")->select("name");
    }

    public function users(): BelongsToMany{
        return $this->belongsToMany(User::class);
    }

    public function platform(): BelongsTo{
        return $this->belongsTo(Platform::class);
    }

    public function solutions(): HasMany
    {
        return $this->hasMany(Solution::class);
    }
}
