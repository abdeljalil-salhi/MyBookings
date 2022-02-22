import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./BookingsChart.css";

const BOOKINGS_BUCKETS = {
  Cheap: {
    label: "Cheap",
    min: 0,
    max: 100,
  },
  Normal: {
    label: "Normal",
    min: 100,
    max: 200,
  },
  Expensive: {
    label: "Expensive",
    min: 200,
    max: 10000,
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BookingsChart(props) {
  const chartData = { labels: [], datasets: [] };
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Your depenses",
      },
    },
  };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: BOOKINGS_BUCKETS[bucket].label,
      backgroundColor: "rgba(255, 160, 0, 0.5)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div className="chart__div">
      <div className="chart__canvas">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}

export default BookingsChart;
