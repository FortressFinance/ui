import { FC } from "react"

const AnimatedBackground: FC = () => {
  return (
    <>
      <video className="object-cover sm:hidden" autoPlay playsInline muted loop>
        <source src="/images/background/640x480.mp4" type="video/mp4" />
        <source src="/images/background/640x480.webm" type="video/webm" />
      </video>
      <video
        className="object-cover max-sm:hidden md:hidden"
        autoPlay
        playsInline
        muted
        loop
      >
        <source src="/images/background/1280x720.mp4" type="video/mp4" />
        <source src="/images/background/1280x720.webm" type="video/webm" />
      </video>
      <video
        className="object-cover max-md:hidden 2xl:hidden"
        autoPlay
        playsInline
        muted
        loop
      >
        <source src="/images/background/1920x1080.mp4" type="video/mp4" />
        <source src="/images/background/1920x1080.webm" type="video/webm" />
      </video>
      <video
        className="object-cover max-2xl:hidden 4xl:hidden"
        autoPlay
        playsInline
        muted
        loop
      >
        <source src="/images/background/2560x1440.mp4" type="video/mp4" />
        <source src="/images/background/2560x1440.webm" type="video/webm" />
      </video>
      <video
        className="object-cover max-4xl:hidden"
        autoPlay
        playsInline
        muted
        loop
      >
        <source src="/images/background/3840x2160.mp4" type="video/mp4" />
        <source src="/images/background/3840x2160.webm" type="video/webm" />
      </video>
    </>
  )
}

export default AnimatedBackground
