import NextAuth from "next-auth";

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