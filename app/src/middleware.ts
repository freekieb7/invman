import { withAuth } from "next-auth/middleware";
import { signIn, signOut } from "next-auth/react";

export default withAuth(
  {
    callbacks: {
      authorized: ({ token }) => {
        // verify token and return a boolean
        if (token?.error === "RefreshAccessTokenError") {
          return false;
        }

        return !!token;
      },
    },
  }
)