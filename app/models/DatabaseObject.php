<?php

    /*
     *
     *
     *
     */
    class DatabaseObject {
        const TABLE_NAME = '';
        const TABLE_KEY = '';

        /*
         *
         *
         */
        protected $obj;

        /*
         *
         *
         *
         */
        public function __construct(){
            $this->obj = new stdClass;
        }

        /*
         *
         */
        public function insert(){
            global $conn;

            $id = -1;

            $fields = array_keys(get_object_vars($this->obj));
            $values = array_values(get_object_vars($this->obj));

            $strFields = implode(', ', $fields);
            $strValues = "'" . implode('\',\' ', $values) . "'";
            $sql = "INSERT INTO `" . $this::TABLE_NAME . "` ({$strFields})" . " VALUES ({$strValues})";

            try{
                $conn->exec($sql);
                $id = $conn->lastInsertId();

            } catch (PDOException $e){
                echo "Danger Will Robinson! Danger!";
            }

           return $id;

        }

        /*
         *
         */
        public function update(){
            global $conn;


            $nameValuePairs = array();
            foreach(get_object_vars($this->obj) as $field=>$value){
                if($field != $this::TABLE_KEY){
                    $nameValuePairs[] = "{$field}='{$value}'";
                }
            }
            $strNameValuePairs = implode(', ', $nameValuePairs);
            $sql = "UPDATE " . $this::TABLE_NAME . " SET {$strNameValuePairs}
                        WHERE " . $this::TABLE_KEY . "=" .  $this->obj->{$this::TABLE_KEY};

            try{
                $result = $conn->exec($sql);
            } catch (PDOException $e){
                echo "Danger Will Robinson! Danger!";
            }

            return $result;
        }

        /*
         *
         */
        public function delete($id){
            global $conn;
            $result = false;


            try{
                $sql = "DELETE FROM " . $this::TABLE_NAME . " WHERE " . $this::TABLE_KEY . "= {$id}";
                echo $sql;
                $result = $conn->exec($sql);
            } catch (PDOException $e){
                echo "Danger Will Robinson! Danger!";
            }

            return $result;

        }


        /*
         *
         *
         *
         */
        static public function getAll(){
            global $conn;

            $arrayOfObjects = array();
            $class = get_called_class();

            try{
                $sql = "SELECT * FROM " . $class::TABLE_NAME;
                $rows = $conn->query($sql)->fetchAll(PDO::FETCH_OBJ);

                foreach($rows as $row){
                    $object = new $class;
                    $object->obj = $row;
                    $arrayOfObjects[] = $object;
                }
            } catch (PDOException $e){
                echo "Danger Will Robinson! Danger!";
            }

            return $arrayOfObjects;

        }

        /*
         *
         *
         *
         */
        static public function get($id){
            global $conn;

            $class = get_called_class();
            $object = null;

            try{
                $sql = "SELECT * FROM " . $class::TABLE_NAME . " WHERE " . $class::TABLE_KEY . "= {$id}";
                $row = $conn->query($sql)->fetch(PDO::FETCH_OBJ);

                if($row){
                    $object = new $class;
                    $object->obj = $row;
                }
            } catch (PDOException $e){
                echo "Danger Will Robinson! Danger!";
            }

            return $object;
        }

        /*
         *
         *
         *
         *
         */
        static public function getRecordsBySQL($sql){
            global $conn;
            $class = get_called_class();

            $objects = array();
            try{
                $rows = $conn->query($sql);
                if($rows){
                    foreach($rows->fetchAll(PDO::FETCH_OBJ) as $row){
                        $object = new $class;
                        $object->obj = $row;

                        $objects[] = $object;
                    }
                }
            } catch (PDOException $e){
                echo "Danger Will Robinson! Danger!";
            }

            return $objects;

        }
    }