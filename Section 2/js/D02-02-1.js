function show() {
    'use strict';

    var margin = {top: 20, bottom: 20, right: 50, left: 20},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ","
            + margin.top + ")");

    var yearMax = 2014;
    var adjustedData;
    var unadjustedData;

    d3.queue()
        .defer(d3.csv, "./data/households.csv")
        .defer(d3.csv, "./data/householdsU.csv")
        .await(function (error, adjusted, unadjusted) {
            adjustedData = adjusted;
            unadjustedData = unadjusted;
            update();
        });

    function update(year) {
        year = year || yearMax;
        var yearIndex = (adjustedData.length - 1) - (yearMax - year);
        var adjustedIndexedData = adjustedData.map(function(d) {return mapToindexed(d, adjustedData[yearIndex])});
        var unadjustedCleaned = unadjustedData.map(mapToIncome);
        var maxAbove = Math.abs(100 - d3.max(adjustedIndexedData, function(d) {return d.indexed }));
        var maxBelow = Math.abs(100 - d3.min(adjustedIndexedData, function(d) {return d.indexed }));
        var xRangeAdjusted = Math.ceil(Math.max(maxAbove, maxBelow));
        var xScale = d3.scaleLinear()
            .range([0, width])
            .domain([1984,2014]);
        var yIndexedScale = d3.scaleLinear()
            .range([height, 0])
            .domain([100-xRangeAdjusted, 100+xRangeAdjusted]);
        var incomeMin = d3.min(unadjustedCleaned, function (d) {return d.value});
        var incomeMax = d3.max(unadjustedCleaned, function (d) {return d.value});
        var yIncomeScale =  d3.scaleLinear()
            .range([height, 0])
            .domain([
                Math.floor(incomeMin/2000) * 2000,
                Math.ceil(incomeMax/2000) * 2000
            ]);

        addGradients(yIndexedScale);
        addArea(xScale, yIndexedScale, adjustedIndexedData);
        addIndexedLine(xScale, yIndexedScale, adjustedIndexedData);
        addIncomeLine(xScale, yIncomeScale, unadjustedCleaned)
        addAxis(yIncomeScale, yIndexedScale, xScale, xRangeAdjusted)
        addMouseTracker(xScale, yIndexedScale, yIncomeScale, adjustedIndexedData, unadjustedCleaned);
    }

    function addArea(xScale, yIndexedScale, adjustedIndexedData) {
        var area = d3.area()
            .x1(function(d) { return xScale(d.date); })
            .y1(function(d) { return yIndexedScale(d.indexed); })
            .y0(function(d) { return (yIndexedScale(100)) })
            .x0(function(d) { return xScale(d.date); })
            .curve(d3.curveCatmullRom.alpha(0.5));

        chart.append("path")
            .attr("d", area(adjustedIndexedData))
            .style("fill",  "url(#area-gradient)");
    }

    function addGradients(yIndexed) {

        var rangeMax = yIndexed.invert(0);
        var rangeMin = yIndexed.invert(height);

        chart.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", yIndexed(rangeMax))
            .attr("x2", 0).attr("y2", yIndexed(rangeMin))
            .selectAll("stop")
            .data([
                {offset: "0%", color: "#E5F2D7"},
                {offset: "50%", color: "#eee"},
                {offset: "100%", color: "#EFDBE3"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

        chart.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", yIndexed(rangeMax))
            .attr("x2", 0).attr("y2", yIndexed(rangeMin))
            .selectAll("stop")
            .data([
                {offset: "0", color: "#97D755"},
                {offset: "0.5", color: "#97D755"},
                {offset: "0.5", color: "#CD94AB"},
                {offset: "1", color: "#CD94AB"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });
    }

    function mapToindexed(row, refRow) {
        var income = +row.MEHOINUSA672N;
        var reference = +refRow.MEHOINUSA672N;
        return {
            date: row.DATE.split('-')[0],
            indexed: (income/reference) * 100
        };
    }
    function mapToIncome(row) {
        var income = +row.MEHOINUSA646N;
        return {
            date: row.DATE.split('-')[0],
            value: income
        };
    }
}
