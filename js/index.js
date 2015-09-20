var JSON_FILE = "js/movieData.json";
var CONTENT_DIV_ID = "contentArea";
var treemap;
var width, height;
function init()
{			   
   var div = d3.select("#"+CONTENT_DIV_ID);

    width = div.style("width").replace("px","");
    height = div.style("height").replace("px","");

   treemap = d3.layout.treemap()
	   .size([width, height])
	   .sticky(true)
	   .value(determineNodeValue);

   d3.json(JSON_FILE, function(jsonData) 
   {
	  div.datum(jsonData)
		 .selectAll(".node")
		 .data(treemap.nodes)
		 .enter()
		 .append("div")
			.attr("class", function(d) { return d.children ?  "node franchise" : "node movie"; })
			.call(position);

	  d3.select("#typeSelector")
		 .on("change", function change() 
		 {
			div.datum(jsonData).selectAll(".node")
			   .data(treemap.value(determineNodeValue).nodes)
			   .transition()
			   .duration(1500)
			   .call(position);
			
			determineBackgroundStyles();
		 });
		 
	  d3.select("#groupSelector")
		 .on("change", function change() 
		 {
			var choice = $("#groupSelector").val();
			switch(choice)
			{
			   case "franchise":
				  d3.selectAll('.franchise').style('display', 'block');
				  d3.transition().duration(1500).each("end", function() { d3.selectAll('.movie').style('display', 'none');});
				  d3.selectAll(".franchise").transition().duration(1500).style("opacity", 0.9);
				  d3.selectAll(".movie").transition().duration(1500).style("opacity", 0);
				  break;
			   case "movie":
				  d3.transition().duration(1500).each("end", function() { d3.selectAll('.franchise').style('display', 'none');});
				  d3.selectAll('.movie').style('display', 'block');
				  d3.selectAll(".franchise").transition().duration(1500).style("opacity", 0);
				  d3.selectAll(".movie").transition().duration(1500).style("opacity", 0.9);
				  break;
			}
		 });
	
	  d3.selectAll('.movie')
		 .on("click", function(d) {
			alert(d.name + ' clicked, budget ' + d.budget/1000000 + ' Million');
		 });
	  determineBackgroundStyles();
	  
	  /*$( "#dialog" ).dialog({
		 modal: true
	  });*/
	  //$(".ui-dialog-titlebar").hide()  
   });
}

function determineBackgroundStyles()
{  
   d3.selectAll('.node')
	  .style("background-size", 
	  function(d)
	  {
		 var imageRatio = 0.7;
		 var boxRatio = d.dx/d.dy;
		 if(imageRatio < boxRatio)
			return "100% auto";
		 else
			return "auto 100%";
	  });
}

function position() 
{
   this.style("left", function(d) { return d.x + "px"; })
	  .style("top", function(d) { return d.y + "px"; })
	  .style("width", function(d) { return d.dx-4+ "px"; })
	  .style("height", function(d) { return d.dy-4 + "px"; })
	  .style("background-image", function(d) { return "url('"+ d.image+"')"; });
	  // .style("background-color", function(d) { return d.color ? d.color : "none";})
}

function determineNodeValue(d)
{
   var choice = $("#typeSelector").val();
   if(d.children)
   {
	  var total = 0;
	  for(var i=0; i<d.children.length; i++)
	  {
		 switch(choice)
		 {
			case "budget":
			   total += d.children[i].budget;
			   break;
			case "revenue":
			   total += d.children[i].revenue;
			   break;
			case "imdb":
			   total += d.children[i].imdb;
			   break;
			case "number":
			   total += 1;
			   break;
		 }
	  }
	  return total;
   }
   else
   {
	  switch(choice)
	  {
		 case "budget":
			return d.budget;
			break;
		 case "revenue":
			return d.revenue;
			break;
		 case "imdb":
			return d.imdb;
			break;
		 case "number":
			return 1;
	  }
   } 
}

