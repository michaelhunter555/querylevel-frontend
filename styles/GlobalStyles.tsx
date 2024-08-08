import { useSession } from "next-auth/react";

import { css, Global } from "@emotion/react";

export const GlobalStyles = () => {
  const { data: session } = useSession();

  return (
    <Global
      styles={css`
        html,
        body {
          background: ${session?.user?.theme === "dark" ? "#000" : "#f1f3f4"};
        }
      `}
    />
  );
};
