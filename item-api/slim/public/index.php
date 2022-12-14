<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

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
    $test = "test";
    $response->getBody()->write("API here!");
    return $response;
});
//
//$app->get('/db', function (Request $request, Response $response, $args) {
//    $host = $_SERVER['DATABASE_HOST'];
//    $name = $_SERVER['DATABASE_NAME'];
//    $user = $_SERVER['DATABASE_USER'];
//    $password = $_SERVER['DATABASE_PASSWORD'];
//
//    $dbconn = pg_connect("host=$host dbname=$name user=$user password=$password")
//        or die('Could not connect: ' . pg_last_error());
//
//    // Performing SQL query
//    $query = 'SELECT * FROM pg_catalog.pg_tables';
//    $result = pg_query($dbconn, $query) or die('Query failed: ' . pg_last_error());
//
//    // Printing results in HTML
//    echo "<table>\n";
//    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
//        echo "\t<tr>\n";
//        foreach ($line as $col_value) {
//            echo "\t\t<td>$col_value</td>\n";
//        }
//        echo "\t</tr>\n";
//    }
//    echo "</table>\n";
//
//    // Free resultset
//    pg_free_result($result);
//
//    // Closing connection
//    pg_close($dbconn);
//    $response->getBody()->write("API here!");
//    return $response;
//});

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
