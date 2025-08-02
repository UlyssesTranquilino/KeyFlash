import { useTestMode } from "@/context/TestModeContext";
import React from "react";

const UpperMenu = ({ countDown }: { countDown: number }) => {
  const { setTestTime } = useTestMode();

  const updateTime = (e: any) => {
    setTestTime(Number(e.target.id));
  };

  return (
    <div className="upper-menu justify-between">
      <div className="counter">{countDown}</div>

      <div className="modes">
        <div className="time-mode">
          <div className="time-mode" id="15" onClick={updateTime}>
            15s
          </div>
          <div className="time-mode" id="30" onClick={updateTime}>
            30s
          </div>
          <div className="time-mode" id="60" onClick={updateTime}>
            60s
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpperMenu;
