import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const AmsChart5 = ({ data }) => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    series.data.setAll(data);

    series.appear(1000, 100);

    return () => root.dispose();
  }, [data]);

  return <div id="chartdiv" ref={chartRef} style={{ width: "100%", height: "200px" }} />;
};

export default AmsChart5;
