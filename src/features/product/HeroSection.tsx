import { BiRefresh } from "react-icons/bi";
import DonutChart from "../../page/component/Chart";

export function HeroSection() {
  return (
    <div className="flex h-40 md:h-80 xl:h-96">
      <div className="flex flex-col lg:h-96 justify-center w-1/2 px-10 gap-2">
        <span className="text-2xl lg:text-7xl font-bold text-white">
          Passion & love for Natural-beauty
        </span>
        <div className="flex gap-4 items-center">
          <div className="p-5 bg-white/20 rounded-full">
            <div className="p-0.25 rounded-full outline outline-white">
              <BiRefresh className="text-white text-2xl" />
            </div>
          </div>
          <span className="text-white opacity-50 text-xl font-medium">
            Browse our craft
          </span>
        </div>
      </div>
      <div className="flex w-1/3 ml-55 overflow-hidden">
        <DonutChart />
      </div>
      {/* <TradingViewWidget/> */}
      {/* <ClicksCpcChart/> */}
    </div>
  );
}
