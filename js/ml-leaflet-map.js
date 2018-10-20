/*  CONSTANTS  */

var facets = {},
    keys = [],
    currFilter = {},
    currMonumentsLayer,
    currMonuments,
    monuments;

/* UI */

// show/hide side pane
$('#facets #hide-control > i').on('click', function(e){

    e.preventDefault();
    let currIcon = $(e.target).attr('class');
    $('#facets').toggleClass('hide');

    currIcon = currIcon == 'fas fa-arrow-circle-left' ? 'fas fa-arrow-circle-right' : 'fas fa-arrow-circle-left'; 
    $(this).fadeOut(375, function(){ $(this).attr('class', currIcon).fadeIn(375); });
})

// create buttons from facet values
$.getJSON('/js/facets.json', function(d){

    facets = d;

    keys = Object.keys(facets);
    keys.forEach(function(d){

      currFilter[d] = [];

      for (let i in facets[d]) {

          let currFacetValue = facets[d][i];
          let currFacet = $('#facets > .input-group[data-filter-group=' + d + '] select');
          currFacet.append("<option value=" 
            + currFacetValue.toLowerCase() + ">" 
            + currFacetValue.toUpperCase() + "</option>");
        }
    });

    // add reset button
    let resetButton = $('<button>')
        .attr('class','btn btn-sm facet reset')
        .attr('data-filter', '*')
        .text('Show All');
    $('#facets').append(resetButton);

    // add listeners
    $('#facets button.reset').on('click',function(e){
        
        e.preventDefault();
        $('#facets select').each(function(){ $(this).val('*'); });

        console.log('reset')
        keys.forEach( function(d) { 
            currFilter[d] = [];
        });
        currFilter['reset'] = 1;
        updateMap();
    });

    let facetFilters = $('#facets select');
    facetFilters.on('input', function(e){
        e.preventDefault();
        let currSelect = $(e.target);
        let currFacet = currSelect.parent().attr('data-filter-group');
        currFilter[currFacet] = currSelect.val();

        updateMap()
    })

});
    //format markers
    var geojsonMarkerOptions = {
        radius: 10,
        fillColor: "#222",
        weight: 0,
        fillOpacity: .75
    };

    var markers = new L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderLegPolylineOptions: { weight: 0 },
        iconCreateFunction: function(cluster){
            var childCount = cluster.getChildCount(),
                c = ' marker-cluster-',
                currPoint;

            if (childCount < 50) {
            c += 'small';
            currPoint = new L.Point(30,30)
            } else if (childCount < 500) {
            c += 'medium';
            currPoint = new L.Point(55,55)
            } else {
            c += 'large';
            currPoint = new L.Point(80,80)
            }


            return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', 
                                    className: 'marker-cluster' + c, 
                                    iconSize: currPoint });
        },
    });

    //--------------------------------MAP---------------------------------------
    var map = L.map('map', {
            maxZoom: 16,
            minZoom: 11,
            maxBounds: [[40.13,-75.4],[39.87,-74.948]],
            center: [39.952,-75.164],
            zoom: 12
    });;

    //------------------------------LAYERS--------------------------------------
    //streets layer
    var key = 'pk.eyJ1IjoibmFiaWxrIiwiYSI6ImNqbGJvbzlpNjRoZG8zd3F0eTBnM21mcjQifQ.6yqwvqQlYvwGMG7FQPyJtA';
    var tileLayer =  L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.high-contrast/{z}/{x}/{y}@2x.png?access_token=' + key,
        {
            attribution: '&copy; <a href="http://mapbox.com/attributions">Mapbox</a>',
            subdomains: 'abc',
            maxZoom: 16,
            minZoom: 11,
            // bounds: [[40.138,-75.28],[39.87,-74.948]]
        }).addTo(map);

    //neighborhoods layer
//     var neighborhoodsStyle = {"color": "#ff6a39", "opacity": 0.8, "fillOpacity": 0.45, "weight": 1};
//     var neighborhoodsLayer = L.geoJson(neighborhoods, {style: neighborhoodsStyle}).addTo(map);
//     map.fitBounds(neighborhoodsLayer.getBounds(), {padding: [10, 10]});
//     //remove the neighborhoods layer when the user zooms in past a certain point
//     map.on('zoomend', function() {
//         if (map.getZoom() > 14){
//             if (map.hasLayer(neighborhoodsLayer)) {
//                 map.removeLayer(neighborhoodsLayer);
//             }
//         }
//         if (map.getZoom() <= 14){
//             if (map.hasLayer(neighborhoodsLayer)){
//             //   console.log("layer already added");
//             }
//             else {
//                 neighborhoodsLayer.addTo(map);
//                 neighborhoodsLayer.bringToBack();
//             }
//         }
//     });

//     //creates a layer group of the neighborhoods layer and monument points
//     //used by the selectors to remove and redraw points
//     var group = new L.LayerGroup(jsonLyr, neighborhoodsLayer);
//     map.addLayer(group);

    //----------------------------MONUMENTS-------------------------------------
    //get monument points from geojson array

$.getJSON('/js/monuments-geo.json', function(data){
    monuments = data;
    updateMap();

});

/*  HELPERS */
function MLiconCreate(cluster) {
    var childCount = cluster.getChildCount();

    var c = ' marker-cluster-';
    if (childCount < 10) {
        c += 'small';
    } else if (childCount < 100) {
        c += 'medium';
    } else {
        c += 'large';
    }

    return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
}


function updateMap() {
    console.log('all',monuments.features.length)
    currMonuments = JSON.parse(JSON.stringify(monuments));

    // currFilter['age'] = ['12','18','30'][Math.floor(Math.random() * 3)]
    if (currFilter['reset'] !== 1) {
        keys.forEach(function(facet){
            if (currFilter[facet] == '*' ) { currFilter[facet] = []; }
            if (currFilter[facet].length) {

                currMonuments.features = currMonuments.features.filter( d =>
                    d.properties[facet] &&
                    d.properties[facet].length &&
                    d.properties[facet].toLowerCase().indexOf(
                            currFilter[facet]
                        ) > -1
                );
            }
                
        });
    } else { currFilter['reset'] = 0; }
    console.log('filtered',monuments.features.length)
    console.log('filtered',currMonuments.features.length)

    console.log(currFilter)

    //adds monuments to map
    currMonumentsLayer = L.geoJson(currMonuments, {
    onEachFeature: onEachFeature, 
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
    });

    // update current count
    $('#facets #count span')
        .fadeOut(375, function() {
            $(this).text(currMonuments.features.length)
                .fadeIn(375);
        })

    markers.clearLayers()
    markers.addLayer(currMonumentsLayer);
    markers.addTo(map);
}

// ------------------------------POP-UPS-------------------------------------
function onEachFeature(feature, layer) {

    var html = "<a href='/monuments/" + feature.properties.pid +
        "'><img src='/assets/monuments/thumbs/" + feature.properties.image_file_name + "'>";

    var agePopup = "", neighborhoodPopup = "", socialMediaPopup = "";
    if (feature.properties && feature.properties.title) {
        if (feature.properties.age){
            var agePopup =  "<strong>"+"Age "+"</strong>" + feature.properties.age + "<br/>";
        }
        if (feature.properties.topicArray) {
            var topic = feature.properties.topicArray + "<br/>";
        }
        if (feature.properties.typeArray) {
            var type = feature.properties.typeArray + "<br/>";
        }
        if (feature.properties.gen_neighborhood){
            var neighborhoodPopup =  "<strong>"+"From "+"</strong>" + feature.properties.gen_neighborhood + "<br/>";
        }
        if (feature.properties.twitter) {
            socialMediaPopup = socialMediaPopup + "<a href='https://twitter.com/" + feature.properties.twitter.replace(/[@]/g,"") +
            "'><i class='fab fa-twitter'></i></a>";
        }
        if (feature.properties.instagram) {
            socialMediaPopup = socialMediaPopup + "<a href='https://www.instagram.com/" + feature.properties.instagram.replace(/[@]/g,"") +
            "'><i class='fab fa-instagram'></i></a>";
        }
        if (feature.properties.facebook) {
            socialMediaPopup = socialMediaPopup + "<a href='https://facebook.com/" + feature.properties.facebook.replace(/[@]/g,"") +
            "'><i class='fab fa-facebook'></i></a>";
        }

        layer.bindPopup(html + "<br /><span><strong>" + feature.properties.title + "</strong><br />" + "</a>"
            + agePopup + neighborhoodPopup + "</span>" + socialMediaPopup, {autoClose: false});
    }
};