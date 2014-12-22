<!DOCTYPE html>
<head>
    <title>Prereg planner</title>
    <link rel="stylesheet" href="css/main.css"
</head>
<body>
    <div id="wrapper">
        <div id="searchWrapper">
            <form method="get">
                <input type="text" name="subject" id="subject_search" placeholder="Search"/>
            </form>
            <div id="suggestionBox">

            </div>
        </div>
        <div id="graphWrapper">
            <svg id="graph" width="800" height="500">
            </svg>

        </div>
    </div>
<script src="bower_components/d3/d3.min.js"></script>
<script src="js/search.js"></script>
</body>