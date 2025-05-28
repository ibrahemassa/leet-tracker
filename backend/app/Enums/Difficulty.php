<?php

namespace App\Enums;

use App\Enums\Traits\FromInsensitive;

enum Difficulty: string {
    use FromInsensitive;
    case Easy = "easy";
    case Medium = "medium";
    case Hard = "hard";

    public static function fromInsensitive(string $value): self
    {
        foreach (self::cases() as $case) {
            if (strtolower($case->value) === strtolower($value)) {
                return $case;
            }
        }

        throw new \ValueError("Invalid difficulty value: $value");
    }
}

