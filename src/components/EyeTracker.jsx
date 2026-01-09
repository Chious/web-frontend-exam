import { useState, useEffect, useRef } from "react";
import style from "./EyeTracker.module.scss";
import leftEye from "@/assets/LeftEye-01.svg?w=32&h=auto&format=webp";
import rightEye from "@/assets/RightEye-01.svg?w=32&h=auto&format=webp";
import character from "@/assets/Character-01.png?w=1097&h=823&format=webp";

export default function EyeTracker() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = (eyeRef) => {
    if (!eyeRef || !eyeRef.current) return { x: 0, y: 0 };

    const eyeRect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    // 計算鼠標相對於眼睛中心的角度
    const angle = Math.atan2(mousePos.y - eyeCenterY, mousePos.x - eyeCenterX);

    // 瞳孔移動的最大距離（眼白半徑 - 瞳孔半徑）
    const maxDistance = 2;

    return {
      x: Math.cos(angle) * maxDistance,
      y: Math.sin(angle) * maxDistance,
    };
  };

  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  const leftPupilPos = calculatePupilPosition(leftEyeRef);
  const rightPupilPos = calculatePupilPosition(rightEyeRef);

  return (
    <div className={`${style.eyesContainer}`}>
      <img src={character} alt="character" className={style.character} />
      {/* 左眼 */}
      <div ref={leftEyeRef} className={`${style.eye} ${style.leftEye}`}>
        {/* 瞳孔 */}
        <img
          src={leftEye}
          alt="left eye"
          width={32}
          height={32}
          style={{
            transform: `translate(calc(-50% + ${leftPupilPos.x}px), calc(-50% + ${leftPupilPos.y}px))`,
          }}
        />
      </div>

      {/* 右眼 */}
      <div ref={rightEyeRef} className={`${style.eye} ${style.rightEye}`}>
        {/* 瞳孔 */}
        <img
          src={rightEye}
          alt="right eye"
          width={32}
          height={32}
          style={{
            transform: `translate(calc(-50% + ${rightPupilPos.x}px), calc(-50% + ${rightPupilPos.y}px))`,
          }}
        />
      </div>
    </div>
  );
}
