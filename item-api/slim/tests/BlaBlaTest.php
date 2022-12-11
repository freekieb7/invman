<?php

declare(strict_types=1);

namespace App;

use PHPUnit\Framework\TestCase;

/**
 * @covers DefaultClass \ClientTest2
 */
class ClientTest2 extends TestCase
{
    /**
     * @covers ::publicMethod
     */
    public function testMyTest2(): void
    {
        $this->assertTrue(false);
    }
}
