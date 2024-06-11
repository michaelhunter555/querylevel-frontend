import { useSession } from "next-auth/react";

import { css, Global } from "@emotion/react";

export const GlobalStyles = () => {
  const { data: session } = useSession();

  return (
    <Global
      styles={css`
        html,
        body {
          background: ${session?.user?.theme === "light" ? "#f1f3f4" : "#000"};
        }
      `}
    />
  );
};
