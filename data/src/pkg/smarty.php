<?php

function get_smarty(): Smarty {
    $smartyKey = 'smarty';

    if (array_key_exists($smartyKey, $GLOBALS)) {
        $instance = $GLOBALS[$smartyKey];
        
        if ($instance instanceof Smarty) {
            return $instance;
        }
    }

    $smarty = new Smarty();

    $smarty->setTemplateDir(__DIR__ . '/../templates/templates');
    $smarty->setCompileDir(__DIR__ . '/../templates/templates_c');
    $smarty->setCacheDir(__DIR__ . '/../templates/cache');
    $smarty->setConfigDir(__DIR__ . '/../templates/configs');

    $GLOBALS[$smartyKey] = $smarty;

    return $GLOBALS[$smartyKey];
}

function fetch_template(string $name): string 
{
    return get_smarty()->fetch($name);
}