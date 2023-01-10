import * as winston from "winston";
import { ecsTransformer } from "./ecsTransformer";

export const koaEcsFormat = winston.format(ecsTransformer);
