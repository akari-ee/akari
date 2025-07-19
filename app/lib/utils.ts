import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜를 지정된 포맷으로 변환 (기본값: 'MMM.dd, yyyy')
 * @param date 날짜 문자열 또는 Date 객체
 * @param dateFormat date-fns 포맷 문자열 (기본값: 'MMM.dd, yyyy')
 * @returns 포맷된 날짜 문자열 (대문자)
 */
export function formatDate(date: string | Date, dateFormat = "MMM.dd, yyyy") {
  if (!date) return "";
  try {
    return format(new Date(date), dateFormat).toUpperCase();
  } catch {
    return "";
  }
}
