<?php

    require_once "DatabaseObject.php";
    require_once "TemplateVersion.php";

    class Template extends DatabaseObject {
        const TABLE_NAME='templates';
        const TABLE_KEY='templateId';

        public function getTemplateId(){ return $this->obj->templateId; }

        public function getUserId(){ return $this->obj->userId; }
        public function setUserId($value){ $this->obj->userId = $value; }

        public function getName(){ return $this->obj->name; }
        public function setName($value){ $this->obj->name = $value; }

        public function getCreatedAt(){ return $this->obj->created_at; }

        public function getIsDeleted(){ return $this->obj->is_deleted; }
        public function setIsDeleted($value){ $this->obj->is_deleted = $value; }

        public function getBody(){
            $templateVersion = TemplateVersion::getLatestVersionByTemplateId($this->getTemplateId());

            if(!empty($templateVersion)){
                return $templateVersion->getBody();
            } else {
                return "";
            }
        }

        public function setBody($value){
            $latestTemplateVersion = TemplateVersion::getLatestVersionByTemplateId($this->getTemplateId());
            $newVersionNumber = (!empty($latestTemplateVersion)) ? $latestTemplateVersion->getVersion()+1 : 0;

            $templateVersion = new TemplateVersion();
            $templateVersion->setVersion($newVersionNumber);
            $templateVersion->setBody($value);
            $templateVersionId = $templateVersion->insert();

            return $templateVersionId;
        }

        static public function getByUserId($userId){
            $sql = "SELECT * FROM " . self::TABLE_NAME . " WHERE userId = {$userId} and is_deleted != 1";

            $templates = self::getRecordsBySQL($sql);

            return $templates;
        }

        static public function get($templateId){
            $sql = "SELECT * FROM " . self::TABLE_NAME . " WHERE templateId = {$templateId} and is_deleted != 1";
            $templates = self::getRecordsBySQL($sql);

            return array_pop($templates);
        }
    }