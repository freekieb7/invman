import { DefaultSession } from "next-auth";

declare module "next-auth/core/types" {
    interface Session {
        error?: "RefreshAccessTokenError",
        user: {
            access_token?: string | null;
        } & DefaultSession["user"];
    }

    interface Profile {
        // sub?: string
        name?: string
        email?: string
        image?: string
    }

    interface Account {
        access_token: string
        expires_in: number
        token_type: string
        refresh_token: string
        error?: "RefreshAccessTokenError"
    }

    interface TokenResponse {
        access_token: string
        expires_in: number
        refresh_token: string
        error?: "RefreshAccessTokenError"
    }
}

declare module "next-auth/jwt/types" {
    interface JWT {
        access_token: string
        expires_at: number
        refresh_token: string
        error?: "RefreshAccessTokenError"
    }
}