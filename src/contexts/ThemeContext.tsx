import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("app-theme") as Theme) ?? "dark";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("app-theme", t);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Sincroniza a classe no <body> enquanto o dashboard estiver montado
  // Isso garante que portais do Radix (dialogs, dropdowns, tooltips)
  // herdem o tema correto, já que são renderizados fora da <div> wrapper
  useEffect(() => {
    const opposite = theme === "dark" ? "light" : "dark";
    document.body.classList.remove(opposite);
    document.body.classList.add(theme);

    return () => {
      // Limpa ao desmontar — landing page e páginas públicas ficam sem classe
      document.body.classList.remove("dark", "light");
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {/* A classe aqui garante que componentes filhos diretos também recebem o tema */}
      <div className={`${theme} contents`}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
