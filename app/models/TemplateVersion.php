<?php

    require_once "DatabaseObject.php";

    class TemplateVersion extends DatabaseObject{
        const TABLE_NAME='template-versions';
        const TABLE_KEY='hash';

        public function getTemplateId(){ return $this->obj->templateId; }

        public function getVersion(){ return $this->obj->version; }
        public function setVersion($value){ $this->obj->version = $value; }

        public function getBody(){ return $this->obj->body; }
        public function setBody($value){ $this->obj->body = $value; }

        public function getCreatedAt(){ return $this->obj->created_at; }

        public function getHash(){ return $this->obj->hash; }

        static public function getLatestVersionByTemplateId($templateId) {
            $sql = "SELECT * FROM `" . self::TABLE_NAME . "` WHERE templateId={$templateId} ORDER BY version LIMIT 1";
            $result = self::getRecordsBySQL($sql);

            return array_pop($result);
        }
    }