import { ArcElement, Chart as ChartJS, Colors, Legend, Tooltip } from "chart.js"
import { FC } from "react"
import { Doughnut } from "react-chartjs-2"
import { Address } from "wagmi"

import { formatPercentage } from "@/lib/helpers"

import { AssetLogo } from "@/components/Asset"

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

export const ManagedVaultsStrategyModalAllocations: FC = () => {
  const addresses: Address[] = [
    "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
    "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
  ]
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
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
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
      {/* custom tooltip */}
      <div>
        {data.labels?.map((label, i) => (
          <div key={`tooltip-${i}`} data-tooltip={label} className="hidden">
            <div className="relative flex w-[117px] flex-col items-start rounded-[4px] bg-[rgba(191,70,128,0.6)] p-2 backdrop-opacity-[4.5px]">
              <div className="flex h-[24px] w-full flex-none flex-row items-center gap-1 self-stretch p-0">
                <div className="relative mr-2 flex h-6 w-6 rounded-full bg-white">
                  <AssetLogo tokenAddress={addresses[i]} />
                </div>
                <span className="text-left text-sm uppercase text-pink-50">
                  {label}
                </span>
              </div>
              <div className="flex w-full flex-none flex-col items-start p-0">
                <div className="flex h-[24px] w-full flex-none flex-row items-start gap-1 self-stretch p-0">
                  <div className="w-1/2 items-center text-sm font-semibold capitalize text-pink-50">
                    Balance :
                  </div>
                  <div className="w-1/2 items-center text-right text-sm">
                    45K
                  </div>
                </div>
                <div className="flex h-[24px] w-full flex-none flex-row items-start gap-1 self-stretch p-0">
                  <div className="w-1/2 items-center text-sm font-semibold capitalize text-pink-50">
                    Value :
                  </div>
                  <div className="w-1/2 items-center text-right text-sm">
                    45K
                  </div>
                </div>
                <div className="flex h-[24px] w-full flex-none flex-row items-start gap-1 self-stretch p-0">
                  <div className="w-1/2 items-center text-sm font-semibold capitalize text-pink-50">
                    Ratio :
                  </div>
                  <div className="w-1/2 items-center text-right text-sm">
                    {formatPercentage(
                      (data.datasets?.[0]?.data?.[i] * 100) / sumTotal / 100
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-none grow-0 flex-col items-start gap-2 p-0">
        {data.labels?.map((label, i) => (
          <div
            key={`legend-${i}`}
            className="flex h-[24px] w-full flex-none grow-0 flex-row items-center gap-2 self-stretch p-0"
          >
            <div
              className="h-3 w-3 flex-none grow-0 border"
              style={{
                borderColor: `${data.datasets?.[0].borderColor[i]}`,
                backgroundColor: `${data.datasets?.[0].backgroundColor[i]}`,
              }}
            ></div>
            <div className="flex w-[calc(50%-30px)] flex-none grow-0 flex-row items-center gap-1 p-0">
              <div className="relative float-left mr-1 h-6 w-6 rounded-full bg-white">
                <AssetLogo tokenAddress={addresses[i]} />
              </div>
              <span className="text-left text-xs uppercase text-pink-50">
                {label}
              </span>
            </div>
            <div className="grow-1 flex w-1/2 flex-none flex-row items-center gap-1 p-0">
              <div className="w-full text-right text-sm text-pink-50">
                {formatPercentage(
                  (data.datasets?.[0]?.data?.[i] * 100) / sumTotal / 100
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context
  const elements = document.querySelectorAll("[data-tooltip]")
  elements.forEach((element) => {
    const htmlElement = element as HTMLElement
    htmlElement.style.display = "none"
  })

  if (tooltip.opacity !== 0) {
    const titleLines = tooltip.title || []
    const tooltipElts = titleLines.map((title: string) => {
      return chart.canvas.parentNode.querySelector(`[data-tooltip="${title}"]`)
    })

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

    const tooltipElt = tooltipElts?.[0]
    if (!tooltipElt) {
      return
    }
    // Display, position, and set styles for font
    tooltipElt.style.pointerEvents = "none"
    tooltipElt.style.position = "absolute"
    tooltipElt.style.transform = "translate(-50%, 0)"
    tooltipElt.style.transition = "all .1s ease"
    tooltipElt.style.display = "block"
    tooltipElt.style.left = positionX + tooltip.caretX + "px"
    tooltipElt.style.top = positionY + tooltip.caretY + "px"
  }
}
