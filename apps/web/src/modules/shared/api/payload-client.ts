import configPromise from "@payload-config";
import { getPayload, type Payload } from "payload";
import "server-only";

export const getPayloadClient = (): Promise<Payload> => getPayload({ config: configPromise });
