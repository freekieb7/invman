import DiscordProvider from "next-auth/providers/discord";

import NextAuth from "next-auth"

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: '1054017897569194024',
      clientSecret: '7W00aHjNRZwiaNheFjOYIKDiz-YNWyIP'
    }),
    {
      id: "invman",
      name: "invman",
      type: "oauth",
      clientId: "000000",
      clientSecret: "999999",
      authorization: "http://localhost:9096/oauth/authorize",
      token: "http://localhost:9096/oauth/token",
      userinfo: "http://localhost:9096/oauth/me",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
  debug: true,
})

export { handler as GET, handler as POST }