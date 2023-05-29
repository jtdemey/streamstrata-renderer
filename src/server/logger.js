export const logError = (err, exportId = null) => process.stderr.write(
  exportId === null ? `${err}\n` : `[${exportId}] ${err}\n`
);

export const log = (msg, exportId = null) => process.stdout.write(
  exportId === null ? `${msg}\n` : `[${exportId}] ${msg}\n`
);
