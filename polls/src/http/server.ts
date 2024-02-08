import cookie from "@fastify/cookie";
import websocket from "@fastify/websocket";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createPoll } from "./routes/create-poll.js";
import { getPoll } from "./routes/get-poll.js";
import { voteOnPoll } from "./routes/vote-on-poll.js";
import { pollResults } from "./ws/poll-results.js";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(cookie, {
	secret: "this is a secret",
	hook: "onRequest",
	parseOptions: {},
});
await app.register(websocket);

await app.register(createPoll);
await app.register(getPoll);
await app.register(voteOnPoll);
await app.register(pollResults);

await app.listen({ port: 3333 });

console.log("HTTP server running");
