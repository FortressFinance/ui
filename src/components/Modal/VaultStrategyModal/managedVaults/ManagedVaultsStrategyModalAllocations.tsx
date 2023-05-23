import { ArcElement, Chart as ChartJS, Colors, Legend, Tooltip } from "chart.js"
import { FC } from "react"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

export const ManagedVaultsStrategyModalAllocations: FC = () => {
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        position: "bottom", // Adjust the position of the legend
        align: "start",
        labels: {
          font: {
            size: 14, // Customize the font size
          },
          boxWidth: 20, // Adjust the width of the legend color boxes
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          generateLabels: (chart: any) => {
            const { data } = chart
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, index: number) => {
                const dataset = data.datasets[0]
                const value = dataset.data[index]
                return {
                  text: `${label}: ${value}`,
                  fontColor: "rgb(243,215,229)",
                  fillStyle: dataset.backgroundColor[index],
                  hidden: chart.getDatasetMeta(0).data[index].hidden,
                  lineCap: "round",
                  lineDash: [],
                  lineDashOffset: 0,
                  lineJoin: "round",
                  lineWidth: 1,
                  strokeStyle: dataset.borderColor[index],
                  pointStyle: dataset.pointStyle,
                  rotation: 0,
                }
              })
            }
            return []
          },
        },
      },
    },
  }

  return <Doughnut data={data} options={options} className="w-full" />
}
