import arcjet, { shield, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"],

    rules: [
        shield({
            mode: "LIVE",
        }),

        tokenBucket({
            mode: "LIVE",
            refillRate: 1,
            interval: 60,
            capacity: 5,
        }),
    ],
});

export default aj;
