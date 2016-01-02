"use strict";
/**
 * Top level namespace for signDbMap members, methods and inner classes
 * 
 * @namespace signDbMap
 */
var signDbMap = (function () {

    /**
     * The main module object to be exported
     */
    var m = {};
    /**
     * Create a new point
     * 
     * @classDesc A class to define points that can be added to the map as markers
     * @param {number} x X-coordinate or longitude
     * @param {number} y Y-coordinate or latitude
     * @param {string} [popUpMsg=null] A message that will appear in a popup when the marker is clicked
     * @class
     * @alias signDbMap.Point
     * @memberOf signDbMap
     * @inner
     * @example
     * // Creates a point with the popup content "Message"
     * // Please note that the new statement must include signDbMap.Point and not
     * // only point
     * var p = new signDbMap.Point(10, 15, 'Message'); 
     */
    m.Point = function (x, y, popUpMsg) {

        /**
         * X-coordinate or longitude
         * 
         * @type number
         */
        this.x = x;
        /**
         * Y-coordinate or latitude
         * 
         * @type number
         */
        this.y = y;
        /**
         * Message to appear in popup
         * 
         * @type string
         */
        this.popUpMsg = null;
        // Set popup message if specified
        if (popUpMsg !== undefined) {
            this.popUpMsg = popUpMsg;
        }

    };

    /**
     * Create a new {@link signDbMap.District} object
     * 
     * @classDesc Information about a single district
     * @param {number} [id=-1]
     * @param {type} [abbreviation=n/a]
     * @param {type} [nameLatin]
     * @param {type} [nameArabic]
     * @class
     * @alias signDbMap.District
     * @memberOf signDbMap
     */
    m.District = function (id, abbreviation, nameLatin, nameArabic) {

        if (id === undefined) {
            id = -1;
        }

        if (abbreviation === undefined) {
            abbreviation = 'n/a';
        }

        if (nameLatin === undefined) {
            nameLatin = 'District name';
        }

        if (nameArabic === undefined) {
            nameArabic = 'District name Arabic';
        }

        /**
         * District id
         * 
         * @type number
         */
        this.id = id;

        /**
         * District abbreviation
         * 
         * @type string
         */
        this.abbreviation = abbreviation;

        /**
         * District name in Latin alphabet
         * 
         * @type string
         */
        this.nameLatin = nameLatin;

        /**
         * District name in Arabic alphabet
         * 
         * @type string
         */
        this.nameArabic = nameArabic;
    };

    /**
     * Create a new {@link signDbMap.Street} object
     * 
     * @classDesc Information about a single street
     * @class
     * @alias signDbMap.Street
     * @memberOf signDbMap
     * @inner
     */
    m.Street = function () {
        /**
         * Street identifier
         * 
         * @type number
         */
        this.id = -1;

        /**
         * Latin street name
         * 
         * @type string
         */
        this.nameLatin = 'Latin street name';

        /**
         * Arabic street name
         * 
         * @type string
         */
        this.nameArabic = 'Arabic street name';
    };

    /**
     * A namespace that contains predefined background maps
     * 
     * @namespace Layers
     * @memberOf signDbMap
     */
    m.Layers = {
        /**
         * AD-SDI basemap with English language labels
         * 
         * @type L.tileLayer
         * @constant
         * @memberOf signDbMap.Layers
         */
        "MapEnglish": L.tileLayer('http://geoportal.abudhabi.ae/rest/services/BaseMapEnglish/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Map data &copy; Abu Dhabi Municipality / Abu Dhabi SDI',
            maxZoom: 12,
            minZoom: 0,
            continuousWorld: true
        }),
        /**
         * AD-SDI basemap with Arabic language labels
         * 
         * @type L.tileLayer
         * @constant
         * @memberOf signDbMap.Layers
         */
        "MapArabic": L.tileLayer('http://geoportal.abudhabi.ae/rest/services/BaseMapArabic/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Map data &copy; Abu Dhabi Municipality / Abu Dhabi SDI',
            maxZoom: 12,
            minZoom: 0,
            continuousWorld: true
        }),
        /**
         * Create base map with Satellite map
         * @type L.tileLayer
         * @constant
         * @memberOf signDbMap.Layers
         */
        "Satellite50cm": L.tileLayer('http://geoportal.abudhabi.ae/rest/services/BaseMapSatellite50cm/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Map data &copy; Abu Dhabi Municipality / AD-SDI',
            maxZoom: 12,
            minZoom: 0,
            continuousWorld: true
        })
    };
    /**
     * An array to hold markers added to the map
     * @private
     */
    var markers = [];
    /**
     * The custom coordinate system used to display data and maps from Abu Dhabi
     * Systems and Information Committee's AD-SDI infrastructure
     * 
     * @type L.Proj.CRS
     * @constant crs
     * @memberOf signDbMap
     */
    m.crs = new L.Proj.CRS('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs',
            {
                origin: [
                    -400, 400
                ],
                resolutions: [
                    0.011897305029151402,
                    0.005948652514575701,
                    0.0029743262572878505,
                    0.00118973050291514,
                    5.9486525145757E-4,
                    3.5691915087454206E-4,
                    1.7845957543727103E-4,
                    1.1897305029151401E-4,
                    5.9486525145757005E-5,
                    3.5691915087454204E-5,
                    1.903568804664224E-5,
                    9.51784402332112E-6,
                    4.75892201166056E-6
                ]
            });
    /**
     * Map object
     * 
     * @type null|L.map
     */
    m.map = null;
    /**
     * Initialize map in HTML page and optionally draw a marker at center of the map
     * 
     * @function init
     * @memberOf signDbMap
     * @param {string} domElementID The id of a DOM element
     * @param {number} x X-coordiante or longitude
     * @param {number} y Y-coordinate or latitude
     * @param {number} [zoom=5] Zoom level
     * @param {boolean} [draw=false] True to draw marker at lat/lng location
     */
    m.init = function (domElementID, x, y, zoom, draw) {

        m.map = L.map(domElementID, {
            dragging: true,
            zoomControl: true,
            attributionControl: false,
            crs: m.crs
        });
        if (zoom === undefined) {
            zoom = 5;
        }

        /**
         * Set default map
         */
        m.map.addLayer(m.Layers.Satellite50cm);
        /**
         * Add layers switcher control to map
         */
        m.map.addControl(new L.Control.Layers({
            // Base maps
            'English base map': m.Layers.MapEnglish,
            'Arabic base map': m.Layers.MapArabic,
            'Satellite image': m.Layers.Satellite50cm
        }, {
            //Overlays
            //Address units': layerAddressUnits
        }, {
            collapsed: true,
            position: 'topright'
        }));
        if (draw === true) {
            var p = new signDbMap.Point(x, y);
            m.addMarkers([p]);
        }

        m.map.setView(new L.LatLng(y, x), zoom);
    };
    /**
     * Round a double precision value to a specific set of decimal digits
     * 
     * @param {number} decimalValue A decimal value
     * @param {number} [precision=6] The precision to round the decimal value to
     * @returns {Number} Number rounded to specified precision
     * @function round
     * @memberOf signDbMap
     */
    m.round = function (decimalValue, precision) {
        if (precision === undefined) {
            precision = 6;
        }
        var multiplier = 1;
        for (var i = 0; i < precision; i++) {
            multiplier = multiplier * 10;
        }

        return Math.round(decimalValue * multiplier, precision) / multiplier;
    };
    /**
     * Recenters the map to the specified coordinates
     * 
     * @param {number} x X-coordinate or longitude
     * @param {number} y Y-coordiante or latitude
     * @function center
     * @memberOf signDbMap
     */
    m.center = function (x, y) {
        if (isInit()) {
            m.map.panTo(new L.latlng(y, x));
        }
    };
    /**
     * Get the district abbreviation for given location
     * 
     * @param {number} x X-coordinate or longitude
     * @param {number} y Y-coordinate or latitude
     * @returns {signDbMap.District|false} District abbreviation or false if not found, i.e.
     * if location is outside districts
     * @function getDistrictByXY
     * @memberOf signDbMap
     * @todo Implement
     */
    m.getDistrictByXY = function (x, y) {
        return new signDbMap.District();
    };

    /**
     * Get the street identifiers for given location
     * 
     * @param {number} x X-coordinate or longitude
     * @param {number} y Y-coordinate or latitude
     * @returns {signDbMap.Street|false} Street object if found, otherwise false
     * @function getStreetByXY
     * @memberOf signDbMap
     * @todo Implement logic with back-end web service
     */
    m.getStreetByXY = function (x, y) {
        return new signDbMap.Street();
    };

    /**
     * Set a callback function to handle map clicks
     * 
     * @param {onClickCallback} callbackFunction A function that should accept two parameters: longitude (x) and latitude (y) in that order
     * @function onClick
     * @memberOf signDbMap
     */
    m.onClick = function (callbackFunction) {
        if (isInit()) {
            m.map.on('click', function (e) {
                callbackFunction(e.latlng.lng, e.latlng.lat);
            });
        }
    };

    /**
     * The callback function that is passed to the onClick event of the map will
     * be called with the parameters speficied below and can use these for any
     * application specific purpose
     * 
     * @callback onClickCallback
     * @param {number} x X-coordinate or longitude
     * @param {number} y Y-coordinate or latitude
     */

    /**
     * Check if map is initialized
     * 
     * @returns {Boolean}
     * @private
     */
    var isInit = function () {
        if (m.map === null)
        {
            console.debug('Map is not initialized');
            return false;
        }
        return true;
    };
    
    /**
     * Draw one or more markers on the map, erasing existing markers first.
     * 
     * @param {signDbMap.Point[]} points An array of {@link signDbMap.Point} objects
     * @function addMarkers
     * @memberOf signDbMap
     * @example
     * // signDbMap must first be initialized
     * var p = new signDbMap.Point(5,61);
     * signDbMap.addMarkers([p]);
     */
    m.addMarkers = function (points) {
        if (isInit()) {
            for (var i = 0; i < markers.length; i++) {
                m.map.removeLayer(markers[i]);
            }
            for (i = 0; i < points.length; i++) {
                markers.push(L.marker(new L.LatLng(points[i].y, points[i].x, 0)).addTo(m.map));
            }
        }
    };
    return m;
}());

