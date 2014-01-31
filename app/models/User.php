<?php

    require_once "DatabaseObject.php";

    class User extends DatabaseObject {
        const TABLE_NAME='users';
        const TABLE_KEY='userId';


        /* Getters and Setters */
        public function getUserId(){ return $this->obj->userId; }

        public function getUserName(){ return $this->obj->userName;}
        public function setUserName($value){ $this->obj->userName = $value; }

        public function getPassword(){ return $this->obj->password;}
        public function setPassword($value){ $this->obj->password = $value; }

        public function getCreatedAt(){ return $this->obj->created_at;}

        public function getIsDeleted(){ return $this->obj->is_deleted;}
        public function setIsDeleted($value){ $this->obj->is_deleted = $value; }

    }