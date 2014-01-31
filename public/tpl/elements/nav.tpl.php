<script id="nav-element-template" type="text/x-handlebars-template">
<nav class="element nav hover">
    <div class="controls">
        <div class="right-top">
            <div class="delete"></div>
        </div>
        <div class="left-center">
            <div class="handlebar"></div>
        </div>
        <div class="right-center">
            <div class="handlebar"></div>
        </div>
        <div class="bottom-center">
            <div class="handlebar"></div>
        </div>
    </div>

    <div class="content">
        <ul>
            {{#each templates}}
            <li class="{{class}}" templateId={{templateId}}>{{name}}</li>
            {{/each}}
        </ul>
    </div>
</nav>
</script>

<script id="nav-button-template" type="text/x-handlebars-template">
    <li class="" templateId="{{templateId}}">{{name}}</li>
</script>
