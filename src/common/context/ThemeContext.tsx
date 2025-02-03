import { createContext, useEffect, useState, type ReactNode } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (_theme: string) => {},
});

export default function ThemeContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setTheme(preferredTheme);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const themeListener = (e: any) => {
      setTheme(e.matches ? "dark" : "light");
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", themeListener);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", themeListener);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={`${
          theme === "dark" ? "dark" : ""
        }relative min-h-screen bg-dark-color `}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
