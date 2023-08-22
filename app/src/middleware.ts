import { withAuth } from "next-auth/middleware";

export default withAuth(
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === '/api/health') {
          return true;
        }

        // verify token and return a boolean
        if (token?.error === "RefreshAccessTokenError") {
          return false;
        }

        return !!token;
      },
    },
  }
)