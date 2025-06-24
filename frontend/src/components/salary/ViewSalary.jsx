import axios from "axios";
import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";

const ViewSalary = () => {
  const { id } = useParams();
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);


  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/salary/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filterSalaries = (q) => {
    const filteredRecords = salaries.filter((leave) =>
      leave.employeeId.toLowerCase().includes(q.toLocaleLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  const chartRef = React.useRef(null);
  const barChartRef = React.useRef(null);

  useEffect(() => {
    let root;

    if (filteredSalaries && filteredSalaries.length > 0) {
      const latest = filteredSalaries[0];

      root = am5.Root.new("salaryChart");

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

      series.data.setAll([
        { category: "Net Salary", value: latest.netSalary },
        { category: "Allowances", value: latest.allowances },
        { category: "Deductions", value: latest.deductions },
      ]);

      series.appear(1000, 100);
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [filteredSalaries]);

  useEffect(() => {
    let root;

    if (filteredSalaries && filteredSalaries.length > 0) {
      root = am5.Root.new("barChart");
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: root.verticalLayout,
        })
      );

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "payDate",
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
          }),
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );

      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Net Salary",
          xAxis,
          yAxis,
          valueYField: "netSalary",
          categoryXField: "payDate",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{categoryX}: ₹{valueY}",
          }),
        })
      );

      const formattedData = filteredSalaries.map((item) => ({
        payDate: new Date(item.payDate).toLocaleDateString(),
        netSalary: item.netSalary,
      }));

      xAxis.data.setAll(formattedData);
      series.data.setAll(formattedData);

      series.appear(1000);
      chart.appear(1000, 100);
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [filteredSalaries]);

  return (
    <>
      {filteredSalaries === null ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto p-6">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800">Salary History</h2>
          </div>

          {filteredSalaries.length > 0 ? (
            <div>
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">SNO</th>
                    <th className="px-6 py-3 text-left">Salary</th>
                    <th className="px-6 py-3 text-left">Allowance</th>
                    <th className="px-6 py-3 text-left">Deduction</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Pay Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-200">
                  {filteredSalaries.map((salary, index) => (
                    <tr
                      key={salary._id}
                      className="hover:bg-teal-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-3">{index + 1}</td>

                      <td className="px-6 py-3">
                        ₹ {salary.basicSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        ₹ {salary.allowances.toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        ₹ {salary.deductions.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-semibold text-green-600">
                        ₹ {salary.netSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        {new Date(salary.payDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mb-8  mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
                  Latest Salary Breakdown
                </h3>
                <div
                  id="salaryChart"
                  ref={chartRef}
                  className="w-full max-w-xl mx-auto"
                  style={{ width: "100%", height: "250px" }}
                ></div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
                  Salary Over Time
                </h3>
                <div
                  id="barChart"
                  ref={barChartRef}
                  className="w-full max-w-4xl mx-auto"
                  style={{ width: "50%", height: "400px" }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No Records Found
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ViewSalary;
