var userId=1;
var templateId=50;


$(document).ready(function(){
    init();

    // Binding Elements and Element Placeholders
    bindElementPlaceholderDraggable();
    bindContentDroppable();
    bindElementDraggableResizableOnInit();

    // Binding Template Page List
    bindTemplatePageListItem();
    bindTemplatePageAddButton();
    bindTemplatePageEditButton();
    bindTemplatePageDeleteButton();

    // Binding Site-Grid Toggle Switch
    bindToggleSwitchButton(enableAllSiteGrid);

    // Binding Element Actions on Content Area
    bindElementDeleteClick();
    bindElementHover();
    bindElementDeleteHover();
});

/**
 * Initialize the template builder
 *
 * Builds out the toolbar and loads the content
 *
 */
function init(){

    $.ajaxSetup({
        async : false,
        timeout : 1000
    });

    // Make request for list of template pages
    var template_pages = getTemplatesFromDB(userId);

    // Render template page lists
    loadHandlebarsTemplate('#template-pages-list-template', {"templates": template_pages}, '#toolbar');

    // Render elements lists
    loadHandlebarsTemplate('#elements-list-template', {}, '#toolbar');

    // Render settings page lists
    loadHandlebarsTemplate('#settings-list-template', {}, '#toolbar');

    // Get template info and render content area
    var template = getTemplateFromDB(templateId);

    // Load body of template into content area
    $('#contents').append(template.body);
}

/**
 * Wrapper function to handle Handlebars templates
 *
 */
function loadHandlebarsTemplate(selector, params, target_selector){

    // Find template
    var source = $(selector).html();

    // Compile
    var hb_template = Handlebars.compile(source);

    // Render
    var templates_page_list_html = hb_template(params);

    // Insert into DOM
    $(target_selector).append(templates_page_list_html);

}


/**********************************************
 *  DOM Manipulation
 **********************************************/

/**
 * Handles dragging element placeholders to the content area
 *
 */
function bindElementPlaceholderDraggable(){

   $('.element-placeholder .image')
    .draggable({
        "cursorAt":{ "top": 20, "left": 0 },
        "helper":"clone",
        "revert":"invalid",
        "start": function(event, ui){
            ui.helper.addClass("dragging");
            $(this).css({ "opacity":0.01 });
            enableSiteGrid($(this));
        },
        "stop": function(event, ui){
            ui.helper.removeClass("dragging");
            $(this).css({ "opacity":1 });
        }
    });
}

/**
 * Handles adding the binding of an element to make resizable and draggable after
 * it's been added to the content area
 *
 */
function bindContentDroppable(){
    $('#contents').droppable({
        "drop": function(event, ui){
            var elementType = ui.helper.parent().attr('elementType');
            var position = ui.helper.position();

            // Calculate position to place element
            var contents_position = $('#contents').offset();
            var top = (position.top - contents_position.top > 0 ) ? position.top - contents_position.top : 0;
            var left = (position.left - contents_position.left > 0 ) ? position.left - contents_position.left : 0;

            // Generate html from Handlebars template
            var source = $('#' + elementType + '-element-template').html();
            if(source != null){
                var template = Handlebars.compile(source);
                if(elementType == 'nav'){
                    var templates = getTemplatesFromDB(userId);;
                    var html = template({ "templates":templates });
                } else {
                    var html = template({});
                }
            }

            // Add element to content area and make resizable and draggable
            $(html)
                .css({
                    "top" : top ,
                    "left" : left })
                .resizable({
                    'handles': 's, e, w',
                    'minHeight': 75,
                    'minWidth': 200,
                    'start' : function(){
                        enableSiteGrid($(this));
                    },
                    'resize': function(event, ui){
                        if($(this).hasClass('title')){
                            var originalSize = 510;
                            var size = Math.sqrt((ui.size.width * ui.size.width) + (ui.size.height * ui.size.height));

                            var size_change = size / originalSize;
                            var new_font_size = parseInt(30 * size_change) + 'px';
                            $(this).find('h1').css('font-size', new_font_size);
                        }
                    },
                    "stop" : function (event, ui){
                        saveContentsToDB(templateId); } })
                .draggable({
                    "cursor" : "move",
                    "containment" : "#contents",
                    "start": function(event, ui){
                        // If Site Grid Enabled, Round position to nearest 10 first
                        if(getSiteGridState()){

                            var startPosition = $(ui.helper).position();

                            $(ui.helper).css({
                                "top": Math.round(startPosition.top/10) * 10 + 'px' ,
                                "left" : Math.round(startPosition.left/10) * 10 + 'px'
                            });
                        }
                        enableSiteGrid($(this));
                    },
                    "stop" : function (event, ui){
                        saveContentsToDB(templateId); } })
                .appendTo('#contents');

            // Save Content Area after change
            saveContentsToDB(templateId);
        }

    });
}

/**
 * Handle Binding Resizable and Draggable to Elements already in Content Area on load
 *
 */
function bindElementDraggableResizableOnInit(){
    $('#contents .element').draggable({
        "cursor" : "move",
        "containment" : "#contents",
        "start": function(event, ui){
            // If Site Grid Enabled, Round position to nearest 10 first
            if(getSiteGridState()){

                var startPosition = $(ui.helper).position();

                $(ui.helper).css({
                    "top": Math.round(startPosition.top/10) * 10 + 'px' ,
                    "left" : Math.round(startPosition.left/10) * 10 + 'px'
                });
            }
            enableSiteGrid($(this));
        },
        "stop" : function (event, ui){
            saveContentsToDB(templateId);
        }
    }).resizable({
        'handles': {'s' : '.ui-resizable-s', 'e' : '.ui-resizable-e' , 'w' : '.ui-resizable-w' },
        'minHeight': 75,
        'minWidth': 200,
        'start': function(){
            enableSiteGrid($(this));
        },
        'resize': function(event, ui){
            if($(this).hasClass('title')){
                var originalSize = 510;
                var size = Math.sqrt((ui.size.width * ui.size.width) + (ui.size.height * ui.size.height));

                var size_change = size / originalSize;
                var new_font_size = parseInt(30 * size_change) + 'px';
                $(this).find('h1').css('font-size', new_font_size);
            }
        },
        "stop" : function (event, ui){
            saveContentsToDB(templateId);
        }
    });
 }

/**
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
 * Handles edit template page button events where user
 * 1. Click Edit button
 *
 */
function bindTemplatePageEditButton(){

    // User clicks edit button
    $('#template-pages-list').on('click', '.btn.edit', function(){

        // Save old value
        var old_value = $(this).parents('.template-page').find('input').val();

        // Remove disabled attribute and change style
        $(this).parents('.template-page').addClass('edit').find('input').removeAttr('disabled').focus().on('blur', function(){

            // Re-disable input, change style back original style
            $(this).parents('.template-page').removeClass('edit').find('input').attr('disabled', 'disabled');
            var templateId = $(this).parents('.template-page').attr('templateId');
            var new_value = $(this).parents('.template-page').find('input').val();

            // If new value is different from old value, update
            if(old_value != new_value){
                var success = updateTemplateNameInDB(templateId, new_value);
                if(success){
                    // Update Nav Bars
                    $('nav li[templateid=' + templateId + ']').html(new_value);
                };
            }
        });
    });
}

/**
 * Handles hovering over an Element's on the content area to bring up resize and delete controls
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
 * Handles hovering over an Element's delete button to change container style
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
 * Handles Element's delete click event and removes element from Content area
 * SAVES Content area after change
 *
 */
function bindElementDeleteClick(){

    $('#contents').on('click', '.element .controls .delete', function(){
        $(this).parents('.element').remove();
        saveContentsToDB(templateId);
    });
}

/**
 * Bind click event for the
 *
 * @param {Function} callable Function to invoke after handling toggling switch position
 *
 */
function bindToggleSwitchButton(callable){
    $('#settings-list').on('click', '.btn.toggle', function(){
        $(this).toggleClass('enabled');
        callable();
    })
}

/**
 * Add another template page to the template page list
 *
 */
function addTemplatePage(jQueryObject){

    var pageName = jQueryObject.parents('.template-page').find('input').val();

    // Save changes to server before making any DOM changes
    var newTemplateId = createTemplatePageInDB(pageName, userId);

    // Change template page list item to normal mode
    jQueryObject.parents('.template-page').removeClass('add-new');
    jQueryObject.parents('.template-page').attr('templateId', newTemplateId);


    // Add another add new page list item
    var source = $('#template-page-button-template').html();
    var template = Handlebars.compile(source);
    var html = template({ 'templateId' : newTemplateId });
    $(html).appendTo('#template-pages-list ul')
            .css({opacity:0.01})
            .hide()
            .slideDown('slow')
            .animate({opacity:1}, 'fast');

    // Add page to navigation lists
    var source = $('#nav-button-template').html();
    var template = Handlebars.compile(source);
    var html = template({'name' : pageName, 'templateId' : newTemplateId });
    $(html).appendTo('.element.nav ul').hide().fadeIn('slow', function(){
        saveContentsToDB(templateId);
    });
}

/**
 * Look at Site Grid Switch and determine the current state
 *
 * @returns boolean
 */
function getSiteGridState(){
    return $('.setting.site-grid .btn.toggle').hasClass('enabled');
}

/**
 *
 * Find all elements already placed on content area and handle snapping to site grid
 *
 */
function enableAllSiteGrid(){
    $('#contents .element').each(function(){
        enableSiteGrid($(this));
    });
}

/**
 * Enables or disables snapping to grid for all elements placed on the content area
 *
 * @params {Object} draggableObject
 *
 */
function enableSiteGrid(jQueryObject){
    var isSiteGridEnabled = getSiteGridState();

    if(isSiteGridEnabled){
        if($(jQueryObject).is('.ui-draggable')){
            $(jQueryObject).draggable('option', 'grid', [10, 10]);
        }

        if($(jQueryObject).is('.ui-resizable')){
            $(jQueryObject).resizable('option', 'grid', [10, 10]);
        }
    } else {
        if($(jQueryObject).is('.ui-draggable')){
            $(jQueryObject).draggable('option', 'grid', false);
        }

        if($(jQueryObject).is('.ui-resizable')){
            $(jQueryObject).resizable('option', 'grid', false);
        }
    }
}



/************************************************************************************
 *  API Calls
 ************************************************************************************/


/**
 * Creates a new Template Page
 *
 * @param {String} name Name of template page
 * @param {Integer} userId UserId of user that created template page
 * @returns {Integer} Returns templateId if successful, -1 if not
 *
 */
function createTemplatePageInDB(name, userId){
    var templateId = -1;

    if(name != ''){
        $.ajax({
            'type':'POST',
            'url': '/api/template',
            'data':{'name':name, 'userId':userId} })
        .success(function(returnString){
            var results = JSON.parse(returnString);
            templateId = results.data;
        });
    }
    return templateId;
}

/**
 * Get a list of Template Pages from DB
 *
 * @param {Integer} userId
 * @returns {Array} returns an array of objects that contain template name and id
 *
 */
function getTemplatesFromDB(userId){
    var templates = [];

    if(userId){
        $.ajax({
            'type':'GET',
            'url': '/api/templates/userId/' + userId })
        .success(function(returnString){
            var results = JSON.parse(returnString);
            templates = results.data;

        });
    }

    return templates;
}

/**
 * Get Info for a single template page
 *
 * @params {Integer} templateId
 * @returns {Object}
 *
 */
function getTemplateFromDB(templateId){
    var template;

    if(templateId){
        $.ajax({
            'type':'GET',
            'url': '/api/template/templateId/' + templateId })
        .success(function(returnString){
            var results = JSON.parse(returnString);
            template = results.data;
        });
    }
    return template;
}

/**
 * Update the templateName in DB
 *
 * @params {Integer} templateId
 * @params {String} name
 * @returns {Boolean}
 *
 */
function updateTemplateNameInDB(templateId, name){
    var success = 0;

    if(templateId){
        $.ajax({
            'type':'PUT',
            'url': '/api/templateName/templateId/' + templateId,
            'data': {'name':name}})
        .success(function(returnString){
            var results = JSON.parse(returnString);
            success = results.data;
        });
    }
    return success;
}

/**
 * Save the rendered content area to DB
 *
 * @params {Integer} templateId
 * @returns {Boolean}
 *
 */
function saveContentsToDB(templateId){
    var success = false;
    $contents_src = $('#contents').html();

    $.ajax({
        'type':'PUT',
        'url': '/api/template/templateId/' + templateId,
        'data': { 'body': $contents_src }})
    .success(function(returnString){
        var results = JSON.parse(returnString);
        success = results.data;
    });

    return success;
}


/**
 * Delete a Template page from the DB
 *
 * @params {Integer} templateId
 * @returns {Boolean}
 *
 */
function deleteTemplatePageInDB(templateId){
    var success = false;

    if(templateId > 0){
        $.ajax({
            'type':'DELETE',
            'url': '/api/template/templateId/' + templateId,
            'data':{'templateId':templateId} })
        .success(function(returnString){
            var results = JSON.parse(returnString);
            success = results.data;
        })
    }
    return success;
}