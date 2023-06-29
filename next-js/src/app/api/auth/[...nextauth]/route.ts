import DiscordProvider from "next-auth/providers/discord";

import NextAuth from "next-auth"
import { trace } from "console";

const handler = NextAuth({
  logger: {
    error(code, ...message) {
      trace(message);
      console.error(code, message)
    },
  }, 
  providers: [
    DiscordProvider({
      clientId: '1054017897569194024',
      clientSecret: '7W00aHjNRZwiaNheFjOYIKDiz-YNWyIP'
    }),
    {
      id: "invman",
      name: "invman",
      type: "oauth",
      clientId: "1054017897569194024",
      clientSecret: "7W00aHjNRZwiaNheFjOYIKDiz-YNWyIP",
      authorization: "http://auth.invman.nl/oauth/authorize",
      token: "http://auth.invman/oauth.nl/token",
      userinfo: "http://auth.invman.nl/oauth/me",
      // accessTokenUrl: "http://auth.localhost/oauth/me",
      // profileUrl: "http://auth.localhost/oauth/me",
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
  debug: true,
})

export { handler as GET, handler as POST }