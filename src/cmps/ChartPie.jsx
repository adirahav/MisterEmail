import React from 'react';
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export function ChartPie({info}) {

  const [chartInfo, setChartInfo] = useState(null);

  const backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ];

  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  useEffect(() => {
    setChartInfo({
      labels: info.labels,
      datasets: [
        {
          label: info.label,
          data: info.data,
          backgroundColor: backgroundColor.slice(0, info.data.length),
          borderColor: borderColor.slice(0, info.data.length),
          borderWidth: 1,
        },
      ],
    });
  }, [info]);

 

  return (<>
    {chartInfo && <Pie data={chartInfo} />}
  </>);
}
