
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 40, left: 100},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#Scatter")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("map_data/presidential_results.csv", function(data) {

      // Add X axis
      var x = d3.scaleLinear()
        .domain([0, 13000])
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width/2)
        .attr("y", margin.bottom*0.7)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Invalid votes");

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, 590000])
        .range([ height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("stroke", "black")
        .text("Valid votes");


      var tooltip = d3.select("#Scatter")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("width", "125px")
        .style("background-color", "blue")
        .style("position"," relative")
        .style("border", "solid")
        .style("border-width", "0.2px")
        .style("border-radius", "0.5px")
        .style("padding", "10px")




      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
      }

      var mousemove = function(d) {
        tooltip
          .html(d.district +" " + "Invalid Votes  "  + d.invalid_votes + " Valid Votes " + d.valid_votes)
          .style("left", (d3.mouse(this)[0]+90) + "px")
          .style("top", (d3.mouse(this)[2]) + "px")
      }


      var mouseleave = function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      }

      // Add dots
      svg.append('g')
        .selectAll("dot")
        .data(data.filter(function(d,i){return i<146}))
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.invalid_votes); } )
          .attr("cy", function (d) { return y(d.valid_votes); } )
          .attr("r", 4)
          .style("fill", "#69b3a2")
          .style("opacity", 0.3)
          .style("stroke", "red")
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

    })
