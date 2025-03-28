import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function forceNumberInput(
  value: string,
  setValue: (valueNum: number) => void
) {
  const valueNum = parseInt(value);
  if (isNaN(valueNum)) {
    setValue(0);
  } else {
    setValue(valueNum);
  }
}