
var width = 500;
var height = 500;

d3.csv("cereals.csv", function (csv) {
  for (var i = 0; i < csv.length; ++i) {
    csv[i].Calories = Number(csv[i].Calories)
    csv[i].Fat = Number(csv[i].Fat);
    csv[i].Carb = Number(csv[i].Carb);
    csv[i].Fiber = Number(csv[i].Fiber);
    csv[i].Protein = Number(csv[i].Protein);
  }

  console.log(csv);

  // Functions used for scaling axes +++++++++++++++
  var fatExtent = d3.extent(csv, function (row) {
      return row.Fat;
  });
  var carbExtent = d3.extent(csv, function (row) {
	  return row.Carb;
  });
  var fiberExtent = d3.extent(csv, function (row) {
    return row.Fiber;
  });
  var proteinExtent = d3.extent(csv, function (row) {
    return row.Protein;
  });

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // Axis setup
  var xScale = d3.scaleLinear().domain(fatExtent).range([50, 470]);
  var yScale = d3.scaleLinear().domain(carbExtent).range([470, 30]);

  var xScale2 = d3.scaleLinear().domain(fiberExtent).range([50, 470]);
  var yScale2 = d3.scaleLinear().domain(proteinExtent).range([470, 30]);

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);

  var xAxis2 = d3.axisBottom().scale(xScale2);
  var yAxis2 = d3.axisLeft().scale(yScale2);

  //Legend
  //Hint: Append circrcles to each selection to represent the calorie level
  d3.select("#LowCalorie")
    .append('circle')
    .attr("cx", '6' )
    .attr("cy", '6.5' )
    .attr("stroke", "black")
    .attr("opacity", .6)
    .attr("r", '5px')
    .style('fill', 'pink');
  d3.select("#MedCalorie")
    .append('circle')
    .attr("cx", '6.7' )
    .attr("cy", '6.7' )
    .attr("stroke", "black")
    .attr("opacity", .6)
    .attr("r", '5px')
    .style('fill', 'red');
  d3.select("#HighCalorie")
    .append('circle')
    .attr("cx", '6' )
    .attr("cy", '6.5' )
    .attr("stroke", "black")
    .attr("opacity", .6)
    .attr("r", '5px')
    .style('fill', 'purple');

  var legend1 = d3.select('#LowCalorie')

  //Create SVGs for charts
  var chart1 = d3
    .select("#chart1")
    .append("svg:svg")
    .attr("id", "svg1")
    .attr("width", width)
    .attr("height", height);

  var chart2 = d3
    .select("#chart2")
    .append("svg:svg")
    .attr("id", "svg2")
    .attr("width", width)
    .attr("height", height);


  //Labels for Charts
  var title1 = d3
    .select("#svg1")
    .append("text")
    .attr("x", width/2)
    .attr("y", 12)
    .attr("font-size", "12px")
    .text("Fat vs Carb");

  var title2 = d3
    .select("#svg2")
    .append("text")
    .attr("x", width/2)
    .attr("y", 12)
    .attr("font-size", "12px")
    .text("Fiber vs Protein");

  //Labels for Axes
    var fatLabel = d3
    .select("#svg1")
    .append("text")
    .attr("x", width/2)
    .attr("y", height)
    .attr("font-size", "12px")
    .text("Fat");

    var carbLabel = d3
    .select("#svg1")
    .append("text")
    .attr("x", -width/2)
    .attr("y", 20)
    .attr("font-size", "12px")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("Carb");

    var fiberLabel = d3
    .select("#svg2")
    .append("text")
    .attr("x", width/2)
    .attr("y", height)
    .attr("font-size", "12px")
    .text("Fiber");

    var proteinLabel = d3
    .select("#svg2")
    .append("text")
    .attr("x", -width/2)
    .attr("y", 20)
    .attr("font-size", "12px")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("Protein");

  /******************************************
		
		Create Circles for Each Scatterplot
	 ******************************************/
    var plot1 = chart1.selectAll('.circle')
        .data(csv)
        .enter()
        .append('circle')
        .attr("r", 5)
        .attr("stroke", 'black')
        .attr("opacity", .6)
        .attr("class", function(d) {
          if (d.Calories <= 100) { 
              return "Low Calorie"
          }
          else if (d.Calories <= 130) {
              return "Medium Calorie"
          }
          else {
              return "High Calorie"
          }
      })
      .attr('cx', function (d) { return xScale(d.Fat)})
      .attr('cy', function (d) { return yScale(d.Carb)})
      // .attr("class", ".non-brushed")
      .style("fill", function (d) { if (d.Calories <= 100) { 
          return 'pink'
      }
      else if (d.Calories <= 130) {
          return 'red'
      }
      else {
          return 'purple'
      }; })

    var plot2 = chart2.selectAll('.circle')
        .data(csv)
        .enter()
        .append('circle')
        .attr("r", 5)
        .attr("stroke", 'black')
        .attr("opacity", .6)
        .attr("class", function(d) {
            if (d.Calories <= 100) { 
                return "Low Calorie"
            }
            else if (d.Calories <= 130) {
                return "Medium Calorie"
            }
            else {
                return "High Calorie"
            }
        })
        .attr('cx', function (d) { return xScale2(d.Fiber)})
        .attr('cy', function (d) { return yScale2(d.Protein)})
        .style("fill", function (d) { if (d.Calories <= 100) { 
            return 'pink'
        }
        else if (d.Calories <= 130) {
            return 'red'
        }
        else {
            return 'purple'
        }; })
        
  

  chart1 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(0," + (width - 30) + ")")
    .call(xAxis) // call the axis generator
    .append("text")
    .attr("class", "label")
    .attr("x", width - 16)
    .attr("y", -6)
    .style("text-anchor", "end");

  chart1 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  chart2 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(0," + (width - 30) + ")")
    .call(xAxis2)
    .append("text")
    .attr("class", "label")
    .attr("x", width - 16)
    .attr("y", -6)
    .style("text-anchor", "end");

  chart2 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis2)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");


//activity 2

// var brushCell;

// var extentByAttribute = {};

var brush1 = d3.brush()
    .extent([[0, 0], [width, height]])
    .on("start", brushstart1)
    .on("brush", highlightBrushedCircles)
    .on("end", displayValues);

var brush2 = d3.brush()
.extent([[0, 0], [width, height]])
.on("start", brushstart2)
.on("brush", highlightBrushedCircles2)
.on("end", displayValues);


function brushstart1() {
    // console.log('####');
    d3.select("#chart1").selectAll("circle").attr("class", "non_brushed");
    d3.select("#chart2").selectAll("circle").attr("class", "non_brushed");
    d3.select("#brush2").call(brush1.move, null); 
    // isBrushOn = 1;
    // d3.select("#brush2").call(brush2.move, null);
   }
    function brushstart2() {
        d3.select("#chart1").selectAll("circle").attr("class", "non_brushed");
        d3.select("#chart2").selectAll("circle").attr("class", "non_brushed");
        d3.select("#brush1").call(brush2.move, null);
        // isBrushOn = 2;
    }
// var isBrushOn = 0;
var selectionSize = 0;
function highlightBrushedCircles() {
    
          // Get the extent or bounding box of the brush event, this is a 2x2 array
    var e = d3.event.selection;
    if(e) {
        // console.log(isBrushOn)
        //Revert circles to initial style
        plot1.style("fill", "gray"); 
        plot2.style("fill", "gray"); 
        //Select the instance of brush selection (access coordinates of the selection area)
        var coords = d3.brushSelection(this);                                                       
        // Select all circles, and add the color gradient classes if the data for that circle
        // lies outside of the brush-filter applied for this x and y attributes

       var selected = plot1.filter(function (){

          var cx = d3.select(this).attr("cx"),
              cy = d3.select(this).attr("cy");
              return brushed(coords, cx, cy);
       } )
       // keeps the colors of the selected section
        selected.style("fill", function (d) { if (d.Calories <= 100) { 
          return 'pink'
        }
        else if (d.Calories <= 130) {
            return 'red'
        }
        else {
            return 'purple'
        };})
      // link the other chart vals
      selected.each(function(x) {
        plot2
        .filter(d=> d.CerealName === x.CerealName)
        .style("fill", function (d) { if (d.Calories <= 100) { 
          return 'pink'
      }
      else if (d.Calories <= 130) {
          return 'red'
      }
      else {
          return 'purple'
      }
      ;})
        });
        // change cereal info
        if (selected.size() == 1) {
          nameOfCereal.text(selected.data()[0].CerealName);
          calsOfCereal.text(selected.data()[0].Calories);
          fatOfCereal.text(selected.data()[0].Fat);
          carbOfCereal.text(selected.data()[0].Carb);
          fiberOfCereal.text(selected.data()[0].Fiber);
          proteinOfCereal.text(selected.data()[0].Protein);

        }
        else {
          nameOfCereal.text("");
          calsOfCereal.text("");
          fatOfCereal.text("");
          carbOfCereal.text("");
          fiberOfCereal.text("");
          proteinOfCereal.text("");

        }
      }
      
  }
  function highlightBrushedCircles2() {
    var e2 = d3.event.selection;
    if(e2) {
    plot1.style("fill", "gray");
    plot2.style("fill", "gray");
    var coords = d3.brushSelection(this);                                                       

    var selected2 = plot2.filter(function (){

      var cx = d3.select(this).attr("cx"),
          cy = d3.select(this).attr("cy");
          return brushed(coords, cx, cy);
   })
    // keep the colors of the second plot selection
    selected2.style("fill", function (d) { if (d.Calories <= 100) { 
          return 'pink'
      }
      else if (d.Calories <= 130) {
          return 'red'
      }
      else {
          return 'purple'
      };})
    // link the other chart vals
    selected2.each(function(y) {
      plot1
      .filter(d=> d.CerealName === y.CerealName)
      .style("fill", function (d) { if (d.Calories <= 100) { 
        return 'pink'
    }
    else if (d.Calories <= 130) {
        return 'red'
    }
    else {
        return 'purple'
    }
    ;})
      });
      // change the info of the cereal
      if (selected2.size() == 1) {
        nameOfCereal.text(selected2.data()[0].CerealName);
        calsOfCereal.text(selected2.data()[0].Calories);
        fatOfCereal.text(selected2.data()[0].Fat);
        carbOfCereal.text(selected2.data()[0].Carb);
        fiberOfCereal.text(selected2.data()[0].Fiber);
        proteinOfCereal.text(selected2.data()[0].Protein);

      }
      else {
        nameOfCereal.text("");
        calsOfCereal.text("");
        fatOfCereal.text("");
        carbOfCereal.text("");
        fiberOfCereal.text("");
        proteinOfCereal.text("");

      }
  }
}
// checks if area is brushed
  function brushed(coords, cx, cy){
    return !notBrushed(coords, cx, cy);
  }
//checks if area is not brushed
  function notBrushed(coords, cx, cy) {
    var p1 = coords[0][0];
    var p2 = coords[1][0];
    var p3 = coords[0][1];
    var p4 = coords[1][1];
    return p1 > cx || cx > p2 || p3 > cy ||cy > p4;
  }
  
function displayValues() {
  if(!d3.event.selection) {
    // isBrushOn = 0;
    plot1.style("fill", function (d) { if (d.Calories <= 100) { 
            return 'pink'
        }
        else if (d.Calories <= 130) {
            return 'red'
        }
        else {
            return 'purple'
      } })

    plot2.style("fill", function (d) { if (d.Calories <= 100) { 
          return 'pink'
        }
        else if (d.Calories <= 130) {
            return 'red'
        }
        else {
            return 'purple'
      } })
  }
}
chart1.append("g")
  .attr("id", "brush1")
  .call(brush1);
chart2.append("g")
  .attr("id", "brush2")
  .call(brush2);
//activity 3

//function displayInfo(circle) {
  var nameOfCereal = d3.select("#Cereal")
    .append("text")
    // .text(function (d) {
    //   return circle.data()[0].CerealName
    // })
    .attr("transform", "translate(0, 10)");
  var calsOfCereal = d3.select("#Calories")
    .append("text")
    .attr("transform", "translate(0, 11)");
  var fatOfCereal = d3.select("#FatValue")
    .append("text")
    .attr("transform", "translate(0, 11)");
  var carbOfCereal = d3.select("#CarbValue")
    .append("text")
    .attr("transform", "translate(0, 11)");
  var fiberOfCereal = d3.select("#FiberValue")
    .append("text")
    .attr("transform", "translate(0, 10)");
  var proteinOfCereal = d3.select("#ProteinValue")
    .append("text")
    .attr("transform", "translate(0, 10)");
//}

console.log("figure out display the cereal info")
console.log("clear out info")

});