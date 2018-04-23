function show() {

    'use strict';
    var margin = {top: 20, bottom: 20, right: 20, left: 30},
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg1 = addContainer();
    var data = [
        { "country":"The Netherlands", "value":5000 },
        { "country":"Germany", "value":3000 },
        { "country":"Spain", "value":4000 },
        { "country":"Belgium", "value":2000 },
        { "country":"France", "value":4500 }
    ];
    var chart = new dimple.chart(svg1, data);
    chart.setBounds(0, 0, width, height);
    chart.addCategoryAxis("y", "country");
    chart.addMeasureAxis("x", "value");
    chart.addSeries(null, dimple.plot.bar);
    chart.draw();

    function addContainer() {
        return d3.select("body").append("svg") .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    }
}
