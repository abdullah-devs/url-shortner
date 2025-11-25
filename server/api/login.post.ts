import { useTurso } from "../utils/turso";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export default defineEventHandler(async (event) => {
  const { jwtSecret } = useRuntimeConfig();
  const db = useTurso();
  const body = await readBody(event);

  if (!body) {
    throw createError({
      statusCode: 400,
      message: "Body is required."
    });
  }

  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required."
    });
  }

  const result = await db.execute({
    sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
    args: [email]
  });

  const user = result.rows[0];

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password."
    });
  }

  const isValid = bcrypt.compareSync(password, user.password as string);

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password."
    });
  }

  const encoder = new TextEncoder();
  const jwt = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(jwtSecret));

  setResponseHeader(event, "Authorization", `Bearer ${jwt}`);

  delete user.password;

  return user;
});
