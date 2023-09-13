import NextAuth from "next-auth/next";

const handler = NextAuth({
    providers: [
        {
            id: "invman",
            name: "Invman",
            type: "oauth",
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            authorization: `${process.env.AUTH_URL}/oauth/authorize`,
            token: `${process.env.AUTH_URL}/oauth/token`,
            userinfo: `${process.env.AUTH_URL}/oauth/me`,
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.firstname + " " + profile.lastname,
                    email: profile.email,
                    image: profile.imageUrl,
                }
            },
        },
    ],
})

export { handler as GET, handler as POST }