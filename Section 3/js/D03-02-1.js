function show() {

    'use strict';

    // Generic setup
    var margin = {top: 20, bottom: 20, right: 120, left: 100},
        width = 800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width/2 + 100) + "," + height/2 + ")");

    // generic functions
    var tree = d3.tree()
        .size([360, 300])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var stratify = d3.stratify();
    var colorScale = d3.scaleSequential(d3.interpolateSpectral).domain([0,12]);

    var root;        // initial set of loaded data
    var currentRoot; // the currentData being shown

    // load the data
    d3.csv('./data/cats.csv', function(loaded) {
        // convert the loaded data to a nested structure, and convert
        // it to a tree with the specific settings.
        root = stratify(loaded);
        tree(root);

        // assign a group to the descendants of level 2, which we use for coloring
        var colorGroups = root.descendants().filter(function(node) {return node.depth === 2});
        colorGroups.forEach(function(group, i) {
            group.descendants().forEach(function(node) {node.data.group = i;})
        });

        // the root and rootKV, are here merely for reference, to make sure we
        // have the correct number of records at any time. Lets clone the root
        // element, so we have a working copy.
        // currentRoot =_.cloneDeep(root);
        currentRoot =_.cloneDeep(root);

        // render the graph based on the currentRoot
        update();
    });

    // draw or update the
    function update() {

        // calculate the x,y coordinates of the currentRoot
        tree(currentRoot);

        // create KV for simple access

        // the currentRoot contains the correct XY positions for all the nodes
        // minus the ones that need to be hidden. We don't want to limit the
        // number of nodes for our data elements, since that causes text and lines to
        // `jump` around. So we need to make sure we have the same amount of elements
        // and hide rendering the hidden ones.

        // now that we have to correct data, create the links
        var links = chart.selectAll(".link")
            .data(currentRoot.descendants().slice(1));

        var linksEnter = links.enter().append("path")
            .attr("class", "link")
            .style("stroke", function(d) {return colorScale(d.data.group)});

        links.merge(linksEnter)
            .attr("d", diagonal);

        // create the groups that hold the circle and the text elements
        update();
    }

    // draw a curve line between d and it's parent
    function diagonal(d) {
        return "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y);
    }

    // convert the x,y to a position on the circle
    function project(x, y) {
        var angle = (x - 90) / 180 * Math.PI, radius = y;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
    }
}
