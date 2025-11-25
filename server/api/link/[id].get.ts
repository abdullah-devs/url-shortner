import { useTurso } from "../../utils/turso";

export default defineEventHandler(async (event) => {
  const publicId = event?.context?.params?.id; 

  if (!publicId) {
    throw createError({
      statusCode: 400,
      message: "Public ID is required."
    });
  }

  const db = useTurso();

  const result = await db.execute({
    sql: "SELECT link, id FROM urls WHERE public_id = ?;",
    args: [publicId]
  });

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Link not found."
    });
  }

  const link = result.rows[0];

  const userAgent = event.node.req.headers['user-agent'] || '';

  await db.execute({
    sql: "INSERT INTO visits (user_agent, url_id) VALUES (?, ?);",
    args: [userAgent, link.id]
  });
  

  delete link.id;

  return link;
});
