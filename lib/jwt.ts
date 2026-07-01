import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "fallback-super-secret-key-for-salon-admin";
  return new TextEncoder().encode(secret);
};

export async function signJwtToken(payload: { email: string; id: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Token expires in 24 hours
    .sign(getJwtSecretKey());

  return token;
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}
