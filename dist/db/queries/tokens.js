import { Unauthorized } from "../../api/middleware.js";
import { db } from "../index.js";
import { refresh_tokens } from "../schema.js";
import { eq, and, gt, isNull } from "drizzle-orm";
export async function createRefreshToken(refreshToken) {
    const [result] = await db
        .insert(refresh_tokens)
        .values(refreshToken)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getUserFromRefreshToken(refreshToken) {
    const [result] = await db.select().from(refresh_tokens).where(and(eq(refresh_tokens.token, refreshToken), gt(refresh_tokens.expiresAt, new Date()), isNull(refresh_tokens.revokedAt)));
    if (result === undefined) {
        throw new Unauthorized("Invalid or expired token");
    }
    return result.userId;
}
export async function revokeRefreshToken(refreshToken) {
    await db.update(refresh_tokens)
        .set({ revokedAt: new Date(Date.now()) })
        .where(eq(refresh_tokens.token, refreshToken));
}
