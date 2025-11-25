import { useTurso } from "../utils/turso";
import auth from "./_middleware/auth";
import crypto from "node:crypto";

export default defineEventHandler(async (event) => {
  await auth(event)

  const db = useTurso();
  const body = await readBody(event);

  if (!body) {
    throw createError({
      statusCode: 400,
      message: "Body is required."
    });
  }

  const { name, link } = body;

  if (!name || !link) {
    throw createError({
      statusCode: 400,
      message: "Name, and link are required."
    });
  }

  if (!/^https?:\/\/.+\..+/.test(link)) {
    throw createError({
      statusCode: 400,
      message: "Link must be a valid URL."
    });
  }

  const result = await db.execute({
    sql: "INSERT INTO urls (name, link, user_id, public_id) VALUES (?, ?, ?, ?) RETURNING *;",
    args: [name, link, event.context.user.payload.id, crypto.randomBytes(7).toString("hex")]
  });
  
  const linkData = result.rows[0];

  setResponseStatus(event, 201);

  return linkData;
});
