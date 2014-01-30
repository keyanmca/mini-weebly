<?php

    /*
     * API Index Page
     *
     * Everything gets routed here
     *
     */

    require_once "../../app/controllers/MiniWeeblyController.php";

    $controller = new MiniWeeblyController;
    $controller->run();