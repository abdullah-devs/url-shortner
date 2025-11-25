import { useTurso } from "../utils/turso";
import auth from "./_middleware/auth";

export default defineEventHandler(async (event) => {
  await auth(event)

  const db = useTurso();

  const result = await db.execute({
    sql: "SELECT urls.*, COUNT(visits.id) AS visit_count FROM urls LEFT JOIN visits ON urls.id = visits.url_id WHERE urls.user_id = ? GROUP BY urls.id ORDER BY urls.created_at DESC;",
    args: [event.context.user.payload.id]
  });
  
  const links = result.rows;

  return links;
});
