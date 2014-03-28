var app = {};

app.donutChart = (function() {
    "use strict";

    var extend = function(base, incoming){
        for(var prop in incoming){
            base[prop] = incoming[prop];
        }
    };

    var donutChart = function(params) {
        var defaults = {
            ascending: true,
            easing: "quad-in-out",
            animated: true,
            width: 100,
            height: 100,
            origin: 0,
            padding: 0,
            destination: 360,
            animationComplete: function(){}
        };

        extend(defaults, params);
        extend(this, defaults);

        this.data = this.convertData(this.data);

        this.build();

        return this;
    };

    donutChart.prototype = {
        build: function() {
            var self = this,
                remainder = this.remainder;

            this.outerWidth = this.width + this.padding*2;
            this.outerHeight = this.height + this.padding*2;

            // base arc
            this.baseArc = d3.svg.arc()
                .outerRadius(function(d){
                    return d.outerRadius || self.width / 2;
                })
                .innerRadius(function(d) {
                    return d.innerRadius || self.width / 2;
                })
                .startAngle(function(d, i){
                    return d.startAngleFinal || self.degreesToRadians(self.origin);
                })
                .endAngle(function(d, i) {
                    return d.endAngleFinal || self.degreesToRadians(self.origin);
                });

            if(!this.animated){
                this.baseArc
                    .innerRadius(this.width / 2 - this.thickness)
                    .startAngle(function(d, i){
                        return d.startAngle || self.degreesToRadians(self.origin);
                    })
                    .endAngle(function(d, i) {
                        return d.endAngle || self.degreesToRadians(self.origin);
                    });
            }

            this.chartWrap = d3.select(this.container).append("div")
                .attr("class", "chart-wrap")
                .attr("id", this.id || null);

            this.chartSVG = this.chartWrap
                .append("svg:svg")
                .attr("width", this.outerWidth)
                .attr("height", this.outerHeight);

            // create background group and append single arc to it
            this.backgroundGroup = this.chartSVG
                .append("svg:g")
                .attr("transform", "translate(" + parseInt(this.width / 2 + this.padding) + "," + parseInt(this.height / 2 + this.padding) + ")");
                
            this.backgroundArc = this.backgroundGroup
                .append("svg:path")
                .datum({
                    startAngleFinal: this.degreesToRadians(this.origin),
                    endAngleFinal: this.degreesToRadians(this.destination)
                })
                .style("fill", this.bgColor || "#ebeff6")
                .attr("d", this.baseArc);

            // create a group for the meaningful data points
            this.dataGroup = this.chartSVG
                .append("svg:g")
                .attr("transform", "translate(" + parseInt(this.width / 2 + this.padding) + "," + parseInt(this.height / 2 + this.padding) + ")");
                
            this.slices = this.dataGroup
                .selectAll("path")
                .data(this.data)
                .enter()
                .append("svg:g")
                .attr("class", "slice");

            this.arcs = this.slices
                .append("svg:path")
                .style("fill", function(d, i) {
                    return d.color;
                })
                .attr("d", this.baseArc);

            // hook
            if (this.buildComplete && typeof this.buildComplete === "function") {
                this.buildComplete.call(this);
            }

            if (this.animated) {
                this.applyAnimation();
            }
        },
        globalTransition: function(f) {
            var self = this;
            d3.transition().delay(500).duration(1000).ease(this.easing)
                .each(f)
                .each("end", function(){
                    self.animationComplete.call(self);
                });
        },
        applyAnimation: function() {
            var self = this;
            this.globalTransition(function() {

                var originAngle = self.degreesToRadians(self.origin),
                    radiusInterpolate = d3.interpolate(0, self.thickness);

                // progress arc, both endAngle and thickness
                self.arcs.transition().attrTween("d", function(d) {
                    var iStart = d3.interpolate(originAngle, d.startAngle),
                        iEnd = d3.interpolate(originAngle, d.endAngle);
                    return function(t) {
                        d.startAngleFinal = iStart(t);
                        d.endAngleFinal = iEnd(t);
                        d.innerRadius = self.width / 2 - radiusInterpolate(t);
                        return self.baseArc(d);
                    };
                });

                // background arc thickness only
                self.backgroundArc.transition().attrTween("d", function(d) {
                    return function(t) {
                        d.innerRadius = self.width / 2 - radiusInterpolate(t);
                        return self.baseArc(d);
                    };
                });

            });
        },
        degreesToRadians: function(degrees) {
            return degrees * Math.PI / 180;
        },
        convertData: function(data) {
            var startAngle = this.degreesToRadians(this.origin),
                endAngle,
                remainder = data.total,
                item, lastItem, val,
                r = [];

            for (var i = 0; i < data.values.length; i++) {
                val = data.values[i];
                endAngle = startAngle + this.degreesToRadians(val.n / data.total * (this.destination - this.origin));
                item = {
                    startAngle: startAngle,
                    endAngle: endAngle,
                    color: val.color,
                    percent: Math.round(val.n / data.total),
                    n: val.n
                };
                startAngle = endAngle;
                remainder -= val.n;
                r.push(item);
            }
            this.total = data.total;
            this.remainder = remainder;

            return r;
        }

    };

    return donutChart;

})();