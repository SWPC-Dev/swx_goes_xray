(function($){

var chart;
var latestTime;
var customSubtitle;

$(document).ready(function() {
    chart = new Highcharts.StockChart({
        chart:{
            renderTo: 'container',
            zoomType: 'x',
            type: 'line',
            //width: 1000,
            plotBorderColor: '#d3dded',
            plotBorderWidth: 1, 
            marginRight: 80,
            events:{
                load: requestData,
                redraw: function(){
                    var time_range;
                    if(this.rangeSelector.selected  == 0){
                        time_range = "3 Hours";
                    }else if(this.rangeSelector.selected == 1){
                        time_range = "3 Days";
                    }
                    this.setTitle({text: "GOES X-ray Flux (1-minute data): Lastest "+ time_range});

                }
            }
        },
        //Optional?
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 1158
                }
            }]
        },

        plotOptions:{
            series:{
                connectNulls: false
            }
        },
            

        title: {
            text: 'GOES X-Ray Flux (1-minute data)'
        },

        subtitle:{
            text: customSubtitle,
            align: "left",
            verticalAlign: "bottom"
        },

        credits:{
            enabled: true,
            text: 'Space Weather Prediction Center',
            href: 'http://www.swpc.noaa.gov',
            position:{
                align: 'right',
                x: 2
            },
            style:{
                fontSize: '11px',
                color: 'black'
            }
        },

        rangeSelector: {
          buttons: [{
                type: 'hour',
                count: 6,
                text: '6h'
            }, {
                type: 'day',
                count: 3,
                text: '3d'
            }],
            selected: 1,
            inputEnabled: false
        },

        xAxis:{
            type: 'datetime',
            ordinal: false, //Allows gaps in data to be present without changing x-axis
            tickPosition: "inside",
            maxPadding: 0,
            minPadding: 0,
            minorTickInterval: 10800000,
            minorTickLength: 4,
            minorTickPosition: "inside",
            minorTickWidth: "1",
            minorGridLineWidth: 0,
            labels:{
                align: 'left'
            },
            title:{
              text: 'Universal Time'
            }
        },

        yAxis: {
            type: 'logarithmic',
            opposite: false,
            tickInterval: 1,
            tickLength: 5,
            tickPosition: "inside",
            tickWidth: "1",
            tickColor: "#000000",
            minorTickInterval: .1,
            minorTickLength: 4,
            minorTickPosition: "inside",
            minorTickWidth: "1",
            minorGridLineWidth: 0, 
            showLastLabel: true,          
            max: 0.1,
    		    min: 0.000000001,
            title: {
                text: 'Watts m⁻²',
                margin: 33
            },
            labels: {
                useHTML: true,
                x: -25,
                formatter: function () {
                    return logLabels(this.value);                 
                },
                align: 'left'
            },
            plotBands: [
                { 
                    from: .00000001,
                    to:   .0000001,
                    //color: 'rgba(68, 170, 213, .1)',
                    label: {
                  	   align: "right",
                        text: "A",
                        style: {
                            fontWeight: 'bold'
                        },
                        x: 20
                    },
            		},
                { 
                    from: .0000001,
                    to: .000001,
                    //color: 'rgba(68, 170, 213, .2)',
                    label: {
                        align: "right",
                        text: "B",
                        style: {
                            fontWeight: 'bold'
                        },
                        x: 20
                    },
            		},
                { 
                    from:.000001,
                    to: .00001,
                    //color: 'rgba(0, 0, 0, .1)',
                    label: {
                  	    align: "right",
                        text: "C",
                        style: {
                            fontWeight: 'bold'
                        },
                        x: 20
                    },
            		},
                { 
                    from: .00001,
                    to: .0001,
                    //color: 'rgba(0, 0, 0, .2)',
                    label: {
                  	    align: "right",
                        text: "M",
                    style: {
                        fontWeight: 'bold'
                    },
                        x: 20
                  },
            		},
                { 
                    from: .0001,
                    to: .001,
                    // color: 'rgba(0, 0, 0, .3)',
                    label: {
                  	    align: "right",
                        text: "X",
                        style: {
                            fontWeight: 'bold'
                        },
                        x: 20
                    },
            		}
            ] 
        },

        legend: {
            align: 'left',
            verticalAlign: 'top'
        },

        tooltip: { //this enables the tooltip to show both plot points at once, but they are synconized(if you dont want this, just comment it out (/**/))
            shared: true,
            crosshairs: true,
            split: false,
            //valueDecimals: 3,
            animation: false,
            useHTML: true, 
        },

        plotOptions: {
            series: {
              animation: false,
                label: {
                    //connectorAllowed: false
                },
                states: {
                    hover: {
                        enabled: false
                    }
                }
                

            }
        },

        series: [{
            name: 'Short',
            color: "#001dff",
            //lineWidth: 0,
            marker: {
                enabled: true,
                radius: 1
            },
            gapSize: 1
        },{
            name: 'Long',
            color:  "#ff0000",
            marker: {
                enabled: true,
                radius: 1
            },
            gapSize: 1
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    }, function(chart){ //on complete function
                chart.renderer.text('GOES 16 0.5-4.0 A', 1170, 500)
                .attr({
                    rotation: -90
                })
                .css({
                    color: '#ff0000',
                    fontSize: '16px'
                })
                .add();
                chart.renderer.text("GOES 16 1.0-8.0 A", 1170, 300)
                .attr({
                    rotation: -90
                })
                .css({
                    fontSize: '16px',
                    color: '#001dff'
                })
                .add()
    });

    function requestData(){
        console.log("refresh le data");
          $.getJSON("http://web-st-01/services-integration/products/goes/xray-flux-3-day.json", function(data){
            //$.getJSON("xray.json", function(data){
            var shortseries = [];
            var longseries = [];
            var time;
            $.each(data,function (i, value){
                var time = Date.parse(value[0] + 'Z');
                if(value[2] == 'short wavelength'){
                    shortseries.push([time, parseFloat(value[1])]);
                }else{
                    longseries.push([time, parseFloat(value[1])]);
                }
            });
            chart.series[0].setData(shortseries);
            chart.series[1].setData(longseries);

            latestTime = new Date(shortseries[shortseries.length-1][0]);
            var customSubtitle = "Updated " + latestTime.getUTCFullYear() + "-" + String(latestTime.getUTCMonth()+1).padStart(2, '0') + "-" + String(latestTime.getUTCDate()).padStart(2, '0') + " " + String(latestTime.getUTCHours()).padStart(2, '0') + ":" + String(latestTime.getUTCMinutes()).padStart(2, '0') + " UTC";
            chart.setTitle(null, {text: customSubtitle});

            // call it again after 60(?) seconds
            setTimeout(requestData, 60000); 
        });

    }
    function logLabels(value, valueText, valueAxis){
        var powerOfTen;
        powerOfTen = value.toExponential();
        if(powerOfTen.substring(0,2) === '1e'){  
            powerOfTen = powerOfTen.slice(-2);
            powerOfTen = powerOfTen.replace('+','');
            powerOfTen = "10<sup>" + powerOfTen + "</sup>";
        }
        return powerOfTen;  
    } 
});

}(jQuery));
