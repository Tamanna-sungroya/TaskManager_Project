import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(false); // default LIGHT

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className={`relative w-14 h-8 rounded-full transition ${
        dark
          ? "bg-gradient-to-r from-green-300 to-blue-400"
          : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform ${
          dark ? "translate-x-6" : ""
        }`}
      />
    </button>
  );
};

export default ThemeToggle;