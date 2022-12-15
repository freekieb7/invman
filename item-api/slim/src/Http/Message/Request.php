<?php declare(strict_types=1);

namespace App\Http\Message;

use Psr\Http\Message\ServerRequestInterface as ServerRequest;

class Request {
    private $serverRequest;

    public function __construct(ServerRequest $serverRequest)
    {
        $this->serverRequest = $serverRequest;
    }

    public function getBodyAsArray(): array
    {
        return $this->serverRequest->getParsedBody();
    }
}