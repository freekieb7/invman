import NextAuth from "next-auth"

const handler = NextAuth({
  providers: [
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
})

export { handler as GET, handler as POST }