import { memo, useEffect, useRef } from "react";

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = ""; // 👈 Important: remove previous script/widget
    }
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
  {
    "autosize": true,
    "symbol": "BINANCE:BNBUSDT",
    "interval": "D",
    "timezone": "Asia/Ho_Chi_Minh",
    "theme": "light",
    "style": "3",
    "locale": "en",
    "enable_publishing": false,
    "allow_symbol_change": true,
    "hide_top_toolbar": false,
    "withdateranges": true,
    "details": true,
      "hide_top_toolbar": true,
    "hotlist": true,
         "hide_legend": true,
    "calendar": true,
    "support_host": "https://www.tradingview.com"
  }
        `;
    if (container.current) {
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div
      className="tradingview-widget-container bg-white"
      ref={container}
      style={{ height: "60%", width: "50%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
