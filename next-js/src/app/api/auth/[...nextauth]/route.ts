import DiscordProvider from "next-auth/providers/discord";

import NextAuth from "next-auth"

const handler =  NextAuth({
  providers: [
    DiscordProvider({
      clientId: '1054017897569194024',
      clientSecret: '7W00aHjNRZwiaNheFjOYIKDiz-YNWyIP'
    })
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
})

export { handler as GET, handler as POST }