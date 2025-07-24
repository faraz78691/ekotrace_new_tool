


var options = {
  series: [{
  name: 'Scope 1',
  data: [31, 40, 28, 51, 42, 109, 100]
}, {
  name: 'Scope 2',
  data: [11, 32, 45, 32, 34, 52, 41]
}, {
  name: 'Scope 3',
  data: [11, 3, 15, 20, 14, 19, 20]
}],
colors : ['#0E9B93', '#8F2424','#CE6CFD'],
  chart: {
  height: 350,
  type: 'area'
},
dataLabels: {
  enabled: false
},
stroke: {
  curve: 'smooth'
},
xaxis: {
  type: 'datetime',
  categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
},
tooltip: {
  x: {
    format: 'dd/MM/yy HH:mm'
  },
},
};


var energy_Consumption = new ApexCharts(document.querySelector("#energy_Consumption"), options);
energy_Consumption.render();



var options = 
{
    dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
    colors : ['#213D49', '#46A5CD','#FFD914'],
    series: [{
    name: 'Scope 1',
    data: [44, 55, 41, 67, 22, 43,44, 55, 41, 67, 22, 43]
  }, {
    name: 'Scope 2',
    data: [13, 23, 20, 8, 13, 27,13, 23, 20, 8, 13, 27]
  }, {
    name: 'Scope 3',
    data: [11, 17, 15, 15, 21, 14,11, 17, 15, 15, 21, 14]
 
  }],
    chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: true
    },
    zoom: {
      enabled: true
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom',
        offsetX: -10,
        offsetY: 0
      }
    }
  }],
 
  plotOptions: {
    bar: {
        columnWidth: '40%',
      horizontal: false,
      borderRadius: 8,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: '13px',
            fontWeight: 900
          }
        }
      }
    },
  },

  xaxis: {
    categories: ['Apr, 23','May, 23','Jun, 23','Jul, 23','Aug, 23','Sep, 23','Oct, 23', 'Nov, 23','Dec, 23','Jan, 24','Feb, 24','Mar, 24']
  },
  legend: {
    position: 'top',
    offsetY: 0
  },
  fill: {
    opacity: 1
  }
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();



//   Intensity chart js S
var options = {
  series: [
  {
    name: "Scope 1",
    data: [28, 29, 33, 36, 32, 32, 33]
  },
  {
    name: "Scope 2",
    data: [12, 11, 14, 18, 17, 13, 13]
  }
],
  chart: {
  height: 350,
  type: 'line',
  dropShadow: {
    enabled: true,
    color: '#000',
    top: 18,
    left: 7,
    blur: 10,
    opacity: 0.2
  },
  toolbar: {
    show: false
  }
},
colors : ['#075101', '#0534AD'],
dataLabels: {
  enabled: true,
},
stroke: {
  curve: 'smooth'
},
title: {
  text: 'Average High & Low Temperature',
  align: 'left'
},
grid: {
  borderColor: '#e7e7e7',
  row: {
    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
    opacity: 0.5
  },
},
markers: {
  size: 1
},
xaxis: {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  title: {
    text: 'Month'
  }
},
yaxis: {
  title: {
    text: 'Temperature'
  },
  min: 5,
  max: 40
},
legend: {
  position: 'top',
  horizontalAlign: 'right',
  floating: true,
  offsetY: -25,
  offsetX: -5
}
};

  
  var ct_chart_Intensity = new ApexCharts(document.querySelector("#ct_chart_Intensity"), options);
  ct_chart_Intensity.render();



  //   ct_business divisions chart js S

  var options = {
    dataLabels: {
        enabled: false
      },
      legend: {
        show: true
      },
    colors : ['#213D49', '#46A5CD'],
    series: [{
        name: 'Type 1',
    data: [44, 55, 41, 64, 22, 43, 21, 43, 21]
  }, {
    name: 'Type 2',
    data: [53, 32, 33, 52, 13, 44, 32, 44, 32]
  }],
    chart: {
    type: 'bar',
    height: 430
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        position: 'top',
      },
    }
  },
  dataLabels: {
    enabled: true,
    offsetX: -6,
    style: {
      fontSize: '12px',
      colors: ['#fff']
    }
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['#fff']
  },
  tooltip: {
    shared: true,
    intersect: false
  },
  xaxis: {
    categories: [0, 1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75, 10],
  },
  
  };

  var ct_business_divisions = new ApexCharts(document.querySelector("#ct_business_divisions"), options);
  ct_business_divisions.render();


  // ct_emission_pie chart s


  var options = {
    dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
    colors : ['#F3722C', '#0068F2', '#F8961E','#90BE6D',],
    labels: ['Vehicles', 'Technologies', 'Building', 'Manufacturing'],

    series: [44, 55, 41, 15],
    chart: {
        width: '72%',
    type: 'donut',
  },
  responsive: [{
    breakpoint: 767,
    options: {
      chart: {
        width: 100
      },
     
    }
  }]
  };

  var ct_emission_pie = new ApexCharts(document.querySelector("#ct_emission_pie"), options);
  ct_emission_pie.render();




//   ct_net_zeo_donut S

  var options = {
    dataLabels: {
        enabled: true
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
    colors : ['#DC6B52', '#17B4B4'],
    series: [44, 55],
    chart: {
    width: 360,
    height:900,
    type: 'donut',
  },
  
  labels: ['Reductions 1', 'Emissions'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 260
      },
      
    }
  }]
  };

  var ct_net_zeo_donut = new ApexCharts(document.querySelector("#ct_net_zeo_donut"), options);
  ct_net_zeo_donut.render();



//   previous year donut S


var options = {
    dataLabels: {
        enabled: false
      },
    series: [44, 55, 13],
    chart: {
    // width: 380,
    width: '250',
    type: 'pie',
  },
  legend: {
    show: true,
    position: 'bottom',
    offsetY: 0
  },
  colors : ['#213D49', '#46A5CD', '#FFD914'],
  labels: ['Scope 1', 'Scope 2', 'Scope 3'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
     
    }
  }]
  };

  var previous_year_donut = new ApexCharts(document.querySelector("#previous_year_donut"), options);
  previous_year_donut.render();


// revenue chart S


  var options = {
    dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
    colors : ['#959F27', '#90BE6D','#1472FF'],
    series: [{
    name: "Organisation's activities",
    data: [44, 55, 41, 67]
  }, {
    name: "Electricity use",
    data: [13, 23, 20, 8]
  }, {
    name: "Purchase of goods & services",
    data: [11, 17, 15, 15]
 
  }],
    chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    toolbar: {
      show: true
    },
    zoom: {
      enabled: true
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom',
        offsetX: -10,
        offsetY: 0
      }
    }
  }],
 
  plotOptions: {
    bar: {
        columnWidth: '15%',
      horizontal: false,
      borderRadius: 0,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: '13px',
            fontWeight: 900
          }
        }
      }
    },
  },

  xaxis: {
    categories: ['Energy','Utilities','Materials','Industrials']
  },
  legend: {
    position: 'top',
    offsetY: 0
  },
  fill: {
    opacity: 1
  }
  };

  var ct_revenue = new ApexCharts(document.querySelector("#ct_revenue"), options);
  ct_revenue.render();



// carbon footprint S


var options = {
    series: [{
    name: 'Carbon Footprint',
    data: [1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88, 13.07,
      5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03, -54.4, -47.2, -43.3, -18.6, -
      48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4
    ]
  }],
    chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      colors: {
        ranges: [{
          from: -100,
          to: -46,
          color: '#F94144'
        }, {
          from: -45,
          to: 0,
          color: '#90BE6D'
        }, {
            from: -40,
            to: 0,
            color: '#2D9CDB'
        }]
      },
      columnWidth: '25%',
    }
  },
  dataLabels: {
    enabled: false,
  },
  yaxis: {
   
    labels: {
      formatter: function (y) {
        return y.toFixed(0) + "%";
      }
    }
  },
  xaxis: {
    type: 'datetime',
    categories: [
      '2011-01-01', '2011-02-01', '2011-03-01', '2011-04-01', '2011-05-01', '2011-06-01',
      '2011-07-01', '2011-08-01', '2011-09-01', '2011-10-01', '2011-11-01', '2011-12-01',
      '2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01',
      '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01',
      '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', '2013-06-01',
      '2013-07-01', '2013-08-01', '2013-09-01'
    ],
    labels: {
      rotate: -90
    }
  }
  };

  var carbon_footprint = new ApexCharts(document.querySelector("#carbon_footprint"), options);
  carbon_footprint.render();



//   scope_wise chart s


var options = {
    series: [{
    name: 'Scope 1',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
  }, {
    name: 'Scope 2',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
  }, {
    name: 'Scope 3',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
  }],
    chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  colors : ['#C58D1F', '#47811B','#974826'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['2016', '2017', '2018', '2019'],
  },
 
  fill: {
    opacity: 1
  },
 
  };

  var scope_wise_emission = new ApexCharts(document.querySelector("#scope_wise_emission"), options);
  scope_wise_emission.render();



  // Enery Type chat S




  var options = {
    dataLabels: {
        enabled: true
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
    colors : ['#786DBE', '#1A4D8F','#1A4D8F','#FFBC1C'],
    series: [44, 55,12,30],
    chart: {
    width: 360,
    height:900,
    type: 'donut',
  },
  
  labels: ['Reductions 1', 'Emissions'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 260
      },
      
    }
  }]
  };

  var energy_type = new ApexCharts(document.querySelector("#energy_type"), options);
  energy_type.render();






  var options = {
    colors : ['#213D49'],
    series: [{
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
  }],
    chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      borderRadius: 0,
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Adobe', 'Apple', 'Google', 'Open AI', 'Aramco', 'Sony', 'Dell',
      'United States', 'China', 'Germany'
    ],
  }
  };

  var emission_by_vendor = new ApexCharts(document.querySelector("#emission_by_vendor"), options);
  emission_by_vendor.render();



   // ct_emission by_travel Type chat S




   var options = {
    dataLabels: {
        enabled: true
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
    colors : ['#90BE6D', '#0068F2','#F8961E','#F9C74F'],
    series: [44, 55,12,30],
    chart: {
    width: 360,
    height:900,
    type: 'donut',
  },
  
  labels: ['Air travel', 'Ground travel','Rental car','Hotel stay'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 260
      },
      
    }
  }]
  };

  var ct_emission_by_travel = new ApexCharts(document.querySelector("#ct_emission_by_travel"), options);
  ct_emission_by_travel.render();





  var options = {
    dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
    colors : ['#F3722C', '#0068F2','#FFD914'],
    series: [44, 55,12],
    chart: {
    width: 360,
    height:900,
    type: 'donut',
  },
  
  labels: ['EMEA Sale', 'apac Sales','etc'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 260
      },
      
    }
  }]
  };

  var ct_cost_center = new ApexCharts(document.querySelector("#ct_cost_center"), options);
  ct_cost_center.render();







  var options = {
    series: [{
    name: 'Total Usage',
    data: [31, 40, 28, 51, 42, 109, 100]
  
  }],
  colors : ['#0534AD'],
    chart: {
    height: 350,
    type: 'area'
  },
  dataLabels: {
    enabled: true
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'datetime',
    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm'
    },
  },
  };
  var ct_emission_by_month = new ApexCharts(document.querySelector("#ct_emission_by_month"), options);
  ct_emission_by_month.render();





  

  var options = {
    dataLabels: {
        enabled: true
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
    colors : ['#246377', '#009087','#002828','#F9C74F'],
    series: [44, 55,12,30],
    chart: {
    width: 360,
    height:900,
    type: 'donut',
  },
  
  labels: ['New York', 'Mumbai','Dubai','Bangkok'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 260
      },
      
    }
  }]
  };

  var By_employee_location = new ApexCharts(document.querySelector("#By_employee_location"), options);
  By_employee_location.render();





  

   
 





  



