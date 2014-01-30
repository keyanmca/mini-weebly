var userId=1;


$(document).ready(function(){

    init();
    bindDraggable();
    bindTemplatePageListItem();
    bindTemplatePageAddButton();
    bindTemplatePageDeleteButton();
    bindToggleSwitchButton();
    bindElementDeleteClick();
    bindElementHover();
    bindElementDeleteHover();
});

function init(){
    var template_pages = getTemplatesFromDB(userId);
    var source = $('#template-pages-list-template').html();
    var hb_template = Handlebars.compile(source);
    var templates_page_list_html = hb_template({"templates": template_pages});

    $('#toolbar').append(templates_page_list_html);

    var source = $('#elements-list-template').html();
    var hb_template = Handlebars.compile(source);
    var elements_list_html = hb_template({});

    $('#toolbar').append(elements_list_html);

    var source = $('#settings-list-template').html();
    var hb_template = Handlebars.compile(source);
    var settings_list_html = hb_template({});

    $('#toolbar').append(settings_list_html);

}


/*------------------------
 DOM Manipulation
 ------------------------*/

/**
 *
 * Handles dragging elements
 *
 */
function bindDraggable(){

    $('.element-placeholder .image')
        .draggable({
            "cursorAt":{ "top": 20, "left": 0 },
            "helper":"clone",
            "revert":"invalid",
            "start": function(event, ui){
                ui.helper.addClass("dragging");
                $(this).css({ "opacity":0.01 });

            },
            "stop": function(event, ui){
                ui.helper.removeClass("dragging");
                $(this).css({ "opacity":1 });

            }
        });
    $('#contents').droppable({
        "drop": function(event, ui){
            var elementType = ui.helper.parent().attr('elementType');
            var position = ui.helper.position();

            var contents_position = $('#contents').offset();

            var top = (position.top >  contents_position.top ) ? position.top: contents_position.top;
            var left = (position.left > contents_position.left ) ? position.left : contents_position.left;

            var source = $('#' + elementType + '-element-template').html();
            if(source != null){
                var template = Handlebars.compile(source);
                if(elementType == 'nav'){
                    var templates = getTemplatesFromDB(userId);;
                    var html = template({ "templates":templates });
                } else {
                    var html = template({});
                }

                $(html)
                    .css({
                        "top" : top ,
                        "left" : left
                    })
                    .appendTo('#contents');
            } else {

            }
        }
    });
}

/**
 *
 * Handles page list item events where
 * 1. Hover over page list item
 *
 */
function bindTemplatePageListItem(){

    $('#template-pages-list').on('mouseenter', '.template-page', function(){
        $(this).addClass('hover');
    });

    $('#template-pages-list').on('mouseleave', '.template-page', function(){
        $(this).removeClass('hover');
    });
}

/**
 *
 * Handles delete button events where
 * 1. Hover over DELETE button
 * 2. Click DELETE button
 *
 */
function bindTemplatePageDeleteButton(){

    $('#template-pages-list').on('mouseenter', '.btn.delete', function(){
        $(this).parents('.template-page').addClass('delete');
    });

    $('#template-pages-list').on('mouseleave', '.btn.delete', function(){
        $(this).parents('.template-page').removeClass('delete');
    });


    $('#template-pages-list').on('click', '.btn.delete', function(){

        var templateId = $(this).parents('.template-page').attr('templateId');
        // Delete Template from DB
        var result = deleteTemplatePageInDB(templateId);


        // Delete from Template Page List
        var that = $(this).parents('.template-page');
        $(this).parents('.template-page').fadeTo('fast', 0.01, function(){
            that.slideUp('slow', function(){
                that.remove();
            });
        });

        // Delete from Navigation Elements
        var siblings = $(this).parents('ul').find('li');
        var index = $(siblings).index(that);
        var n = index+1;
        $('.element.nav ul').find(':nth-child(' + n + ')').fadeOut('slow', function(){
            $(this).remove();
        });
    });
}



/**
 *
 * Handles add button events where
 * 1. Click ADD button
 *
 */
function bindTemplatePageAddButton(){
    $('#template-pages-list').on('click', '.add-new .btn.add', function(){
        var pageName = $(this).parents('.template-page').find('input').val();
        if(pageName != ''){
            addTemplatePage($(this));
        }
    });
}

/**
 *
 * Handles
 *
 */
function bindElementHover(){

    $('#contents').on('mouseenter', '.element', function(){
        $(this).addClass('hover');
    });

    $('#contents').on('mouseleave', '.element', function(){
        $(this).removeClass('hover');
    });
}

/**
 *
 * Handles
 *
 */
function bindElementDeleteHover(){

    $('#contents').on('mouseenter', '.element .controls .delete', function(){
        $(this).parents('.element').addClass('delete-hover');
    });

    $('#contents').on('mouseleave', '.element .controls .delete', function(){
        $(this).parents('.element').removeClass('delete-hover');
    });
}

/**
 *
 * Handles
 *
 */
function bindElementDeleteClick(){

    $('#contents').on('click', '.element .controls .delete', function(){
        $(this).parents('.element').remove();
    });
}


/*
 *
 */
function bindToggleSwitchButton(){
    $('#settings-list').on('click', '.btn.toggle', function(){
        $(this).toggleClass('enabled');
    })
}

/*
 *
 */
function addTemplatePage(jQueryObject){

    var pageName = jQueryObject.parents('.template-page').find('input').val();

    // Save changes to server before making any DOM changes
    var templateId = createTemplatePageInDB(pageName);

    // Change template page list item to normal mode
    jQueryObject.parents('.template-page').removeClass('add-new');
    jQueryObject.parents('.template-page').attr('templateId', templateId);


    // Add another add new page list item
    var source = $('#template-page-button-template').html();
    var template = Handlebars.compile(source);
    var html = template({ 'templateId' : templateId });
    $(html).appendTo('#template-pages-list ul')
            .css({opacity:0.01})
            .hide()
            .slideDown('slow')
            .animate({opacity:1}, 'fast');

    // Add page to navigation lists
    var source = $('#nav-button-template').html();
    var template = Handlebars.compile(source);
    var html = template({'name' : pageName, 'templateId' : templateId });
    $(html).appendTo('.element.nav ul').hide().fadeIn('slow');
}






/*---
    Database Interactions
 ---*/

/*
 *
 */
function updateTemplatePage(templateId, name, body){

}

/*
 *
 */
function deleteTemplatePageInDB(templateId){
    var result = false;
    if(templateId > 0){
        $.ajax({
            'type':'DELETE',
            'url': '/api/template/templateId/' + templateId,
            'data':{'templateId':templateId},
            'timeout' : 1000,
            'async' : false
        })
        .success(function(returnString){
            console.log(returnString);
        })
        .error(function(){});
    }
    return result;
}

/**
 *
 * Adds entry into Template table
 *
 * @param name
 * @returns templateId
 */
function createTemplatePageInDB(name){
    var templateId = -1;
    if(name != ''){
        $.ajax({
            'type':'POST',
            'url': '/api/template',
            'data':{'name':name, 'userId':userId},
            'timeout' : 1000,
            'async' : false
        })
        .success(function(returnString){
            var results = JSON.parse(returnString);
            templateId = results.data;

        });
    }
    return templateId;
}

/**
 *
 *
 */
 function getTemplatesFromDB(userId){
    var templates = [];
    if(userId){
        $.ajax({
            'type':'GET',
            'url': '/api/templates/userId/' + userId,
            'timeout' : 1000,
            'async' : false
        })
            .success(function(returnString){
                var results = JSON.parse(returnString);
                templates = results.data;

            });
    }
    return templates;
}
