<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>jQuery UI Resizable - Default functionality</title>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
    <link href="css/main.css" type="text/css" rel="stylesheet" >

    <script src="//code.jquery.com/jquery-1.9.1.js"></script>
    <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>

    <style>
        .resizable { width: 150px; height: 150px; padding: 0.5em; }
        .resizable h3 { text-align: center; margin: 0; }
/*
        .resizable.ui-widget-content {
            border-radius: 4px;
            border: none;
            margin: 0px;
            padding: 3px;
        }

        .resizable.ui-widget-content:hover {
            border: none;
            border: 3px solid #8fc7ff;
            padding: 0px;
        }

        .ui-resizable-w {
            background:url('img/Resize-Bar.png') no-repeat -5px -4px;
            height: 42px;
            width: 6px;
            position: absolute;
            top: 40%;
            left: -4px;
            z-index: 2;
        }

        .ui-resizable-e {
            background:url('img/Resize-Bar.png') no-repeat -5px -4px;
            height: 42px;
            width: 6px;
            position: absolute;
            top: 40%;
            right: -4px;
            z-index: 2;
        }

        .ui-resizable-s {
            background:url('img/Resize-Bar-Horizontal.png') no-repeat -5px -4px;
            width: 42px;
            height: 6px;
            position: absolute;
            left: 40%;
            bottom: -4px;
            z-index: 2;
        }
*/
    </style>
    <script>
        $(function() {
            $( ".resizable" ).resizable();
        });
    </script>
</head>
<body>


    <div class="element title hover resizable">
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
            <h1>Add Title Here</h1>
        </div>
    </div>



</body>
</html>
