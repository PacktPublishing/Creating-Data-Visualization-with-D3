function show() {

    'use strict';

    var margin = {top: 20, bottom: 100, right: 20, left: 20},
        width = 1200 - margin.left - margin.right,
        height = 2000 - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ","
            + margin.top + ")");

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("display", "none");

    d3.text('./data/countries.csv', function(raw) {
        var data = d3.dsvFormat(";").parse(raw)

        data = data.map(function(el) {
            el.Population = +el.Population;
            el.Area = +el.Area;
            el.Density = el.Population / el.Area;
            el.key = el['Country code']

            if (el.Density === Infinity) el.Density = 0;
            return el;
        });

        var entries = d3.nest()
            .key(function (d) {return d.Continent; })
            .entries(data);

        console.log(entries);
        var tree = d3.partition()
            .size([height, width])
            .padding(0)

        var domain = entries.map(function(el) {return el.key}).concat("world");
        var colorScale = d3.scaleOrdinal()
            .domain(domain)
            .range(d3.range(0,entries.length + 2)
                .map(function(i) { return d3.interpolateRainbow(i/domain.length);}))

        var legend = chart.append("g")
            .attr("class","legend")
            .attr("transform", "translate(0 " + (height + 20) + ")" )

        legend.selectAll("rect")
            .data(colorScale.domain())
            .enter()
                .append("rect")
                .attr("x", function(d,i) {return i * 100})
                .attr("fill", colorScale)
                .attr("width", 100)
                .attr("height", 20)

        legend.selectAll("text")
            .data(colorScale.domain())
            .enter()
            .append("text")
            .attr("x", function(d,i) {return i * 100})
            .attr("dy", 15)
            .attr("dx", 2)
            .text(function(d) {return d})


        var properties = ['Population', 'Area', 'Density'];

        onclick();

        function withProperty(property) {
            var root = d3.hierarchy({values: entries, key: "world"}, function(d) { return d.values; })
                .sum(function(data) { return data[property]; })
                .sort(function(a, b) { return b.value - a.value; });

            tree(root);
            update(root);
        }


        function update(root) {

            var header = d3.select("h1").text("Showing " + properties[2]);

            var groups = chart.selectAll(".node").data(root.descendants(), function(d) {return d.data.key })

            var newGroups = groups
                .enter()
                .append("g")
                .attr("class","node")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .on("click", onclick);

            newGroups.append("rect")
                .style("fill", function(d) {return colorScale(d.data.Area ? d.parent.data.key : d.data.key )})
                .style("stroke", "white")
                .attr("height", function(d, i) {return d.x1 - d.x0})
                .attr("width", function(d, i) {return d.y1 - d.y0});


            newGroups.append("foreignObject")
                .append("xhtml:body")
                .style("margin-left", 0);


            var allGroups = groups.merge(newGroups)

             allGroups.transition().duration(2000)
                .attr("transform", function(d) {return "translate(" + d.y0 + " " + d.x0 + ")"})

            allGroups.select("rect")
                .transition().duration(2000)
                .attr("height", function(d, i) {return d.x1 - d.x0})
                .attr("width", function(d, i) {return d.y1 - d.y0})

            allGroups.select("foreignObject")
                .transition().duration(2000)
                .attr("height", function(d) {return d.x1 - d.x0})
                .attr("width", function(d) {return d.y1 - d.y0})

            allGroups.select("foreignObject").select("body")
                .style("margin-left", 0)
                .transition().duration(2000)
                .tween("custom", function(d, i) {

                    var oldHeight = 0;

                    var currentDiv = d3.select(this).select("div").node();
                    if (currentDiv) {
                        var height = currentDiv.getAttribute("data-height");
                        oldHeight = height ? height : 0;
                    }

                    var newHeight = (d.x1 - d.x0);
                    var interpolator = d3.interpolateNumber(oldHeight, newHeight);

                    var node = this;
                    return function(t) {
                        d3.select(node).html(function(d) {
                            var newHeight = interpolator(t);
                            return '<div data-height="' + newHeight + '"  style="height: ' + newHeight + '" class="node-name"><p>' + (d.data['Country (en)'] ?  d.data['Country (en)'] : d.data.key) + '</p></div>'
                        })
                    }
                });
        }

        function onclick(d) {
            var currentProp = properties.shift();
            properties.push(currentProp);
            withProperty(currentProp);
            mouseout()
        }

        function mouseover(d) {

            if (d.data['Population']) {
                div.style("display", "inline");
                div.html("<ul>" +
                    "<li><strong>Name:</strong> " + d.data['Country (en)'] + " </li>" +
                    "<li><strong>Population:</strong> " + d.data['Population'] + " </li>" +
                    "<li><strong>Area:</strong> " + d.data['Area'] + " </li>" +
                    "</ul>")
            }

        }

        function mousemove(d) {
            div
                .style("left", (d3.event.pageX ) + "px")
                .style("top", (d3.event.pageY + 20) + "px");
        }

        function mouseout() {
            div.style("display", "none");
        }
    });
}
