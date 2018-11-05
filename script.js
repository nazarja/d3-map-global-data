var jsonData = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
var jsonMap = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
var tooltip = d3.select("body").append("div").attr("class", "tooltip").attr("display", "none");

// Variables
var width = "100%";
var height = "100%";
var rotate = -10;

// Create SVG // Zoom and Pan Map
var svg = d3.select("#ddd")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(
                d3.zoom()
                .translateExtent([[0, -80], [960, 755]])
                .scaleExtent([1, 50])
                .on("zoom", function () {
                    svg.attr("transform", d3.event.transform)
                })
            )
            .append("g")

// Create Projection
var projection = d3.geoMercator()
                   .center([0 , 40])
                   .scale(200)
                   .rotate([rotate, 0]); 

// Create Map Path
var path = d3.geoPath()
             .projection(projection)

// Import and Display the Map
d3.json("world-110m.geojson", function(err, map) {
    svg.append("path")
       .attr("d", path(map)); 

       d3.json("data.json", function(err, data) {

        var color;

           svg.selectAll("circle")
              .data(data.features)
              .enter()
                    .append("circle")
                    .attr("cx", function (d) { return projection([d.properties.reclong, d.properties.reclat])[0] })
                    .attr("cy", function (d) { return projection([d.properties.reclong, d.properties.reclat])[1] })
                    .attr("r", function(d) {
                        var mass = parseInt(d.properties.mass);
                        if (mass < 1000) mass = 0.5;
                        else if (mass < 10000) mass = 1;
                        else if (mass < 50000) mass = 2;
                        else if (mass < 100000) mass = 3; 
                        else if (mass < 200000) mass = 5;
                        else mass = 6;
                        return mass;
                    })
                    .style("fill", function(d) {
                        var mass = parseInt(d.properties.mass);
                        if (mass < 1000) color = "rgba(255,0,0,1)";
                        else if (mass < 10000) color = "rgba(255, 255, 0, 0.4)";
                        else if (mass < 50000) color = "rgba(51, 102, 255, 0.6)";
                        else if (mass < 100000) color = "rgba(255, 102, 255, 0.4)";
                        else if (mass < 200000) color = "rgba(0, 255, 255, 0.2)" ;
                        else color = "rgba(255,255,255,0.125)";
                        return color;
                    })
                    .on("mousemove", function(d) {
                        tooltip
                            .style("display", "inline-block")
                            .style("left", d3.event.pageX + 20 + "px")
                            .style("top", d3.event.pageY - 60 + "px")
                            .html(`
                                Mass: ${d.properties.mass}</br>
                                Name: ${d.properties.name}</br>
                                Reclassed: ${d.properties.recclass}</br>
                                Lattitute: ${d.properties.reclat}</br>
                                Longitute: ${d.properties.reclong}</br>
                                Year: ${new Date(d.properties.year)}
                            `)
                    })
                    .on("mouseout", function(d) { return tooltip.style("display", "none")})
       })
});








