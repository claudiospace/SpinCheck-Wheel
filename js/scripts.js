

var padding = {top:20, right:40, bottom:0, left:0},
            w = 500 - padding.left - padding.right,
            h = 500 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.ordinal()//d3.scale.category20c()
			.domain(["foo", "bar", "baz"])
			.range(["#b3eaff","#1abfff","#00a6e6"]);
			
			//randomNumbers = getRandomNumbers();
			
        var data = [
					 {
					   "Label": "",
					   "value": 1,
					   "question": "Example of question 1"
					 },
					 {
					   "Label": "",
					   "value": 2,
					   "question": "Example of question 2"
					 },
					 {
					   "Label": "",
					   "value": 3,
					   "question": "Example of question 3"
					 },
					 {
					   "Label": "",
					   "value": 4,
					   "question": "Example of question 4"
					 },
					 {
					   "Label": "",
					   "value": 5,
					   "question": "Example of question 5"
					 },
					 {
					   "Label": "",
					   "value": 6,
					   "question": "Example of question 6"
					 },
					 {
					   "Label": "",
					   "value": 7,
					   "question": "Example of question 7"
					 },
					 {
					   "Label": "",
					   "value": 8,
					   "question": "Example of question 8"
					 }
					
        ];
        var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);
        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
        var vis = container
            .append("g");
            
        var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);
        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");
            
        arcs.append("path")
            .attr("fill", function(d, i){ return color(i); })
            .attr("d", function (d) { return arc(d); });
        // add the text
        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
            })
            .attr("text-anchor", "end")
            .text( function(d, i) {
                return data[i].label;
            });
        container.on("click", spin);
        function spin(d){
			
			 // clear the phrase when press spin
            d3.select("#question h1")
                        .text("");
            container.on("click", null);
            
			//all slices have been seen, all done
            console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
            if(oldpick.length == data.length){
                console.log("done");
                container.on("click", null);
                return;
            }
            var  ps       = 360/data.length,
                 pieslice = Math.round(1440/data.length),
                 rng      = Math.floor((Math.random() * 1440) + 360);
                
            rotation = (Math.round(rng / ps) * ps);
            
            picked = Math.round(data.length - (rotation % 360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;
            if(oldpick.indexOf(picked) !== -1){
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(picked);
            }
            rotation += 90 - Math.round(ps/2);
            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function(){
                    //mark question as seen
                    d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#f9f9f9");
                    //populate question
                    d3.select("#question h1")
                        .text(data[picked].question);
						
                    oldrotation = rotation;
              
                    /* Get the result value from object "data" */
                    console.log(data[picked].value)
					
                    /* Comment the below line for restrict spin to sngle time */
                    container.on("click", spin);
                });
        }
        //make arrow
        svg.append("g")
            .attr("transform", "translate(" + (w + 0 + 0) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"#4a4a4c"});
        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 60)
            .style({"fill":"white","cursor":"pointer"});
        //spin text
        container.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("SPIN")
            .style({"font-weight":"bold", "font-size":"30px"});
        
        
        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        
        
        function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                //no support for crypto, get crappy random numbers
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }
            return array;
        }


	
	
	/* FUNCTION TO ORDER, NOT IN USE
	
	$('th').on('click', function(){
		var column = $(this).data('column')
		var order = $(this).data('order')
		var text = $(this).html()
		text = text.substring(0, text.length - 1)

		if(order == 'desc'){
			$(this).data('order', "asc")
			data = data.sort((a,b) => a[column] > b[column] ? 1 : -1)
			text += '&#9660'

		}else{
			$(this).data('order', "desc")
			data = data.sort((a,b) => a[column] < b[column] ? 1 : -1)
			text += '&#9650'

		}
		$(this).html(text)
		insertPrompts(data)
	})*/
	
	
	/* FUNCTION TO SEARCH */
	$('#search-input').on('keyup',function(){
		var value = $(this).val()
		//console.log("Search", value)
		var mydata = searchTable(value, data)
		insertPrompts(mydata)
		console.log("Search", mydata)
	})
	
	insertPrompts(data)
	
	function searchTable(value, mydata) {
		var filteredData = []
		
		for (var i = 0; i < data.length; i++){
			value = value.toLowerCase()
			var searchQuestion = data[i].question.toLowerCase()
			
			if (searchQuestion.includes(value)){
				filteredData.push(data[i])
			}
		}
		return filteredData
	}
	
	
	function insertPrompts(data){
		var table = document.getElementById('prompts')
		table.innerHTML = ''
		for (var i = 0; i < data.length; i++){
			var row = `<tr>
							<td>${data[i].value}</td>
							<td>${data[i].question}</td>
					  </tr>`
			table.innerHTML += row


		}
	}



	/* OLD FUNCTIONS
	function insertPrompts(){
		document.getElementById("prompts").textContent=JSON.stringify(data, null, 2);
	}
	document.getElementById("prompts").textContent=JSON.stringify(data[0].question, null, 2);
	document.getElementById("prompts").innerHTML =data.map(i => `<li>${i}</li>`).join('');*/