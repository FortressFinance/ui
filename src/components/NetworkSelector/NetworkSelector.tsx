import { mainnetFork, SupportedChain } from "@/constant/chains"
import { DEFAULT_CHAIN } from "@/constant/env"
import { Menu, Transition } from "@headlessui/react"
import { FC, Fragment, SVGProps, useState } from "react"
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { arbitrum } from "wagmi/dist/chains"

type NetworkSelectorProps = {
  className?: string
}

const NetworkSelector: FC<NetworkSelectorProps> = ({ className }) => {
  const defaultChainIndex = SupportedChain.indexOf(DEFAULT_CHAIN)
  const [selected, setSelected] = useState(SupportedChain[defaultChainIndex === -1 ? 0 : defaultChainIndex])

  const changeNetwork: MouseEventHandler<HTMLButtonElement> = (e, currentChain) => {
    if(currentChain !== undefined){
      setSelected(currentChain)
    }
  }

  return (
    <div className="min-w-30 text-right mr-3">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-medium font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {selected.id === mainnetFork.id ? (
              <EthereumIcon
                className="mr-2 h-5 w-5"
                aria-hidden="true"
              />
            ) : (
              <ArbitrumIcon
                className="mr-2 h-5 w-5"
                aria-hidden="true"
              />
            )}
            {selected.name}
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-[#F0707B] text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {SupportedChain.map((chain, index) => (
                  <Menu.Item key={index} as={Fragment} disabled={chain.id === selected.id}>
                    {({ active, disabled }) => (
                      <button
                        onClick={(e) => changeNetwork(e, chain)}
                        className={`${
                          active ? 'bg-[#00000060]' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-medium`}
                      >
                        {chain.id === mainnetFork.id ? (
                          <EthereumIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true" />
                        ) : (
                          <ArbitrumIcon
                          className="mr-2 h-5 w-5"
                          aria-hidden="true" />
                        )}
                        {chain.name}
                        {disabled ? (
                          <div className="fixed right-2 top-2">
                            <div className="py-3 w-5 h-5 flex justify-center align-middle">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        ) : null}
                      </button>
                    )}
                  </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

function EthereumIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 32 32"><g fill="none" fillRule="evenodd"><circle cx="16" cy="16" r="16" fill="#627EEA" /><g fill="#FFF" fillRule="nonzero"><path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" /><path d="M16.498 4L9 16.22l7.498-3.35z" /><path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" /><path d="M16.498 27.995v-6.028L9 17.616z" /><path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" /><path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z" /></g></g></svg>
  )
}

function ArbitrumIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470.287 514.251" enableBackground="new 0 0 470.287 514.251">
      <g id="Background">
      </g>
      <g id="Logos_and_symbols">
        <g id="SYMBOL_VER_3">
        </g>
        <g id="SYMBOL_VER_3_3_">
        </g>
        <g id="SYMBOL_VER_4">
        </g>
        <g id="SYMBOL_VER_4_1_">
          <g id="SYMBOL_VER_4_3_">
          </g>
        </g>
        <g id="SYMBOL_VER_5_1_">
        </g>
        <g id="off_2_1_">
        </g>
        <g id="VER_3_1_">
          <g id="SYMBOL_VER_2_1_">
          </g>
        </g>
        <g id="VER_3">
          <g id="SYMBOL_VER_2">
          </g>
        </g>
        <g id="off_2">
        </g>
        <g id="SYMBOL_VER_5">
        </g>
        <g id="SYMBOL_VER_1">
        </g>
        <g id="SYMBOL_VER_1_1_">
        </g>
        <g id="SYMBOL_VER_1-1_3_">
        </g>
        <g id="SYMBOL_VER_1-1_2_">
        </g>
        <g id="SYMBOL_VER_1-1">
        </g>
        <g id="SYMBOL_VER_1-1_1_">
          <g id="_x31_-3">
          </g>
          <g id="Symbol_-_Original_14_">
            <path fill="#2D374B" d="M291.134,237.469l35.654-60.5l96.103,149.684l0.046,28.727l-0.313-197.672
              c-0.228-4.832-2.794-9.252-6.887-11.859L242.715,46.324c-4.045-1.99-9.18-1.967-13.22,0.063c-0.546,0.272-1.06,0.57-1.548,0.895
              l-0.604,0.379L59.399,144.983l-0.651,0.296c-0.838,0.385-1.686,0.875-2.48,1.444c-3.185,2.283-5.299,5.66-5.983,9.448
              c-0.103,0.574-0.179,1.158-0.214,1.749l0.264,161.083l89.515-138.745c11.271-18.397,35.825-24.323,58.62-24.001l26.753,0.706
              L67.588,409.765l18.582,10.697L245.692,157.22l70.51-0.256L157.091,426.849l66.306,38.138l7.922,4.556
              c3.351,1.362,7.302,1.431,10.681,0.21l175.453-101.678l-33.544,19.438L291.134,237.469z M304.736,433.395l-66.969-105.108
              l40.881-69.371l87.952,138.628L304.736,433.395z"/>
            <polygon fill="#28A0F0" points="237.768,328.286 304.736,433.395 366.601,397.543 278.648,258.915 			" />
            <path fill="#28A0F0" d="M422.937,355.379l-0.046-28.727l-96.103-149.684l-35.654,60.5l92.774,150.043l33.544-19.438
              c3.29-2.673,5.281-6.594,5.49-10.825L422.937,355.379z"/>
            <path fill="#FFFFFF" d="M20.219,382.469l47.369,27.296l157.634-252.801l-26.753-0.706c-22.795-0.322-47.35,5.604-58.62,24.001
              L50.334,319.004l-30.115,46.271V382.469z"/>
            <polygon fill="#FFFFFF" points="316.202,156.964 245.692,157.22 86.17,420.462 141.928,452.565 157.091,426.849 			" />
            <path fill="#96BEDC" d="M452.65,156.601c-0.59-14.746-8.574-28.245-21.08-36.104L256.28,19.692
              c-12.371-6.229-27.825-6.237-40.218-0.004c-1.465,0.739-170.465,98.752-170.465,98.752c-2.339,1.122-4.592,2.458-6.711,3.975
              c-11.164,8.001-17.969,20.435-18.668,34.095v208.765l30.115-46.271L50.07,157.921c0.035-0.589,0.109-1.169,0.214-1.741
              c0.681-3.79,2.797-7.171,5.983-9.456c0.795-0.569,172.682-100.064,173.228-100.337c4.04-2.029,9.175-2.053,13.22-0.063
              l173.022,99.523c4.093,2.607,6.659,7.027,6.887,11.859v199.542c-0.209,4.231-1.882,8.152-5.172,10.825l-33.544,19.438
              l-17.308,10.031l-61.864,35.852l-62.737,36.357c-3.379,1.221-7.33,1.152-10.681-0.21l-74.228-42.693l-15.163,25.717
              l66.706,38.406c2.206,1.255,4.171,2.367,5.784,3.272c2.497,1.4,4.199,2.337,4.8,2.629c4.741,2.303,11.563,3.643,17.71,3.643
              c5.636,0,11.132-1.035,16.332-3.072l182.225-105.531c10.459-8.104,16.612-20.325,17.166-33.564V156.601z"/>
          </g>
          <g id="Symbol_-_Original_13_">
          </g>
          <g id="Symbol_-_Original_6_">
          </g>
          <g id="Symbol_-_Original_4_">
          </g>
          <g id="One_color_version_-_White_3_">
            <g id="Symbol_-_Original_15_">
            </g>
          </g>
          <g id="One_color_version_-_White">
            <g id="Symbol_-_Original">
            </g>
          </g>
          <g id="Symbol_-_Monochromatic_3_">
            <g id="_x33__7_">
            </g>
          </g>
          <g id="Symbol_-_Monochromatic">
            <g id="_x33__3_">
            </g>
          </g>
          <g id="_x33__2_">
          </g>
          <g id="_x33__1_">
          </g>
          <g id="_x33_">
          </g>
          <g id="Symbol_-_Original_10_">
          </g>
          <g id="Symbol_-_Original_1_">
          </g>
          <g id="Symbol_-_Original_2_">
          </g>
          <g id="_x34__1_">
          </g>
          <g id="Symbol_-_Monochromatic_2_">
            <g id="_x33__6_">
            </g>
          </g>
          <g id="One_color_version_-_White_2_">
            <g id="Symbol_-_Original_11_">
            </g>
          </g>
          <g id="Symbol_-_Original_5_">
            <g id="Symbol_-_Original_12_">
            </g>
          </g>
          <g id="One_color_version_-_White_1_">
            <g id="Symbol_-_Original_9_">
            </g>
          </g>
        </g>
        <g id="SYMBOL_VER_1_2_">
          <g id="SYMBOL_VER_2_4_">
          </g>
          <g id="SYMBOL_VER_2-1-1_1_">
          </g>
          <g id="SYMBOL_VER_2-2-1_1_">
          </g>
          <g id="SYMBOL_VER_2-3-1_4_">
          </g>
          <g id="New_Symbol_1_">
            <g id="SYMBOL_VER_2-3-1_3_">
            </g>
          </g>
          <g id="New_Symbol">
            <g id="SYMBOL_VER_2-3-1_1_">
            </g>
          </g>
        </g>
        <g id="SYMBOL_VER_2_2_">
        </g>
        <g id="SYMBOL_VER_4_2_">
        </g>
        <g id="SYMBOL_VER_3_2_">
        </g>
        <g id="SYMBOL_VER_3_1_">
        </g>
        <g id="SYMBOL_VER_1-1-1_1_">
        </g>
        <g id="SYMBOL_VER_1-1-1">
        </g>
        <g id="SYMBOL_VER_1-1-1_2_2_">
        </g>
        <g id="SYMBOL_VER_1-1-1_2">
        </g>
        <g id="SYMBOL_VER_1-1-1_2_1_">
        </g>
        <g id="Symbol_-_Original_7_">
        </g>
        <g id="Symbol_-_Original_8_">
        </g>
        <g id="SYMBOL_VER_2-1-1">
        </g>
        <g id="SYMBOL_VER_2-2-1">
        </g>
        <g id="SYMBOL_VER_2-3-1">
        </g>
        <g id="SYMBOL_VER_5-1_1_">
        </g>
        <g id="SYMBOL_VER_5-1">
        </g>
        <g id="SYMBOL_VER_5-2_1_">
        </g>
        <g id="SYMBOL_VER_5-2">
        </g>
        <g id="Symbol_-_Monochromatic_1_">
          <g id="_x33__4_">
          </g>
        </g>
      </g>
    </svg>
  )
}

export default NetworkSelector