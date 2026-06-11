import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth.js";
describe("Hashing Validity", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    const userId1 = "123";
    const userId2 = "456";
    const exiresIn = 1000;
    const expired = -1;
    let hash1;
    let hash2;
    let hashExpired;
    beforeAll(async () => {
        hash1 = makeJWT(userId1, exiresIn, password1);
        hash2 = makeJWT(userId2, exiresIn, password2);
        hashExpired = makeJWT(userId1, expired, password1);
    });
    it("should return true for the correct password1", async () => {
        const result = validateJWT(hash1, password1);
        expect(result).toBe(userId1);
    });
    it("should return true for the correct password2", async () => {
        const result = validateJWT(hash2, password2);
        expect(result).toBe(userId2);
    });
    it("should return false for the wrong password2", async () => {
        expect(() => validateJWT(hash1, password2)).toThrow();
    });
    it("should return false for the correct password1", async () => {
        expect(() => validateJWT(hash2, password1)).toThrow();
    });
    it("should return wring for the expired token", async () => {
        expect(() => validateJWT(hashExpired, password1)).toThrow();
    });
});
