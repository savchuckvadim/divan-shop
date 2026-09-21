import config from "@payload-config";
import { getPayload } from "payload";

import { seed } from "./index";

/** Entry point for `pnpm web seed` (executed through `payload run`). */
const main = async () => {
    const payload = await getPayload({ config });
    try {
        await seed(payload);
        payload.logger.info("[seed] done");
    } finally {
        await payload.destroy();
    }
};

// Top-level await: `payload run` awaits the module import, so the process must not exit before seeding ends.
try {
    await main();
} catch (error) {
    console.error(error);
    process.exit(1);
}
