import fastify from "fastify";
import cookie from "@fastify/cookie";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createPoll } from "./routes/create-poll.js";
import { getPoll } from "./routes/get-poll.js";
import { voteOnPoll } from "./routes/vote-on-poll.js";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(cookie, {
	secret: "this is a secret",
	hook: "onRequest",
	parseOptions: {},
});

await app.register(createPoll);
await app.register(getPoll);
await app.register(voteOnPoll)

await app.listen({ port: 3333 });

console.log("HTTP server running");
