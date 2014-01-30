<script id="template-pages-list-template" type="text/x-handlebars-template">
<div id="template-pages-list" class="container">
    <div class="title">Templates</div>
    <div>
        <ul>
            {{#each templates}}
            <li class="template-page" templateId="{{templateId}}">
                <input value="{{name}}" disabled/>
                <div class="buttons">
                    <div class="btn edit"></div>
                    <div class="btn delete"></div>
                    <div class="btn add"></div>
                </div>
            </li>
            {{/each}}
            <li class="template-page add-new" >
                <input placeholder="Add New Page" />
                <div class="buttons">
                    <div class="btn edit"></div>
                    <div class="btn delete"></div>
                    <div class="btn add"></div>
                </div>
            </li>
        </ul>
    </div>
</div>
</script>

<script id="template-page-button-template" type="text/x-handlebars-template">
    <li class="template-page add-new">
        <input placeholder="Add New Page" />
        <div class="buttons">
            <div class="btn edit"></div>
            <div class="btn delete"></div>
            <div class="btn add"></div>
        </div>
    </li>
</script>