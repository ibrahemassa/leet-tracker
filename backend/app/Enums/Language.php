<?php
namespace App\Enums;

use App\Enums\Traits\FromInsensitive;

enum Language: string{
    use FromInsensitive;
    case Python = "Python";
    case c = "C";
    case cpp = "C++";
    case cs = "C#";
    case js = "JavaScript";
    case ts = "TypeScript";
    case java = "Java";
    case rust = "Rust";
    case go = "Go";
    case dart = "Dart";
    case swift = "Swift";
}


