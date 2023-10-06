"use client";

import { useState, useCallback, useRef, FC } from "react";
import { useEventListener } from "usehooks-ts";
import "@/styles/eye.css";

type MouseCoordinates = {
  x: number;
  y: number;
};

type ClientCoordinates = {
  clientX: number;
  clientY: number;
};

type EyeProps = {
  mouseCoordinates: MouseCoordinates;
};

export default function Eye() {
  const [mouseCoordinates, setMouseCoordinates] = useState<MouseCoordinates>({
    x: 0,
    y: 0,
  });

  const handler = useCallback<
    ({ clientX, clientY }: ClientCoordinates) => void
  >(
    ({ clientX, clientY }) => {
      setMouseCoordinates({ x: clientX, y: clientY });
    },
    [setMouseCoordinates]
  );

  useEventListener("mousemove", handler);

  return (
    <div className="mouse-area">
      <Eyes
        mouseCoordinates={mouseCoordinates}
        style={{
          left: "calc(50% - 50px)",
          top: "calc(50% - 50px)",
        }}
      />
    </div>
  );
}

const Eyes: FC<EyeProps & any> = ({ mouseCoordinates, ...rest }) => {
  const eyesRef = useRef<HTMLElement>();

  const getEyeStyle = () => {
    if (eyesRef.current) {
      const left = eyesRef.current.getBoundingClientRect().left;
      const top = eyesRef.current.getBoundingClientRect().top;

      // distance from eyes to mouse pointer
      const mouseX = mouseCoordinates.x - left;
      const mouseY = mouseCoordinates.y - top;

      const rotationRadians = Math.atan2(mouseX, mouseY);
      const rotationDegrees = rotationRadians * (180 / Math.PI) * -1 + 180;

      return { transform: `rotate(${rotationDegrees}deg)` };
    }
  };

  return (
    <div ref={eyesRef} className="eyes" {...rest}>
      <div className="eye" style={getEyeStyle()} />
      <div className="eye" style={getEyeStyle()} />
    </div>
  );
};
