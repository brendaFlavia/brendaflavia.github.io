var svg = d3.select("svg"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin



var xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);


var g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.csv("map_data/presidential_results.csv", function (error, data) {
    if (error) {
        throw error;
    }

    results_data = data;

    data.forEach(function(d) {
        d.museveni = +d.museveni;
        d.mao = +d.mao;
        d.tumukunde = +d.tumukunde;
        d.mwesigye = +d.mwesigye;
        d.muntu = +d.muntu;
        d.mayambala = +d.mayambala;
        d.kyagulanyi = +d.kyagulanyi;
        d.kalembe = +d.kalembe;
        d.katumba = +d.katumba;
        d.amuriat = +d.amuriat;
        d.kabuleta = +d.kabuleta;
    });

    var max_museveni = d3.max(data, function(d) { return d.museveni; } );
    var max_mao = d3.max(data, function(d) { return d.mao; } );
    var max_tumukunde = d3.max(data, function(d) { return d.tumukunde; } );
    var max_mwesigye = d3.max(data, function(d) { return d.mwesigye; } );
    var max_muntu = d3.max(data, function(d) { return d.muntu; } );
    var max_mayambala = d3.max(data, function(d) { return d.mayambala; } );
    var max_kyagulanyi = d3.max(data, function(d) { return d.kyagulanyi; } );
    var max_kalembe = d3.max(data, function(d) { return d.kalembe; } );
    var max_katumba = d3.max(data, function(d) { return d.katumba; } );
    var max_amuriat = d3.max(data, function(d) { return d.amuriat; } );
    var max_kabuleta = d3.max(data, function(d) { return d.kabuleta; } );

    var data_dict = {
        "SUMMARY" : [
            {
                "candidate" : "Museveni",
                "highest" : max_museveni
            },
            {
                "candidate" : "Mao",
                "highest" : max_mao
            },
            {
                "candidate" : "Tumukunde",
                "highest" : max_tumukunde
            },
            {
                "candidate" : "Mwesigye",
                "highest" : max_mwesigye
            },
            {
                "candidate" : "Muntu",
                "highest" : max_muntu
            },
            {
                "candidate" : "Mayambala",
                "highest" : max_mayambala
            },
            {
                "candidate" : "Kyagulanyi",
                "highest" : max_kyagulanyi
            },
            {
                "candidate" : "Kalembe",
                "highest" : max_kalembe
            },
            {
                "candidate" : "Katumba",
                "highest" : max_katumba
            },
            {
                "candidate" : "Amuriat",
                "highest" : max_amuriat
            },
            {
                "candidate" : "Kabuleta",
                "highest" : max_kabuleta
            }
        ]
    };

    data = data_dict.SUMMARY;

    var color = ["yellow", "green", "#d0743c", "#ff8c00", "#a05d56", "#d0743c", "red", "#a05d56", "#d0743c", "blue", "#ff8c00"];
    
    xScale.domain(data.map(d => d.candidate));
    yScale.domain([0, d3.max(data, d => d.highest)]);
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", height - 250)
        .attr("x", width - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "18px")
        .style("font-family", "Century Gothic bold")
        .text("Candidate Names");

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function (d) {
            return d;
        })
            .ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("font-size", "18px")
        .style("font-family", "Century Gothic")
        .text("Highest Vote Count");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.candidate); })
        .attr("y", function (d) { return yScale(d.highest); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height - yScale(d.highest); })
        .style("fill", function(d, i) {
            return color[i];
        })
        .on("mouseover", function(d, i) {

            var new_data = results_data.filter(function(f){ return f[d.candidate.toLowerCase()] == d.highest; });
            var percentage = ((d.highest/new_data[0]['valid_votes'])*100);
            tooltip.html(
            `<h4 style="color:orange;">${new_data[0]['district']} ${Math.round((percentage + Number.EPSILON) * 100) / 100}%</h4>` 
            + `Candidate: ${d.candidate}` 
            + `</br>Votes: ${d.highest.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` 
            + `</br>Valid Votes: ${new_data[0]['valid_votes'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` 
            + `</br>Invalid Votes: ${new_data[0]['invalid_votes'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` 
            + `</br>Registered Voters: ${new_data[0]['registered_voters'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)  
            .style("visibility", "visible");
            d3.select(this).attr("fill", "#c0c0c0");
        })
        .on("mousemove", function(){
        tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function() {
            tooltip.html(``).style("visibility", "hidden");
        });

        // create tooltip element  
        const tooltip = d3.select("body")
            .append("div")
            .attr("class","d3-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("padding", "15px")
            .style("background", "rgba(0,0,0,0.6)")
            .style("border-radius", "5px")
            .style("color", "#fff")
            .text("a simple tooltip");

        //Initialize legend
        var legendItemSize = 12;
        var legendSpacing = 4;
        var xOffset = 0;
        var yOffset = 120;

        var legend = d3
        .select('#legend')
        .append('svg')
            .selectAll('.legendItem')
            .data(data);

        //Create legend items
        legend
        .enter()
        .append('rect')
        .attr('class', 'legendItem')
        .attr('width', legendItemSize)
        .attr('height', legendItemSize)
        .style('fill', function(d, i) {
            return color[i];
        })
        .attr('transform',
                (d, i) => {
                    var x = xOffset;
                    var y = yOffset + (legendItemSize + legendSpacing) * i;
                    return `translate(${x}, ${y})`;
                });

        //Create legend labels
        legend
            .enter()
            .append('text')
            .attr('x', xOffset + legendItemSize + 5)
            .attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
            .text(d => d.candidate);
        });
