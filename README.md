## SignDB Map Library
This is a map library for the sign maintenance database application.

## System requirements
- Node package manager

## Installation
- Download the repository
```
> git clone http://github.com/org.norplan.signdbmap.git
```
- Install the dependenices and run grunt tasks
```
> npm install
> grunt
```
- Run the test script to see how the library may be used
```
Open URL that points to test/index.html
```

## Usage
```
<html>
    <head>
        <link href="../node_modules/leaflet/dist/leaflet.css" rel="stylesheet" type="text/css"/>
        <style>

            body, html {
                width: 100%;
                height: 100%;
                margin: 0px;
                border: 0px;
                padding: 0px;
            }

            /*
                Note that you must proved a size for the map.
                If the size of the map element is specified as a relative size, i.e.
                a percentage like in the example below, the parent container must
                have an absolute size
            */ 
            #map {
                width: 100%;
                height: 100%;
            }
        </style>
    </head>
    <body>
        <!-- This div will contain the map -->
        <div id="map"></div>

        <!--
            Script tags can be placed within the HEAD section of the page or
            at the end of the BODY section of the page.

            Please observe the order of inclusion
        -->
        <script src="../node_modules/jquery.1/node_modules/jquery/dist/jquery.min.js" type="text/javascript"></script>
        <script src="../node_modules/leaflet/dist/leaflet.js" type="text/javascript"></script>
        <script src="../node_modules/proj4leaflet/lib/proj4-compressed.js" type="text/javascript"></script>
        <script src="../node_modules/proj4leaflet/src/proj4leaflet.js" type="text/javascript"></script>
        <script src="../dist/signdbmap.js" type="text/javascript"></script>
        <script type="text/javascript">

            jQuery('document').ready(function () {

                signDbMap.init('map', 24.46, 54.36, 5, true);

                signDbMap.onClick(function (x, y) {
                    var p = new signDbMap.Point(x, y);
                    signDbMap.addMarkers([p]);
                });
            });

        </script>
    </body>
</html>
```
