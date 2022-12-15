<?php declare(strict_types=1);

namespace src\Http\Message;

use Psr\Http\Message\ServerRequestInterface as ServerRequest;

class Request {
    private $serverRequest;

    public function __construct(ServerRequest $serverRequest)
    {
        $this->serverRequest = $serverRequest;
    }

    public function getBodyAsArray(): array
    {
        return ['name' => 'John'];
    }
}