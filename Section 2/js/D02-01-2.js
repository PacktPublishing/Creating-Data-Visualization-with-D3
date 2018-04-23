function show() {

    'use strict';

    var loadedData;
    d3.csv('./data/businessFiltered.csv',
        function(row) {
            switch (row.yearsInBusiness) {
                case "001" : row.yearsInBusinessLabel = "All"; break;
                case "311" : row.yearsInBusinessLabel = "less then 2 years"; break;
                case "318" : row.yearsInBusinessLabel = "2 to 3 years "; break;
                case "319" : row.yearsInBusinessLabel = "4 to 5 years"; break;
                case "321" : row.yearsInBusinessLabel = "6 to 10 years"; break;
                case "322" : row.yearsInBusinessLabel = "11 to 15 years"; break;
                case "323" : row.yearsInBusinessLabel = "more then 16 years"; break;
            }

            return row;
        },
        function (data) {
            loadedData = data;
            updateCircle();
        });

    var select = d3.select('select').on('change', update);

    var margin = {top: 20, bottom: 20, right: 20, left: 45},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ","
            + margin.top + ")");


    var pieContainer = chart.append('g').attr("transform", "translate(" + width / 2 + " " + height / 2 + ")")

    var colors = function(i) {
        return d3.interpolateReds(i/6);
    }

    var arc = d3.arc()
        .outerRadius(height/2 * 0.6)
        .innerRadius(height/2 * 0.3);

    pieContainer.append('path')
        .attr("class", 'backgroundArc')
        .attr("d", arc({startAngle: 0, endAngle: 2 * Math.PI}));

    function update() {
        var show = select.property('selectedOptions')[0].value;
        updateCircle(show);
    }

    function updateCircle(toShow) {

      var filtered = loadedData.filter(filterData(toShow));
      var totalFirms = filtered.reduce(function (total, el) {return total + +el.count}, 0);

       // based on the data, calculate the individual arc
       // parts. This returns configuration which we can pass
       // into an arc function.
      var pie = d3.pie()
           .sort(null)
           .padAngle(0.04)
           .value(function (d) {
               return +d.count;
           });

       // create the arcs segments
       // the data property of the arcs[i] represents data.
      var arcs = pie(filtered);

      var arcElements = pieContainer.selectAll(".arc").data(arcs);

      // handle the elements
      arcElements.enter()
          .append("path")
          .attr("class", "arc")
          .style("fill", function (d, i) { return colors(i) })
          .merge(arcElements)
          .attr("d", arc)

      var lineElements = pieContainer.selectAll(".lines").data(arcs);
        lineElements.enter()
            .append("path")
                .attr("class", "lines")
            .merge(lineElements)
                .transition()
                .ease(d3.easeCircle)
                .duration(2000)
                .attrTween("d", tweenLines)
    }
}

function filterData(toShow) {
    switch (toShow) {
        case "Female":
            return allFemalefilter;
        case "Male":
            return allMalefilter;
        case "All":
            return allFirmsFilter;
        case "AfricanAmerican":
            return africanAmericanFilter;
        case "White":
            return whiteFilter;
        default:
            return allFirmsFilter;
    }
}

function allFemalefilter(el) {
    return el.vetGroup === '001' &&
        el.ethnicGroup === '001' &&
        el.raceGroup === '00' &&
        el.sex === '002' &&
        el.yearsInBusiness !== '001';
}

function allMalefilter(el) {
    return el.vetGroup === '001' &&
        el.ethnicGroup === '001' &&
        el.raceGroup === '00' &&
        el.sex === '003' &&
        el.yearsInBusiness !== '001';
}

function allFirmsFilter(el) {
    return el.vetGroup === '001' &&
        el.ethnicGroup === '001' &&
        el.raceGroup === '00' &&
        el.sex === '001' &&
        el.yearsInBusiness !== '001';
}


function whiteFilter(el) {
    return el.vetGroup === '001' &&
        el.ethnicGroup === '001' &&
        el.raceGroup === '30' &&
        el.sex === '001' &&
        el.yearsInBusiness !== '001';
}
