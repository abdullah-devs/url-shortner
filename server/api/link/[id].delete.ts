import { useTurso } from "../../utils/turso";
import auth from "../_middleware/auth";

export default defineEventHandler(async (event) => {
  await auth(event)

  const linkIdString = event?.context?.params?.id; 

  if (!linkIdString) {
    throw createError({
      statusCode: 400,
      message: "Link ID is required."
    });
  }

  
  if (isNaN(Number(linkIdString))) {
    throw createError({
      statusCode: 400,
      message: "Link ID must be a valid integer."
    });
  }

  const linkId = parseInt(linkIdString);

  const db = useTurso();

  const link = await db.execute({
    sql: "SELECT * FROM urls WHERE id = ? AND user_id = ?;",
    args: [linkId, event.context.user.payload.id]
  });

  if (link.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Link not found."
    });
  }

  await db.execute({
    sql: "DELETE FROM urls WHERE id = ? AND user_id = ?;",
    args: [linkId, event.context.user.payload.id]
  });

  setResponseStatus(event, 204);

  return;
});
