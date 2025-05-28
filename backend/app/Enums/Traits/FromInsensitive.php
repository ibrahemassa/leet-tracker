<?php

namespace App\Enums\Traits;

trait FromInsensitive
{
    public static function fromInsensitive(string $value): self
    {
        foreach (self::cases() as $case) {
            if (strtolower($case->value) === strtolower($value)) {
                return $case;
            }
        }

        throw new \ValueError("Invalid value for enum " . static::class . ": $value");
    }
}

