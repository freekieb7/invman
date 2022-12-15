<?php declare(strict_types=1);

namespace App\Test;

use Monolog\Test\TestCase;
use App\Http\Message\Request;

class RequestTest extends TestCase
{
    /**
     * @test
     */
    public function extractJsonFromRequestBody(): void
    {
        // Given
        $serverRequest = $this
            ->getMockBuilder('Psr\Http\Message\ServerRequestInterface')
            ->onlyMethods(['withParsedBody'])
            ->getMockForAbstractClass();

        $serverRequest->expects($this->once())
            ->method('withParsedBody')
            ->with($this->equalTo('{"name": "John"}'));

        $subject = new Request($serverRequest);

        // Action
        $body = $subject->getBodyAsArray();

        // Assert
        $this->assertEquals($body, ["name" => "John"]);
    }
}