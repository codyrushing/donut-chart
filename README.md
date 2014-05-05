# Animated donut charts
===========
[D3](http://d3js.org) donut charts have been done before, but I wasn't able to find one that had all the features I needed, namely layout control, extendibility, partial donuts, multiple data points, transitions with custom callbacks, etc.  So I went ahead and made one.

## The data
Donut charts are usually used to represent one or more data points that are part of some whole.  This is how you would structure the data for a donut chart:

	var data = {
		total: 70000,
	    values: [{
	        n: 40125,
	        color: "#6dab42"
	    }, {
	        n: 10000,
	        color: "#ff0000"
	    }, {
	        n: 5000,
	        color: "#0000ff"
	    }, {
	        n: 5000,
	        color: "#ffff00"
	    }, {
	        n: 3000,
	        color: "#f92a39"
	    }]
	};

Where 70000 is the ``total``, and the ``values`` key holds one or more data points.  For each point, ``n`` is the value and ``color`` is a hexadecimal color for that data point's arc.

## Usage

	var simpleChart = new donutChart({
	    container: "#simple",
	    data: {
	        total: 70000,
	        values: [{
	            n: 40125,
	            color: "#6dab42"
	        }, {
	            n: 10000,
	            color: "#ff0000"
	        }, {
	            n: 5000,
	            color: "#0000ff"
	        }, {
	            n: 5000,
	            color: "#ffff00"
	        }, {
	            n: 3000,
	            color: "#f92a39"
	        }]
	    }
	});

This is a simple example, see the examples.html page for more.

## Options

* **height**: *number* (default: 100) - in px
* **width**: *number* (default: 100) - in px
* **thickness**: *number* (default: 10) - the thickness of the donut in px
* **padding**: *number* (default: 0) - amount of space between the donut and the edge of the svg element
* **buildComplete**: *function* - generic callback that is executed after all DOM elements are created.  This is where you would attach event handlers, add labels, etc.  Scope is donutChart object instance.
* **origin** : *number* (default: 0) - angle at which the donut chart begins (in degrees).  Change this and/or destination to create partial donuts.
* **destination** : *number* (default: 360) - angle at which the donut chart ends (in degrees).  Change this and/or origin to create partial donuts.
* **useTransition**: *boolean* (default: true) - whether or not to show the donut chart using a transition
* **transitionDelay**: *number* (default: 500) - amount of time to delay the transition (in ms).
* **transitionDuration**: *number* (default: 1000) - (in ms).
* **tweenThickness**: *boolean* (default: true) - whether or not to transition the donut thickness.  Set this to false in order to only transition the angles of the donut arcs.
* **tweenAngle**: *boolean* (default: true) - whether or not to transition the donut angles.  Set this to false in order to only transition the thickness of the donut arcs.
* **transitionComplete**: *function* - generic callback that is executed when the transition completes.  Scope is donutChart object instance.