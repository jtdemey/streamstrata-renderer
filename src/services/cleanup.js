import db from "../db/db.js";

const cleanupQuery = db.prepare("DELETE FROM export_requests");

const cleanup = () => cleanupQuery.run();

export default cleanup;
