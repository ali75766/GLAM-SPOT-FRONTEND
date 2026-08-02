import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-lg text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
      aria-label="Toggle color theme"
    >
      {theme === "light" ? <FiMoon /> : <FiSun />}
    </button>
  );
}

export default ThemeToggle;
