function show() {

    'use strict';

    var margin = {top: 100, bottom: 10, right: 70, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    var svg = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var quakes = [];
    var topo = {};
    var currentYear = 1850;

    var map = svg.append("g").attr("class","map");
    var circles = svg.append("g");
    circles.attr("clip-path","url(#clip-1)");

    d3.select(".year-select")
        .attr("width", width + margin.left + margin.right);
    d3.select("#slider").on("change", function() {
        currentYear = +this.value;
        updateYear(currentYear, quakes)
    });

    var projection = d3.geoAiry();
    var path = d3.geoPath().projection(projection);

    d3.select("#geoSelection").on("change", function() {
        projection = d3[this.value]();
        path = d3.geoPath().projection(projection);

        updateYear(currentYear, quakes);
        process(topo);
    });

    var text = svg.append("g")
        .attr("transform", "translate(" + (width/2) + " -60)")
    text.append("text").attr("class", "title").attr("text-anchor", "middle")
        .text("World Earthquake data");
    text.append("text").attr("class", "year").attr("transform", "translate(" + 0 + " 40)")
        .attr("text-anchor", "middle");

    var radiusScale = d3.scaleLinear().domain([5, 10]).range([0.2, 4]);
    var colScale = d3.scaleLinear().domain([5, 10]).range([0,1]);
    var color = function(m) { return d3.interpolateBlues((colScale(m)));};

    d3.queue()
        .defer(d3.json, "./data/world-110m.v1.json")
        .defer(d3.tsv, "./data/earthquakes.tsv")
        .await(function (error, topoData, quakesData) {
            topo = topoData;
            quakes = quakesData;
            quakes.forEach(function (d) {
                d.LATITUDE = +d.LATITUDE;
                d.LONGITUDE = +d.LONGITUDE;
                d.EQ_PRIMARY = +d.EQ_PRIMARY;
                d.YEAR = +d.YEAR;
            })
            process(topo);
            updateYear(1850, quakes)
        });

        function updateYear(year, quakes) {
            d3.select("text.year").text(year);
            var toShow = quakes.filter(function(d) {return d.YEAR === year});
            var circle = d3.geoCircle()
            var paths = circles.selectAll("path")
                .data(toShow);

            var bpaths = paths.enter()
                .append("path")
                .merge(paths);

            bpaths.attr("d", function(d) {
                return path(circle.center([d.LONGITUDE, d.LATITUDE]).radius(radiusScale(d.EQ_PRIMARY))())
            }).attr("style", function(d) {return "fill: " +  color(d.EQ_PRIMARY)});

            paths.exit().remove();
        }

    function process (topo) {

        map.selectAll("path").remove();
        d3.selectAll("defs").remove();

        var f = {type: "Sphere"}
        projection.fitSize([width, height], f)

        var outline = path(f);
        map.append("path").attr("class", "sphere").attr("d", outline);

        d3.select(".chart").append("defs").append("clipPath")
            .attr("id","clip-1")
            .append("path").attr("d", outline);

        map.attr("clip-path","url(#clip-1)");
        
        map.selectAll(".country")
           .data(topojson.feature(topo, topo.objects.countries).features)
           .enter()
           .append("path")
           .attr("class","country")
           .attr("d", path)

        map.append("path").datum(d3.geoGraticule()()).attr("class","graticule").attr("d", path);
    };

}
