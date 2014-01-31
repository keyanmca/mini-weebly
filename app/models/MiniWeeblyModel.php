<?php

    require_once "Template.php";
    require_once "TemplateVersion.php";

    /**
     * API Model
     *
     */
    class MiniWeeblyModel {

        /**
         * Get all the Template pages that belong to a user
         *
         * @param int $userId
         * @return array
         */
        public function getTemplates($userId){
            $templates = Template::getByUserId($userId);
            $templateInfo = array_map(function($object){
                $templateInfo = new stdClass;

                $templateInfo->templateId = $object->getTemplateId();
                $templateInfo->name = $object->getName();
                return $templateInfo;
            }, $templates);

            return $templateInfo;
        }

        /**
         * Get Name and Body of a single Template
         *
         * @param int $templateId
         * @return stdClass
         */
        public function getTemplate($templateId){
            $templateInfo = new stdClass;

            $template = Template::get($templateId);

            if(!empty($template)){
                $templateInfo->templateId = $template->getTemplateId();
                $templateInfo->name = $template->getName();
                $templateInfo->body = $template->getBody();
            }

            return $templateInfo;
        }

        /**
         * Update Template Page name
         *
         * @param int $templateId
         * @param string $name
         * @return mixed
         */
        public function saveTemplateName($templateId, $name){
            $template = Template::get($templateId);
            $template->setName($name);
            $result =  $template->update();

            return $result;
        }

        /**
         * Create a new Template Page
         *
         * @param int $userId
         * @param string $name
         * @return int
         */
        public function createTemplate($userId, $name){

            $template = new Template();
            $template->setUserId($userId);
            $template->setName($name);
            $templateId = $template->insert();

            return $templateId;
        }

        /**
         * Save the body of a template in as a new version
         *
         * @param int $templateId
         * @param string $body
         * @return int
         */
        public function saveTemplate($templateId, $body){

            // Get latest version saved in db
            $latestTemplateVersion = TemplateVersion::getLatestVersionByTemplateId($templateId);
            $newVersionNumber = (!empty($latestTemplateVersion)) ? $latestTemplateVersion->getVersion()+1 : 0;

            // Create a new version
            $templateVersion = new TemplateVersion();
            $templateVersion->setTemplateId($templateId);
            $templateVersion->setVersion($newVersionNumber);
            $templateVersion->setBody(htmlentities(trim($body)));
            $templateVersionId = $templateVersion->insert();

            return $templateVersionId;
        }

        /**
         * Set the is_deleted field of Template to true
         *
         * @param int $templateId
         * @return mixed
         */
        public function deleteTemplate($templateId){
            $template = Template::get($templateId);
            $template->setIsDeleted(1);
            $result = $template->update();

            return $result;
        }

}