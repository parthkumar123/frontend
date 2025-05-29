import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge
 *
 * @param  {String} inputs - Class names to be merged
 * @return {String} - Merged class names
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
