<?php
namespace App\Enums;

use App\Enums\Traits\FromInsensitive;

enum Status: string{
    use FromInsensitive;
    case Solved = "solved";
    case Attempted = "attempted";
    case Unsolved = "unsolved";
}
