
function show() {

    var margin = { top: 20, bottom: 20, right: 40, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function update() {

            var rectangleWidth = 100,
                data = [],
                numberOfRectangles = Math.ceil(Math.random() * 7);

            for (var i = 0 ; i < numberOfRectangles ; i++) {
                data.push((Math.random() * rectangleWidth / 2)
                                         + rectangleWidth / 2);
            }

            var rectangles = chart.selectAll("rect").data(data);

            rectangles.attr("class", "update");


            rectangles.enter()
                      .append("rect")
                      .attr("class", "enter")
                      .attr("x", function(d, i) { return i * (rectangleWidth + 5) })
                      .attr("y", 50)
                      .merge(rectangles)
                      .attr("width", function(d) {return d})
                      .attr("height", function(d) {return d});


            rectangles.exit().attr("class", "remove");
        }

        update();
        d3.interval(function() { update(); }, 3000);
}
