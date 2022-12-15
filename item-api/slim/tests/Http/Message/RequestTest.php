<?php declare(strict_types=1);

namespace Http\Message;

use App\Http\Message\Request;
use Monolog\Test\TestCase;

class RequestTest extends TestCase
{
    /**
     * @test
     */
    public function extractJsonFromRequestBody(): void
    {
        // Given
        $serverRequest = $this->createStub('Psr\Http\Message\ServerRequestInterface');

        $serverRequest->method('getParsedBody')
            ->willReturn(["name" => "John"]);

        $subject = new Request($serverRequest);

        // Action
        $body = $subject->getBodyAsArray();

        // Assert
        $this->assertEquals($body, ["name" => "John"]);
    }
}