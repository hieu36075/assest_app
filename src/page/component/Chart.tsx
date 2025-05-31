// components/DonutChart.tsx
import { type ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const DonutChart = () => {
  // const isMobile = useIsMobile();
  const series = [44, 33, 23];
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Desktop", "Tablet", "Mobile"],
    colors: ["#3b82f6", "#10b981", "#f59e0b"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            width: 200,
            height: 210,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      width="100%"
      height="300"
    />
  );
};

export default DonutChart;
