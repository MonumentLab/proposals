// monument lab map script

/*  GLOBALS  */

// following suggestions for best scale constants
// for mercator projection
const pi = Math.PI,
    tau = 2 * pi;

// calculated the coordinate extent of Philly city limits
const mapExtent = [[-75.28,40.138],[-74.948,39.87]]

const width = $('#main.container').width(),
    height = window.innerHeight - 150;

// set initial zoom
let currZoom = 19,
// placeholders
     monuments = [],
     currMonuments = [],
     currFacet;

// d3 elements

const svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

let rasterLayer = svg.append('g').attr('id','raster');
let vectorLayer = svg.append('g').attr('id','vector').selectAll('path');

/* PROJECTION */

// projection, path and zoom behavior
let projection = d3.geoMercator()
    // .scale(80)
    .scale(1 / tau)
    .translate([0,0]);

let center = projection([-75.1641667,39.95]);

/* TILE & ZOOM */

// for the raster, extending the tile object for the current
// projection and window
let tile = d3.tile()
    .size([width,height])
    .scale(projection.scale() * tau);

let path = d3.geoPath()
            .projection(projection);

// zoom object
let zoom = d3.zoom()
    .scaleExtent([1 << currZoom, 1 << 24])
    .translateExtent( [projection(mapExtent[0]),projection(mapExtent[1])] )
    .on('zoom',zoomed);

// call the zoom
svg.call(zoom)
    // you have to pass the zoom some math including the current
    // transform parameters (x,y,scale) to map's identity transform
    .call(zoom.transform, d3.zoomIdentity
        .translate(width/2,height/2)
        .scale(1<<currZoom)
        .translate(-center[0],-center[1]));

// load the data, using promises -- either .then or Promises.all()
d3.json('../ml-geo.json').then(function(d) {
    monuments = d.features.filter( d => d.properties.neighborhood != '');
    currMonuments = monuments;

    drawMonuments();
});

d3.selectAll('button.btn.facet').on('click', function(){

    let currFacet = d3.select(this).attr('data-filter');
    currMonuments = monuments.filter(d => d.properties.zipcode == currFacet);
    drawMonuments();
});


/* HELPER FUNCTIONS */

/* helper functions */

function zoomed() {
    
    var transform = d3.event.transform;

    projection
          .scale(transform.k / tau)
          .translate([transform.x, transform.y]);

    var currTiles = tile
        .scale(transform.k)
        .translate([transform.x,transform.y])();

    var mapTiles = rasterLayer
        .attr('transform', stringify(currTiles.scale, currTiles.translate))
        .selectAll('image')
        .data(currTiles, d => d);

    mapTiles.exit()
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();

    mapTiles.enter().append('image')
        .attr( "xlink:href", d => getTileUrl(d))
        .attr('x', d => d.tx )
        .attr('y', d => d.ty )
        .attr('opacity', 0)
        .attr('width', 256)
        .attr('height', 256)
        .on("load", function (){
          d3.select(this).transition().duration(750)
            .attr("opacity", 1);
        });

    rasterLayer
        .style('opacity',.5)
        .transition().duration(500)
        .style('opacity',1);

    drawMonuments();
}

function drawMonuments(){

    d3.selectAll('.monuments')
        .transition(500)
        .attr('opacity',0)
        .remove();

    let currVector = vectorLayer
        .data(currMonuments)
        .enter()
        .append('path')
        .attr('class','monuments')
        .attr('d', path);

    d3.selectAll('path').on('mouseover', function(d){

        d3.selectAll('#curr-monument a').attr('href', '../monuments/' + d.properties.researchID);
        d3.select('#curr-monument a img').style('opacity',0)
            .attr('src', "/assets/monuments/thumbs/" + d.properties.researchID.replace(/([A-Z]*)/,'$1_') + "-thumb.jpg")
            .transition().duration(500).style('opacity',1);
        d3.select('#curr-monument h3').style('opacity',0)
            .html(d.properties.name.toUpperCase())
            .transition().duration(500).style('opacity',1);


    });
}

function getTileUrl(tile) {

    // var remoteUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}@2x.png';
    // var localUrl = '../assets/stamen-tiles/{z}/{x}/{y}{2}.png';
    var remoteUrl = 'http://cartodb-basemaps-{s}.global.ssl.fastly.net/light_labels/{z}/{x}/{y}@2x.png';

    currUrl = remoteUrl
                .replace('{s}', "abc"[Math.floor(Math.random() * 3)]);

    // if (
    //     mapExtent[0][0] > tile2long(tile.x, tile.z)
    //     || mapExtent[1][0] < tile2long(tile.x, tile.z)
    //     || mapExtent[0][1] < tile2lat(tile.y, tile.z)
    //     || mapExtent[1][1] > tile2lat(tile.y, tile.z)
    // ) {
        
    //     currUrl = remoteUrl
    //                 .replace('{s}', "abcd"[Math.floor(Math.random() * 4)]);
    // } else {

    //     currUrl = localUrl
    //                 .replace('{2}', tile.z > 14 ? '' : '@2x');

    // }

    currUrl = currUrl
            .replace('{z}', tile.z)
            .replace('{x}', tile.x)
            .replace('{y}', tile.y);

    return currUrl;
}

function stringify(scale, translate) {
    var k = scale / 256, r = scale % 1 ? Number : Math.round;
    return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
}

function tile2long(x,z) {
    return (x/Math.pow(2,z)*360-180);
}

function tile2lat(y,z) {
    var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}