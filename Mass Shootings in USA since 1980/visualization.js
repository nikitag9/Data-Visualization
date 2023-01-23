(function() {
    var margin = {top:0,left:0,right:0,bottom:0},
    height = 720 - margin.top - margin.bottom,
    width = 1080 - margin.left - margin.right;

    var svg = d3.select('#map')
        .append('svg')
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .append('g')
        .attr('transform','translate('+ margin.left + ',' + margin.top + ')');
    
    var legend_svg = d3.select('#legend')
        .append('svg')
        .attr('height', 500 + margin.top + margin.bottom)
        .attr('width', 200 + margin.left + margin.right)

    legend_svg.append("circle")
            .attr('r','10').attr("cx","140").attr("cy","12").style("fill","#f2b0a5")
    legend_svg.append("circle")
            .attr('r','10').attr("cx","140").attr("cy","48").style("fill","#d57056")
    legend_svg.append("circle")
            .attr('r','10').attr("cx","140").attr("cy","84").style("fill","#b33a3a")
    legend_svg.append("circle")
            .attr('r','10').attr("cx","140").attr("cy","119").style("fill","#751a2c")
    legend_svg.append("circle")
            .attr('r','10').attr("cx","140").attr("cy","154").style("fill","#261421")

    svg.call(d3.zoom().on('zoom', () => {
        svg.attr('transform', d3.event.transform)
            //.duration(10);
    }));
    svg.append("text")
        .attr('class','title')
        .text("Mass Shootings In USA Since 1982")
        .attr("font-size", "20px")
        .attr("transform", "translate(400, 100)");

    d3.queue()
        .defer(d3.json,'us.json')
        .defer(d3.csv, 'shootings.csv')
        .await(ready)
    
    var projection = d3.geoAlbersUsa()
        .translate([ width / 2, height / 2])
        .scale(1000)
    
    var path = d3.geoPath()
        .projection(projection)

    
    
    function ready (error, mapdata, shootings) {
       // console.log(data)
        //console.log(shootings)
        var color = d3.scaleOrdinal()
            .domain(["Religious", "School", "Workplace","Military","Other" ])
            .range([ "#f2b0a5", "#d57056", "#b33a3a","#751a2c","#261421"])

        var size = d3.scaleLinear()
        .domain([1,604])  // What's in the data
        .range([ 4, 30])  // Size in pixel

        var counties = topojson.feature(mapdata, mapdata.objects.counties).features
        svg.selectAll('.county')
            .data(counties)
            .enter().append('path')
            .attr('class','county')
            .attr('d',path)

        var states = topojson.feature(mapdata, mapdata.objects.states).features
        //console.log(states)
        var desc = d3.select('#desc')

        var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var mouseover = function(d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                //.style("stroke", "black")
                .style("opacity", 1)
                //.style("fill", "red")
            }

        var mousemove = function(d) {
            tooltip
                .html("" + d.Case +'<br>Date:  '+ d.Date +
                '<br>Fatalities:  '+ d.Fatalities +
                '<br>Injuries:  '+ d.Injuries)
                .style("left", (d3.mouse(this)[0]+30) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
            desc.html(""+d.summary)
            }

        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.5)
                //.style("fill", "black")
            desc.html("Hover Over a Circle to View Description<br><br>Scroll to Zoom")
            }

        svg.selectAll('.state')
            .data(states)
            .enter().append('path')
            .attr('class','state')
            .attr('d',path)

        svg.selectAll(".shootings")
            .data(shootings)
            .enter().append('circle')
            .attr("class" , function(d){ return d.Location_Type })
            .style("fill", function(d){ return color(d.Location_Type) })
            .attr('opacity','0.5')
            .attr('r',function(d){ return size(d.Total_Victims) })
            .attr('cx', function (d) {
                var coords = projection([d.Longitude, d.Latitude])
                return coords[0]
            })
            .attr('cy', function (d) {
                var coords = projection([d.Longitude, d.Latitude])
                return coords[1]
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        function update(){

            // For each check box:
            d3.selectAll(".checkbox").each(function(d){
                cb = d3.select(this);
                
                grp = cb.property("value")
        
                // If the box is check, I show the group
                if(cb.property("checked")){
                svg.selectAll("."+grp).transition().duration(1000).style("opacity", 0.5).attr("r", function(d){ return size(d.Total_Victims) })
        
                // Otherwise I hide it
                }else{
                svg.selectAll("."+grp).transition().duration(1000).style("opacity", 0).attr("r", 0)
                }
            })
        }
        // When a button change, I run the update function
        d3.selectAll(".checkbox").on("change",update);

         // And I initialize it at the beginning
        update()


    }
})();