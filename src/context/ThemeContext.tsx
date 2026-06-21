// import { createContext, useContext, useEffect, useState } from "react";

// type Theme = "light" | "dark" | "system";

// interface ThemeContextValue {
//   theme: Theme;
//   setTheme: (t: Theme) => void;
// }

// const ThemeContext = createContext<ThemeContextValue>({
//   theme: "light",
//   setTheme: () => {},
// });

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setThemeState] = useState<Theme>(
//     () => (localStorage.getItem("tf-theme") as Theme) || "light"
//   );

//   const setTheme = (t: Theme) => {
//     setThemeState(t);
//     localStorage.setItem("tf-theme", t);
//   };

//   useEffect(() => {
//     const apply = (t: Theme) => {
//       const resolved =
//         t === "system"
//           ? window.matchMedia("(prefers-color-scheme: dark)").matches
//             ? "dark"
//             : "light"
//           : t;
//       document.documentElement.setAttribute("data-theme", resolved);
//       document.documentElement.classList.toggle("dark", resolved === "dark");
      
//     };

//     apply(theme);

//     // If system, also listen for OS changes
//     if (theme === "system") {
//       const mq = window.matchMedia("(prefers-color-scheme: dark)");
//       const handler = () => apply("system");
//       mq.addEventListener("change", handler);
//       return () => mq.removeEventListener("change", handler);
//     }
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export const useTheme = () => useContext(ThemeContext);