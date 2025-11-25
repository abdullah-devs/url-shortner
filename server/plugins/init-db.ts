import { initDb } from "../utils/initDb";

export default defineNitroPlugin(async () => {
  await initDb();
});
