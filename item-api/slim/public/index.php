<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/autoload.php';

use Prometheus\CollectorRegistry;
use Prometheus\RenderTextFormat;
use Prometheus\Storage\Redis;

$app = AppFactory::create();

$app->add(function (Request $request, RequestHandler $handler) {
    Redis::setDefaultOptions(['host' => $_SERVER['REDIS_HOST'] ?? '127.0.0.1']);
    $adapter = new Prometheus\Storage\Redis();
    $registry = new CollectorRegistry($adapter);

    $count = 1;

    $counter = $registry->registerCounter('test', 'some_counter', 'it increases', ['type']);
    $counter->incBy($count, ['blue']);
    return $handler->handle($request);
 });

 $app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("API here!");
    return $response;
});

$app->get('/api', function (Request $request, Response $response, $args) {
    $response->getBody()->write("API here!");
    return $response;
});

$app->get('/metrics', function (Request $request, Response $response, $args) {
        Redis::setDefaultOptions(['host' => $_SERVER['REDIS_HOST'] ?? '127.0.0.1']);
        $adapter = new Prometheus\Storage\Redis();
    
    $registry = new CollectorRegistry($adapter);
    $renderer = new RenderTextFormat();
    $result = $renderer->render($registry->getMetricFamilySamples());

    header('Content-type: ' . RenderTextFormat::MIME_TYPE);
    // echo $result;

    $response->getBody()->write($result);
    return $response;
});

$app->run();
