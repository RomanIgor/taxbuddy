import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

type IconProps = { size?: number; color?: string };

export function IconArrowUp({ size = 22, color = "#16A34A" }: IconProps) {
  return <Feather name="arrow-up" size={size} color={color} />;
}

export function IconArrowDown({ size = 22, color = "#D97706" }: IconProps) {
  return <Feather name="arrow-down" size={size} color={color} />;
}

export function IconCar({ size = 22, color = "#0066B3" }: IconProps) {
  return <MaterialCommunityIcons name="car-outline" size={size} color={color} />;
}

export function IconZap({ size = 22, color = "#7C3AED" }: IconProps) {
  return <Feather name="zap" size={size} color={color} />;
}

export function IconFileText({ size = 22, color = "#0D9488" }: IconProps) {
  return <Feather name="file-text" size={size} color={color} />;
}

export function IconSliders({ size = 22, color = "#4F46E5" }: IconProps) {
  return <Feather name="sliders" size={size} color={color} />;
}

export function IconTrendingUp({ size = 22, color = "#0066B3" }: IconProps) {
  return <Feather name="trending-up" size={size} color={color} />;
}

export function IconUpload({ size = 22, color = "#0284C7" }: IconProps) {
  return <Feather name="upload" size={size} color={color} />;
}

export function IconUser({ size = 20, color = "#0F172A" }: IconProps) {
  return <Feather name="user" size={size} color={color} />;
}

export function IconInfo({ size = 18, color = "#ffffff" }: IconProps) {
  return <Feather name="info" size={size} color={color} />;
}
