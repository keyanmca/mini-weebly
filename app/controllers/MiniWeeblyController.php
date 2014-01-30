<?php

    require_once dirname(__FILE__) . "/../models/MiniWeeblyModel.php";
    global $conn;

    /*
     *
     *
     *
     *
     */
    class MiniWeeblyController {

        private $modelName = 'MiniWeeblyModel';

        public function __construct(){
            global $conn;

            try{
                $conn = new PDO('mysql:dbname=mini-weebly;host=127.0.0.1','root','root');
            } catch (PDOException $e){
                echo "Danger Will Robinson! Danger!";
            }
        }

        public function run(){
            $begin_time = microtime();

            $uri = $_SERVER['REQUEST_URI'];
            $method = $_SERVER['REQUEST_METHOD'];
            $params = $_REQUEST;

            // Get PUT params
            if($method==="PUT"){
                $_PUT=array();
                parse_str(file_get_contents('php://input', false , null, -1 , $_SERVER['CONTENT_LENGTH'] ), $_PUT);
                $params = array_merge($params, $_PUT);
            }

            $params = array_merge($params, MiniWeeblyController::parseURI($uri));


            switch($method){
                case 'POST':
                    $function = 'create' . $params['entity'];
                    break;
                case 'GET':
                    $function = 'get' . $params['entity'];
                    break;
                case 'PUT':
                    $function = 'save' . $params['entity'];
                    break;
                case 'DELETE':
                    $function = 'delete' . $params['entity'];
                    break;
            }


            $returnData = new stdClass;
            $returnData->method = $method;
            $returnData->functionName = $function;
            $returnData->params = $params;

            if(method_exists($this->modelName, $function)){
                $model = new $this->modelName;

                $reflection_class = new ReflectionClass($this->modelName);
                $reflection_method = $reflection_class->getMethod($function);
                $reflection_parameters = $reflection_method->getParameters();

                $returnData->params_to_pass = array();
                foreach($reflection_parameters as $param_name){
                    if(isset($params[$param_name->name])){
                        $returnData->params_to_pass[$param_name->name] = $params[$param_name->name];
                    }
                }

                $results = call_user_func_array(array($model, $function), $returnData->params_to_pass);
            }
            $end_time = microtime();

            $returnData->data = (!empty($results)) ? $results : "";
            $returnData->duration = $end_time - $begin_time . " sec(s)";

            echo json_encode($returnData);
        }

        /*
         * Parses a URI and returns an array of name value pairs
         *
         */
        static public function parseURI($uri){
            $params = array();

            $uri = substr($uri, strpos($uri, 'api') + 4);
            $tokens = explode('/', $uri);

            $params['entity'] = array_shift($tokens);

            if(!empty($tokens) && count($tokens) >= 2 && count($tokens) % 2 ==0 ){
                for($index = 0; $index < sizeof($tokens); $index+=2){
                    $params[$tokens[$index]] = $tokens[$index+1];
                }
            }

            return $params;
        }
    }