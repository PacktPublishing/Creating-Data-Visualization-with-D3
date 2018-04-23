
function show() {
    'use strict';

    var margin = { top: 30, bottom: 20, right: 40, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var chart = d3.select('.chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ','
                                        + margin.top + ')');


    var namesToShow = 10;
    var barWidth = 20;
    var barMargin = 5;

    d3.csv('data/yob2015.txt', function (d) { return { name: d.name, sex: d.sex, amount: +d.amount }; }, function (data) {
        var grouped = _.groupBy(data, 'sex');
        var top10F = grouped['F'].slice(0, namesToShow);
        var top10M = grouped['M'].slice(0, namesToShow);

        var both = top10F.concat(top10M.reverse());

        var bars = chart.selectAll("g").data(both)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
                var yPos = ((barWidth + barMargin) * i);
                return 'translate( 0 ' + yPos +  ')';
            });

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(both, function (d) { return d.amount; })])
            .range([0, width]);

        bars.append('rect')
            .attr("height", barWidth)
            .attr("width", function (d) { return yScale(d.amount); })
            .attr("class", function (d) { return d.sex === 'F' ? 'female' : 'male'; });

        bars.append("text")
            .attr("x", function (d) { return yScale(d.amount) - 5 ; })
            .attr("y", barWidth / 2)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

        var bottomAxis = d3.axisBottom().scale(yScale).ticks(20, "s");
        var topAxis = d3.axisTop().scale(yScale).ticks(20, "s");

        chart.append("g")
            .attr('transform', 'translate( 0 ' + both.length * (barWidth + barMargin) +  ')')
            .call(bottomAxis);

        chart.append("g")
            .attr('transform', 'translate( 0 ' + -barMargin + ' )')
            .call(topAxis);
    });

}
