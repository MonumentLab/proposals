// show/hide side pane
d3.select('#facets > #hide-control > i').on('click', function(e){

    d3.event.preventDefault();
    let currIcon = d3.select(this).attr('class');
    d3.select('#facets').classed('hide', currIcon.indexOf('left') > -1 );

    currIcon = currIcon == 'fas fa-arrow-circle-left' ? 'fas fa-arrow-circle-right' : 'fas fa-arrow-circle-left'; 
    console.log(currIcon);
    d3.select(this).attr('class', currIcon)
        .style('opacity',0)
        .transition()
        .duration(750)
        .style('opacity',1);
})

// prototype d3 gallery to improve performance

const width = $('#main.container').width(),
    height = window.innerHeight - 150,
    rowLength = 15,
    tileEdge = width/rowLength;

const svg = d3.select('#gallery').append('svg')
            .attr('width', width )
            .attr('height', height ),
        gallery = svg.append('g');

let monuments = [],
    currMonuments = [],
    currFilter = { 'reset': 0 },
    facets = [],
    keys = [];

// get facet categories
d3.select('#facets #count label span')
        .html(4445)
        .style('opacity', 0)
        .transition()
        .duration(750)
        .style('opacity', 1);;

d3.selectAll('#facets .input-group').each(function(d,i){
    currFilter[d3.select(this).attr('data-filter-group')] = [];
});

// add reset button
d3.select('#facets')
    .append('button')
    .attr('class','btn btn-sm facet reset')
    .attr('data-filter', '*')
    .text('Show All');

let zoom = d3.zoom()
    .scaleExtent([1 / 2, 7])
    .translateExtent([[-tileEdge,-tileEdge],[tileEdge * (rowLength + 1), tileEdge * 4000]])
    .on("zoom", zoomed);

// create buttons from facet values
d3.json('/js/facets.json').then(function(d){

    facets = d;

    keys = Object.keys(facets);
    keys.forEach(function(d){

      currFilter[d] = [];

      for (let i in facets[d]) {

          let currFacetValue = facets[d][i];
          let currFacet = $('#facets > .input-group[data-filter-group=' + d + '] select');
          currFacet.append("<option value=" 
            + currFacetValue.replace(/ /g,'') + ">" 
            + currFacetValue.toUpperCase() + "</option>");
        }
    });

    // add listeners
    d3.select('#facets button.reset').on('click',function(e){
        
        d3.event.preventDefault();
        d3.selectAll('#facets select').property('value','*');

        console.log('reset')
        keys.forEach( function(d) { 
            currFilter[d] = [];
        });
        currFilter['reset'] = 1;
        updateGallery();
    });

    let facetFilters = d3.selectAll('#facets select');
    facetFilters.on('input', function(){

        d3.event.preventDefault();
        let currSelect = d3.select(this);
        let currFacet = d3.select(currSelect.node().parentNode).attr('data-filter-group')
        currFilter[currFacet] = currSelect.node().value

        updateGallery()
    })
});

d3.json('/js/lunr-index.json').then(function(d){
    monuments = d;
    currMonuments = monuments;

    drawGallery(currMonuments);
});

svg.call(zoom);

/* HELPERS */

function zoomed() {
  
    let t = d3.event.transform;

    // dynamic resizing of translate extent, limiting the extent of y transform
    let currLimit = .9 * t.k * tileEdge * (currMonuments.length / rowLength);
    if(t.y < -currLimit){
        t.y = -currLimit
    }

    gallery.attr("transform", t);
}

function drawGallery(data){

    d3.selectAll('svg a').remove();

    let galleryTiles = gallery.selectAll('a')
        .data(data);

    galleryTiles
        .exit()
        .remove();

    let monument = galleryTiles.enter()
                    .append('a')
                    .attr('xlink:href', d => '/monuments/' + d.pid);

    monument.append('image')
        .style('opacity',0)
        .attr('xlink:href', d => '/assets/monuments/thumbs/' + d.image_file_name )
        .attr('x', function(d,i) { return (i % rowLength) * tileEdge })
        .attr('y',  function(d,i) { return Math.floor(i / rowLength) * tileEdge })
        .attr('width', tileEdge)
        .attr('height', tileEdge)
        .transition()
        .duration(1000)
        .style('opacity', 1);

    let tilesSelect = d3.selectAll('svg g a');
    
    tilesSelect.on('mouseenter', function(d,i) {

        d3.selectAll('svg g a rect').remove();
        d3.selectAll('svg g a text').remove();

        d3.event.preventDefault()
        let currIndex = i;

        d3.select(this)
            .append('rect')
            .attr('x', function(d,i) { return (currIndex % rowLength) * tileEdge })
            .attr('y',  function(d,i) { return Math.floor(currIndex / rowLength) * tileEdge })
            .attr('width', tileEdge)
            .attr('height', tileEdge)
            .style('fill','#ff6a39')
            .attr('opacity',0)
            .transition()
            .duration(175)
            .style('opacity',.75);


        d3.select(this)
            .append('text')
            .text( d => d.title )
            .attr('class','overlay')
            .attr('x', function(d,i) { return (currIndex % rowLength) * tileEdge })
            .attr('y',  function(d,i) { return Math.floor(currIndex / rowLength) * tileEdge })
            .each( function(){ wrap(this,tileEdge) } )
            .attr('opacity',0)
            .transition()
            .style('opacity',1);
    });
}

function updateGallery(){
    
    currMonuments = monuments; 

    if (currFilter['reset'] !== 1) {

        keys.forEach(function(d){
            if (currFilter[d] == '*' ) { currFilter[d] = []; }
            if (currFilter[d].length) {

                // currMonuments = currMonuments.filter( k => currFilter[d].toLowerCase().indexOf(k[d].toLowerCase().replace(/ /g,'')) > -1);
                currMonuments = currMonuments.filter( function(k) {
                    // console.log(currFilter[d].toLowerCase(), k[d].toLowerCase().replace(/ /g,''))
                    // console.log(currFilter[d].toLowerCase().indexOf(k[d].toLowerCase().replace(/ /g,'')))
                    if (k[d].length && currFilter[d].toLowerCase().indexOf(k[d].toLowerCase().replace(/ /g,'')) > -1) {
                        return k;
                    }

                });
            }
                
        });
    } else { currFilter['reset'] = 0; }

    console.log(currFilter)
    console.log(currMonuments.length)

    // reset zoom/translate on refilter
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    drawGallery(currMonuments);
    d3.select('#facets #count label span')
        .html(currMonuments.length)
        .style('opacity', 0)
        .transition()
        .duration(750)
        .style('opacity', 1);
}

function wrap(currText, width) {

    let text = d3.select(currText);
    let words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = parseFloat(text.attr("x")) + tileEdge/2,
        y = parseFloat(text.attr("y")) + tileEdge/3,
        dy = 1,
        tspan = text.text(null).append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + 'em');
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
      }
    }
}