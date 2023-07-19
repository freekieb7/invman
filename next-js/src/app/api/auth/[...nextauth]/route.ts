import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: "1054017897569194024",
      clientSecret: "6JML5bOLOBV85Sm3pgxEbjlkLuS-CfFz",
    }),
    {
      id: "invman",
      name: "Invman",
      type: "oauth",
      clientId: process.env.NEXTAUTH_INVMAN_CLIENT_ID,
      clientSecret: process.env.NEXTAUTH_INVMAN_CLIENT_SECRET,
      authorization: `${process.env.INVMAN_AUTH_URL}/oauth/authorize`,
      token: `${process.env.INVMAN_AUTH_URL}/oauth/token`,
      userinfo: `${process.env.INVMAN_AUTH_URL}/oauth/me`,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.displayName,
          email: profile.email,
          image: profile.imageUrl,
        }
      },
    },
  ],
  callbacks: {
    async jwt({token, account}) {
      if (account) {
        token.access_token = account.access_token as string;
      }
      return token
    },
    async session({session, token}) {
    if(session) {
      session.user.token = token.access_token as string;
      }
    return session
    }
  }
})

export { handler as GET, handler as POST }