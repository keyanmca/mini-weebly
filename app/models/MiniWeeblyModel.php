<?php

    require_once "Template.php";
    require_once "TemplateVersion.php";

    class MiniWeeblyModel {

        /*
         *
         *
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

        /*
         *
         *
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

        /*
         *
         *
         */
        public function saveTemplateName($templateId, $name){
            $template = Template::get($templateId);
            $template->setName($name);
            $result =  $template->update();

            return $result;
        }

        /*
         *
         *
         */
        public function createTemplate($userId, $name){

            $template = new Template();
            $template->setUserId($userId);
            $template->setName($name);
            $templateId = $template->insert();

            return $templateId;
        }

        /*
         *
         *
         */
        public function saveTemplate($templateId, $body){

            $latestTemplateVersion = TemplateVersion::getLatestVersionByTemplateId($templateId);
            $newVersionNumber = (!empty($latestTemplateVersion)) ? $latestTemplateVersion->getVersion()+1 : 0;

            $templateVersion = new TemplateVersion();
            $templateVersion->setTemplateId($templateId);
            $templateVersion->setVersion($newVersionNumber);
            $templateVersion->setBody(htmlentities(trim($body)));
            $templateVersionId = $templateVersion->insert();

            return $templateVersionId;
        }

        /*
         *
         *
         */
        public function deleteTemplate($templateId){
            $template = Template::get($templateId);
            $template->setIsDeleted(1);
            $result = $template->update();

            return $result;
        }

}