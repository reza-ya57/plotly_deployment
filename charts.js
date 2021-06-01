function init() {
  // Grab a reference to the dropdown select element
  
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;   
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesArray.filter(samplesObj => samplesObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0]
 

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // sorted_otu = otu_ids.sort(function(a,b){
    
    yotuIds = otu_ids.map(otuId => "OTU " + otuId).slice(0,10);
    
    var trace = {
      x: sample_values,
      y: yotuIds,
      text: otu_labels,
      orientation: "h",
      type: "bar"
      
    }

    // 8. Create the trace for the bar chart. 
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    yaxis: {
      autorange : "reversed"
    },
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
      }
  };
 
    // 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot("bar", barData, barLayout);

      
      // 1. Create the trace for the bubble chart.
      var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
          marker: {
            size: sample_values,
            color: [35,10,80,30],
            colorscale: [[0,'rgb(200,234,26)'],[1,'rgb(200,63,100)']]
          }
        };

      var bubbleData = [trace1];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        height: 500,
        width: 1100,
        hovermode: "closest",
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble",bubbleData,bubbleLayout); 


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metaData = data.metadata;
      var resultMeta = metaData.filter(metaObj => metaObj.id == sample);
         

    // 2. Create a variable that holds the first sample in the metadata array.
    var result2 = resultMeta[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(result2.wfreq);
    console.log(wfreq);
       
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: wfreq,
        title: '<b>Belly Button Washing Frequency</b><br><i>Scrubs per Week</i>',
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range:[null,10]},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color:"red"},
            {range: [2,4], color:"orange"},
            {range: [4,6], color:"yellow"},
            {range: [6,8], color:"lightgreen"},
            {range: [8,10], color:"green"}
          ],
        }

      }
     
   ];
    
    // 5. Create the layout for the gauge chart.
   var gaugeLayout = { 
     width:500, height:450, margin:{t:0,b:0}
   };

    // 6. Use Plotly to plot the gauge data and layout.
   Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
    
}


