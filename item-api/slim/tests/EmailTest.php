<?php

declare(strict_types=1);

namespace App;

use PHPUnit\Framework\TestCase;

/**
 * @covers DefaultClass \ClientTest
 */
class ClientTest extends TestCase
{
    /**
     * @covers ::publicMethod
     */
    public function testMyTest(): void
    {
        $this->assertTrue(true);
    }
}
