export function getThemeData(): Record<string, unknown> | null {
  const storedThemeData = localStorage.getItem("themeData");
  return storedThemeData ? JSON.parse(storedThemeData) : null;
}

export function setThemeData(themeData: Record<string, unknown>): void {
  localStorage.setItem("themeData", JSON.stringify(themeData));
}
