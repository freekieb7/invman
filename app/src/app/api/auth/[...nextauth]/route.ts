import NextAuth, { TokenResponse } from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "invman",
      name: "Invman",
      type: "oauth",
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      authorization: `${process.env.AUTH_URL}/oauth/authorize`,
      token: `${process.env.AUTH_URL}/oauth/token`,
      userinfo: `${process.env.AUTH_URL}/oauth/me`,
      profile(profile) {
        return {
          id: profile.id,
          group: profile.group,
          name: profile.nickname,
          email: profile.email,
          image: profile.imageUrl,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      /// !!! First time login: Initial login -> refresh; Afterwards the token is OK; is it ok to refresh after login?
      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          ...token,
          group: profile!.group,
          access_token: account.access_token,
          expires_at: Math.floor(Date.now() / 1000 + account.expires_in),
          refresh_token: account.refresh_token,
        }
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        try {
          // We need the `token_endpoint`.
          console.log("Refresh token: " + token.refresh_token);

          const response = await fetch(`${process.env.AUTH_URL}/oauth/token`, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Basic ${Buffer.from(
                `${process.env.AUTH_CLIENT_ID}:${process.env.AUTH_CLIENT_SECRET}`
              ).toString("base64")}`
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
            method: "POST",
          })

          const tokens: TokenResponse = await response.json();

          if (!response.ok) throw tokens;

          return {
            ...token, // Keep the previous token properties
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          }
        } catch (error) {
          console.error("Error refreshing access token", error)
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const }
        }
      }
    },
    async session({ session, token }) {
      // Accessible on client side
      session.error = token.error;
      session.user.access_token = token.access_token;
      session.user.group = token.group;
      return session
    }
  },
})

export { handler as GET, handler as POST }