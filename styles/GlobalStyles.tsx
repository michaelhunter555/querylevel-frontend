import { useSession } from "next-auth/react";

import { css, Global } from "@emotion/react";

export const GlobalStyles = () => {
  const { data: session } = useSession();

  const darkMode =
    "linear-gradient(60deg, rgb(0, 21, 39) 60%, rgb(0, 54, 99) 100%)";

  return (
    <Global
      styles={css`
        html,
        body {
          background: ${session?.user?.theme === "dark" ? darkMode : "#f1f3f4"};
        }
      `}
    />
  );
};
