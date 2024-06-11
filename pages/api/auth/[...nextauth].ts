import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import GoogleAdsAuth, { GoogleAuth } from "@/models/GoogleAdsAuth";
import { decryptData } from "@/util/encryption/decryptData";
import { encryptData } from "@/util/encryption/encryptData";
import { PaletteMode } from "@mui/material";

import dbConnect from "../dbConnect";

declare module "next-auth" {
  interface Session extends AuthOptions {
    user: {
      name: string;
      email: string;
      image: string;
      _id: string;
      theme: PaletteMode;
      googleAccountId: string;
      planExpiryDate: string;
      planType: string;
      cleanUpService: boolean;
      accountActive: boolean;
    };
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/content",
          access_type: "offline",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 30 * 60 * 60 * 24,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      await dbConnect();

      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }

      let googleUser;
      try {
        //check if we have a user under the google email for ads account
        googleUser = await GoogleAdsAuth.findOne({ email: user?.email });
      } catch (err) {
        console.log(
          "There was an error with the code - Check GoogleAdsAuth Model also.",
          err
        );
      }

      //add existing account id to token - regardless of access & refresh tokens
      if (googleUser) {
        token._id = googleUser._id;
        token.theme = googleUser.theme;
        token.planExpiryDate = googleUser.planExpiryDate;
        token.planType = googleUser.planType;
        token.cleanUpService = googleUser.cleanUpService;
        token.accountActive = googleUser.accountActive;
        if (googleUser.googleAccountId && googleUser.googleAccountId !== "") {
          token.googleAccountId = decryptData(googleUser.googleAccountId);
        } else {
          token.googleAccountId = googleUser.googleAccountId;
        }
      }

      //check if we have an access token after login with google
      if (account?.access_token && account?.provider === "google") {
        //encrypt access token
        let encryptedAccessToken = encryptData(account?.access_token);
        //Check if refresh token is available
        let encryptedRefreshToken = account?.refresh_token
          ? encryptData(account?.refresh_token)
          : undefined;

        //check if user exists, if they do, update the properties for access and refresh tokens
        if (googleUser) {
          let googleData: { [key: string]: string } = {};
          //update access token with new encrypted access token
          googleData.access_token = encryptedAccessToken;

          //if a refresh token is in the response update this too
          if (account?.refresh_token) {
            googleData.refresh_token = encryptData(account?.refresh_token);
          }

          try {
            await GoogleAdsAuth.findByIdAndUpdate(googleUser?._id, googleData);
            token.theme = googleUser?.theme;
          } catch (err) {
            console.log("Error updating Tokens for user", err);
          }
        } else {
          if (account?.refresh_token) {
            //create a new user for that user

            const startDate = new Date();
            const freeTrial = 7 * 24 * 60 * 60 * 1000;
            const endDate = new Date(startDate.getTime() + freeTrial);

            const googleAuthUser = {
              startPlan: startDate,
              planExpiryDate: endDate,
              accountActive: true,
              planType: "free",
              email: user?.email,
              name: user?.name,
              access_token: encryptedAccessToken,
              refresh_token: encryptedRefreshToken,
              cleanUpService: true,
              createdCampaigns: 0,
              campaignQuota: 1,
              totalCreatedCampaigns: 0,
              stripeCustomerId: "",
              theme: "light",
              googleAccountId: "",
              selectedClientId: "",
            } as GoogleAuth;

            const newGoogleAuth = new GoogleAdsAuth(googleAuthUser);

            try {
              await newGoogleAuth.save();
              //set token id to new user id
              token._id = newGoogleAuth._id;
              token.theme = newGoogleAuth.theme;
              token.googleAccountId = newGoogleAuth.googleAccountId;
            } catch (err) {
              console.log("Error adding GoogleAuth Details to DB", err);
            }
          }
        }
      }

      return { ...token };
    },
    session: async ({ session, token }) => {
      //Google Ads Account id Reference
      if (token?._id && typeof token?._id === "string") {
        session.user._id = token?._id;
      }

      if (token?.theme && typeof token?.theme === "string") {
        session.user.theme = token?.theme as PaletteMode;
      }

      if (
        token?.googleAccountId &&
        typeof token?.googleAccountId === "string"
      ) {
        session.user.googleAccountId = token?.googleAccountId;
      }

      if (token?.planExpiryDate && typeof token?.planExpiryDate === "string") {
        session.user.planExpiryDate = token?.planExpiryDate;
      }
      if (token?.planType && typeof token?.planType === "string") {
        session.user.planType = token?.planType;
      }
      if (typeof token?.cleanUpService === "boolean") {
        session.user.cleanUpService = token?.cleanUpService;
      }
      if (typeof token?.accountActive === "boolean") {
        session.user.accountActive = token?.accountActive;
      }

      return { ...session };
    },
  },
});
