<?php

    require_once "DatabaseObject.php";

    class TemplateVersion extends DatabaseObject{
        const TABLE_NAME='template-versions';
        const TABLE_KEY='hash';

        /* Setters and Getters */
        public function getTemplateId(){ return $this->obj->templateId; }
        public function setTemplateId($value){ $this->obj->templateId = $value; }

        public function getVersion(){ return $this->obj->version; }
        public function setVersion($value){ $this->obj->version = $value; }

        public function getBody(){ return $this->obj->body; }
        public function setBody($value){ $this->obj->body = $value; }

        public function getCreatedAt(){ return $this->obj->created_at; }

        public function getHash(){ return $this->obj->hash; }

        /**
         * Get the latest Version of a particular Template
         *
         * @param $templateId
         * @return mixed
         */
        static public function getLatestVersionByTemplateId($templateId) {
            $sql = "SELECT * FROM `" . self::TABLE_NAME . "` WHERE templateId={$templateId} ORDER BY version DESC LIMIT 1";
            $result = self::getRecordsBySQL($sql);

            return array_pop($result);
        }
    }