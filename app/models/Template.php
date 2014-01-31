<?php

    require_once "DatabaseObject.php";
    require_once "TemplateVersion.php";

    class Template extends DatabaseObject {
        const TABLE_NAME='templates';
        const TABLE_KEY='templateId';

        /* Getters and Setters */
        public function getTemplateId(){ return $this->obj->templateId; }

        public function getUserId(){ return $this->obj->userId; }
        public function setUserId($value){ $this->obj->userId = $value; }

        public function getName(){ return $this->obj->name; }
        public function setName($value){ $this->obj->name = $value; }

        public function getCreatedAt(){ return $this->obj->created_at; }

        public function getIsDeleted(){ return $this->obj->is_deleted; }
        public function setIsDeleted($value){ $this->obj->is_deleted = $value; }

        /**
         *  Get Body From Latest Template Version
         *
         *  @return string Returns the body of the latest version of the template or empty string is no version exists
         */
        public function getBody(){
            $templateVersion = TemplateVersion::getLatestVersionByTemplateId($this->getTemplateId());

            if(!empty($templateVersion)){
                return html_entity_decode($templateVersion->getBody());
            } else {
                return "";
            }
        }

        /**
         * Create a new Template Version and save body to that record
         *
         * @param string $value The body of the template content area
         * @return int
         */
        public function setBody($value){
            $latestTemplateVersion = TemplateVersion::getLatestVersionByTemplateId($this->getTemplateId());
            $newVersionNumber = (!empty($latestTemplateVersion)) ? $latestTemplateVersion->getVersion()+1 : 0;

            $templateVersion = new TemplateVersion();
            $templateVersion->setVersion($newVersionNumber);
            $templateVersion->setBody($value);
            $templateVersionId = $templateVersion->insert();

            return $templateVersionId;
        }

        /**
         * Get Templates by userId
         *
         * @param $userId
         * @return array
         */
        static public function getByUserId($userId){
            $sql = "SELECT * FROM " . self::TABLE_NAME . " WHERE userId = {$userId} and is_deleted != 1";
            $templates = self::getRecordsBySQL($sql);

            return $templates;
        }

        /**
         * Overrides parent get so that we can exclude templates that are marked deleted
         *
         * @param $templateId
         * @return mixed|null
         *
         */
        static public function get($templateId){
            $sql = "SELECT * FROM " . self::TABLE_NAME . " WHERE templateId = {$templateId} and is_deleted != 1";
            $templates = self::getRecordsBySQL($sql);

            return array_pop($templates);
        }
    }