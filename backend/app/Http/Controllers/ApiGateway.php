<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ApiGateway extends Controller
{
    private $problem_service_url = "http://127.0.0.1:8001";
    private $stats_service_url = "http://127.0.0.1:8002";

    public function problem_service(Request $request, $subPath)
    {
        $url = $this->problem_service_url . $subPath;
        $request_data = $request->all();

        if ($request->method() == "POST") {
            $request_data['difficulty'] = $request_data['difficulty']->value;
            $request_data['tags'] = $request_data['tags']->toArray();
        }

        $response = Http::send($request->method(), $url, ["json" => $request_data]);
        return response()->json([$response->body(), $response->status()]);
    }

    public function stat_service(Request $request, $subPath)
    {
        $url = $this->stats_service_url . $subPath;
        $request_data = $request->all();

        if ($request->method() == "POST") {
            if (!is_array($request_data['tags'])) {
                $request_data['tags'] = $request_data['tags']->toArray();
            }
        }

        $response = Http::send($request->method(), $url, ["json" => $request_data]);

        return response()->json([$response->body(), $response->status()]);
    }
}
