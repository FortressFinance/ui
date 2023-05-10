import { FC } from "react"
import Countdown, { zeroPad } from "react-countdown"

export const VaultEpoch: FC = () => {
  // Set the target date to count down to
  const targetDate = new Date("2023-06-01T00:00:00")
  // Calculate the remaining time in milliseconds
  const remainingTime = new Date(targetDate).getTime() - Date.now()

  // Renderer function to format the countdown display
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
  }: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }) => (
    <>
      <div className="auto-cols-auto grid-flow-col justify-center max-lg:hidden lg:grid">
        <div className="lg:grid-row-2 lg:grid">
          <div>{zeroPad(days)}</div>
          <div className="text-xs">Ds</div>
        </div>
        <div className="lg:grid-row-2 lg:grid">
          <div>:</div>
          <div></div>
        </div>
        <div className="lg:grid-row-2 lg:grid">
          <div>{zeroPad(hours)}</div>
          <div className="text-xs">Hrs</div>
        </div>
        <div className="lg:grid-row-2 lg:grid">
          <div>:</div>
          <div></div>
        </div>
        <div className="lg:grid-row-2 lg:grid">
          <div>{zeroPad(minutes)}</div>
          <div className="text-xs">Min</div>
        </div>
        <div className="lg:grid-row-2 lg:grid">
          <div>:</div>
          <div></div>
        </div>
        <div className="lg:grid-row-2 lg:grid">
          <div>{zeroPad(seconds)}</div>
          <div className="text-xs">Sec</div>
        </div>
      </div>
      <div className="lg:hidden">
        {days !== 0 ? (
          <div>{zeroPad(days)} Days</div>
        ) : hours !== 0 ? (
          <div>{zeroPad(hours)} Hrs</div>
        ) : minutes !== 0 ? (
          <div>{zeroPad(minutes)} Min</div>
        ) : (
          <div>{zeroPad(seconds)} Sec</div>
        )}
      </div>
    </>
  )
  return <Countdown date={Date.now() + remainingTime} renderer={renderer} />
}
