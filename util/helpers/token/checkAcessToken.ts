import { decryptData } from "@/util/encryption/decryptData";

/**
 * @name refreshAccessToken
 * @description - Checks if access token is expired or not and will request a new one
 * @return boolean | string - new access token if false;
 */

export const refreshAccessToken = async (
  accessToken: string,
  refreshToken: string
) => {
  const decryptRefreshToken = decryptData(refreshToken);
  try {
    const response = await fetch("https://accounts.google.com/o/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: decryptRefreshToken,
      }),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      newAccessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token || refreshToken,
    };
  } catch (err) {
    console.error("Error refreshing access token", err);
    return { accessToken, error: "RefreshAccessTokenError" };
  }
};
