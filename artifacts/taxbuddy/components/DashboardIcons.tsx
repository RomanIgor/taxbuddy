import React from "react";
import Svg, { Path, Circle, Rect, Line, Polyline, G } from "react-native-svg";

type IconProps = { size?: number; color?: string };

export function IconArrowUp({ size = 22, color = "#16A34A" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 19V5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <Polyline points="5,12 12,5 19,12" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Path d="M5 19h14" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </Svg>
  );
}

export function IconArrowDown({ size = 22, color = "#D97706" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <Polyline points="19,12 12,19 5,12" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Path d="M5 5h14" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </Svg>
  );
}

export function IconCar({ size = 22, color = "#0066B3" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 11l2-5h10l2 5v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="7.5" cy="16.5" r="1.5" fill={color}/>
      <Circle cx="16.5" cy="16.5" r="1.5" fill={color}/>
      <Path d="M5 11h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

export function IconZap({ size = 22, color = "#7C3AED" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconFileText({ size = 22, color = "#0D9488" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <Path d="M14 2v6h6" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      <Line x1="9" y1="13" x2="15" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <Line x1="9" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </Svg>
  );
}

export function IconSliders({ size = 22, color = "#4F46E5" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Line x1="4" y1="18" x2="20" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Circle cx="8" cy="6" r="3" fill={color}/>
      <Circle cx="16" cy="12" r="3" fill={color}/>
      <Circle cx="10" cy="18" r="3" fill={color}/>
    </Svg>
  );
}

export function IconTrendingUp({ size = 22, color = "#0066B3" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Polyline points="17,6 23,6 23,12" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </Svg>
  );
}

export function IconUpload({ size = 22, color = "#0284C7" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <Polyline points="17,8 12,3 7,8" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    </Svg>
  );
}

export function IconUser({ size = 20, color = "#0F172A" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none"/>
      <Path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </Svg>
  );
}

export function IconInfo({ size = 18, color = "#ffffff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
      <Line x1="12" y1="8" x2="12" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <Line x1="12" y1="12" x2="12" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}
