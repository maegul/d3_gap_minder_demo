d3.json("nations.json", function(nations){

	// Initialise filtered nations
	var filtered_nations = nations.map(function(nation) { return nation; });
	
	// Initialise year index
	var year_idx = parseInt(document.getElementById("year_slider").value)-1950;
	
	
	// Selection chart area by ID
	var chart_area = d3.select("#chart_area");

	// Dynamically write to HTML/CSS
	var frame = chart_area.append("svg");
	var canvas = frame.append("g");

	// Dimensions
	var margin = {top: 19.5, right:19.5, bottom:19.5, left:39.5};
	var frame_width = 960;
	var frame_height = 350;
	var canvas_width = frame_width-margin.left - margin.right
	var canvas_height = frame_height - margin.top - margin.bottom

	// Apply dimensions (dynamic CSS)
	frame.attr("width", frame_width);
	frame.attr("height", frame_height);

	// Shift the canvas and make it slightly smaller than the svg canvas.
	canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	// SVG CHALLENGE

	// svg_ch = frame.append("svg");
	// cir = svg_ch.append("circle");
	// cir.attr("cx", "30");
	// cir.attr("cy", "30");
	// cir.attr("r", "15");
	// cir.attr("fill", "green");


	// 
	// SCALES & AXES
	// 

	//  Log scale for x axis and income
	var xScale = d3.scale.log() // Just a scale, an interchange from real to plotted values
		.domain([250, 1e5]) //numerical
		.range([0, canvas_width]); //graphical

	// Actually creating the axes
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.scale(xScale);

	// push or add to the canvas
	canvas.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + canvas_height + ")")
		.call(xAxis);
	
	// y axis
	var yScale = d3.scale.linear()
		.domain([10, 85])
		.range([canvas_height, 0]);

	var yAxis = d3.svg.axis()
		.orient("left")
		.scale(yScale);
	
	canvas.append("g")
		.attr("class", "y axis")
		.call(yAxis);
		
	// r axis
	var rScale = d3.scale.sqrt()
		.domain([0, 5e8])
		.range([0, 40])
		
	// color scale - for color coding regions
	var colorScale = d3.scale.category20();		


	//
	// Adding Data
	//

	// Add Data Canvas
	var data_canvas = canvas.append("g")
		.attr("class", "data_canvas");
		
	update();


	// Object that assigns data to everything with class '.dot'
	// with key function from the name of the nation
	// Note that 'nations' comes from head d3.json function
// 	var dot = data_canvas.selectAll(".dot")
// 		.data(nations, function(nation){return nation.name});
// 
// 
// 
// 	// Act on all data points in 'dot' each time they enter
// 	dot.enter()
// 		.append("circle")
// 		.attr("class", "dot")
// 		.attr("cx", function(nation){
// 			return xScale(nation.income[nation.income.length-1]);})
// 		.attr("cy", function(nation){
// 			return yScale(nation.lifeExpectancy[nation.lifeExpectancy.length-1]);})
// 		.attr("r", function(nation){
// 			return rScale(nation.population[nation.population.length-1]);});
		

	//////////////////////FILL IN DATA//////////////////////////


	// var filtered_nations = nations.filter(function(nation){ return nation.population[nation.population.length-1][1] > 10000000;});

	// var filtered_nations = nations.filter(function(nation){ return nation.region == "Sub-Saharan Africa";});



	// dot is finding a class, hash an ID

	// check boxes
	d3.selectAll(".region_cb").on("change", function() {
		var type = this.value;
		if (this.checked) { // adding data points (not quite right yet)
			var new_nations = nations.filter(function(nation){ return nation.region == type;});
			filtered_nations = filtered_nations.concat(new_nations);
		} else { // remove data points from the data that match the filter
			filtered_nations = filtered_nations.filter(function(nation){ return nation.region != type;});
		}
		update();
	});



	// 	Slider
	d3.select("#year_slider").on("input", function () {
	year_idx = parseInt(this.value) - 1950;
	update();
	});



	// update the plot, includes enter, exit, and transition
	function update() {
		var dot = data_canvas.selectAll(".dot")
		.data(filtered_nations, function(d){return d.name});

		dot.enter().append("circle").attr("class","dot")
			.style("fill", function(d) { return colorScale(d.region); });
			
		dot.exit().remove();
		
		dot.transition().ease('linear').duration(200)
			.attr("cx", function(d) { return xScale(d.income[year_idx]); }) // this is how attr knows to work with the data
			.attr("cy", function(d) { return yScale(d.lifeExpectancy[year_idx]); })
			.attr("r", function(d) { return rScale(d.population[year_idx]); });

		dot.exit().remove();
	}







		
// End head d3 function
});