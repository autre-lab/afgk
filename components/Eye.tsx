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
  const [eyes, setEyes] = useState([
    {
      left: "calc(50% - 50px)",
      top: "calc(50% - 50px)",
    },
  ]);
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

  const clickHandler = useCallback<
    ({ clientX, clientY }: ClientCoordinates) => void
  >(
    ({ clientX, clientY }) => {
      setEyes(
        eyes.concat({
          left: `calc(${clientX}px - 50px)`,
          top: `calc(${clientY}px - 25px)`,
        })
      );
    },
    [eyes]
  );

  const reset = () => {
    setEyes([]);
  };

  useEventListener("mousemove", handler);
  useEventListener("mousedown", clickHandler);

  return (
    <div className="mouse-area">
      {eyes.map((eye, index) => (
        <Eyes mouseCoordinates={mouseCoordinates} style={eye} key={index} />
      ))}
      <span className="background-text">Click to add googly eyes!</span>
      <button className="clear-button" onClick={reset}>
        CLEAR
      </button>
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
