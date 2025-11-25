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

  const { name, email, password } = body;

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      message: "Name, Email, and password are required."
    });
  }

  const userInUse = await db.execute({
    sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
    args: [email]
  });

  const userWithEmailInUse = userInUse.rows[0];

  if (userWithEmailInUse) {
    throw createError({
      statusCode: 401,
      message: "Email already in use."
    });
  }

  const result = await db.execute({
    sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING *;",
    args: [name, email, await bcrypt.hash(password, 10)]
  });
  
  const user = result.rows[0];

  delete user.password;

  const encoder = new TextEncoder();
  const jwt = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(jwtSecret));

  setResponseHeader(event, "Authorization", `Bearer ${jwt}`);

  setResponseStatus(event, 201);

  return user;
});
