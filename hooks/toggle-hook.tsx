import { useCallback } from "react";

import { useSession } from "next-auth/react";

export const useThemeToggle = () => {
  const { data: session, status, update } = useSession();

  const togglePaletteMode = useCallback(
    async (id: string) => {
      const newTheme = session?.user?.theme === "light" ? "dark" : "light";
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/toggle-theme`,
          {
            method: "POST",
            body: JSON.stringify({ id: id, theme: newTheme }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        const updateUser = {
          ...session,
          user: {
            ...session?.user,
            theme: data.theme,
          },
        };

        await update(updateUser);

        console.log("USER SESSION CLIENT:", session?.user);
      } catch (err) {
        console.log("There was an error with updating theme.", err);
      }
    },
    [session]
  );

  return {
    togglePaletteMode,
  };
};
