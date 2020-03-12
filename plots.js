var apiKey = "LchLFCxWfbukksSdKaea";

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */

var stock = "AMZN"; // default

 // Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var company = d3.select("#stockInput");
 
  // clear the input value
  stock = company.property("value");
  console.log(stock);

  // Build the plot with the new stock
  buildPlot(stock);
}

function unpack(rows, index) {
  return rows.map(row  =>  row[index]);
}

function getMonthlyData(stock) {

  var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
  d3.json(queryUrl).then(function(data) {
     console.log(data);
     var dates = unpack(data.dataset.data, 0);
     var openPrices =  unpack(data.dataset.data, 1);
     var highPrices =  unpack(data.dataset.data, 2);
     var lowPrices =   unpack(data.dataset.data, 3);
     var closingPrices = unpack(data.dataset.data, 4);
     var volume = unpack(data.dataset.data, 5);
    
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);

    
  });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < dates.length; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}

function buildPlot(stock) {
  var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=2017-01-01&end_date=2018-11-22&api_key=${apiKey}`;

  d3.json(url).then(function(data) {

    console.log(data);
     var name = data.dataset.name;
     var stock = data.dataset.dataset_code;
     var startDate = data.dataset.start_date;
     var endDate = data.dataset.end_date;
     var dates = unpack(data.dataset.data, 0);
     var openPrices =  unpack(data.dataset.data, 1);
     var highPrices =  unpack(data.dataset.data, 2);
     var lowPrices =   unpack(data.dataset.data, 3);
     var closingPrices = unpack(data.dataset.data, 4);

     getMonthlyData(stock);

    // Closing Scatter Line Trace
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
       color: "#17BECF"
     }
   }

    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openPrices,
      close: closingPrices
   }

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);

  });
}

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);
