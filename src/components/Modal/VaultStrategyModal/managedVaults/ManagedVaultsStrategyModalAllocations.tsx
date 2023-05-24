import { ArcElement, Chart as ChartJS, Colors, Legend, Tooltip } from "chart.js"
import { FC, Fragment } from "react"
import { Doughnut } from "react-chartjs-2"

import { formatPercentage } from "@/lib/helpers"

import { AssetLogo } from "@/components/Asset"

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

export const ManagedVaultsStrategyModalAllocations: FC = () => {
  const address = "0xadAD55f56C23cF8B1286A3419bFeed055F1aDcb0"
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255,99,132,0.2)",
          "rgba(54,162,235,0.2)",
          "rgba(255,206,86,0.2)",
          "rgba(75,192,192,0.2)",
          "rgba(153,102,255,0.2)",
          "rgba(255,159,64,0.2)",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
          "rgba(75,192,192,1)",
          "rgba(153,102,255,1)",
          "rgba(255,159,64,1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const sumTotal = data.datasets?.[0]?.data.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  )

  return (
    <div className="grid w-full grid-cols-1 grid-rows-[auto,1fr]">
      <Doughnut data={data} options={options} className="w-full" />
      <div className="grid grid-cols-[20px,auto,1fr] gap-1.5">
        {data.labels?.map((label, i) => (
          <Fragment key={`legend-${i}`}>
            <div
              className="gr mt-1 h-4 w-4 border"
              style={{
                borderColor: `${data.datasets?.[0].borderColor[i]}`,
                backgroundColor: `${data.datasets?.[0].backgroundColor[i]}`,
              }}
            ></div>
            <div>
              <div className="relative float-left mr-2 h-6 w-6 rounded-full bg-white">
                <AssetLogo tokenAddress={address} />
              </div>
              <span className="text-left text-xs uppercase text-pink-50">
                {label}
              </span>
            </div>
            <span className="mt-1 text-right text-xs text-pink-50">
              {formatPercentage(
                (data.datasets?.[0]?.data?.[i] * 100) / sumTotal / 100
              )}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
