import { z } from "zod";
import type { FastifyInstanceWithZod } from "../../lib/fastify.js";
import { subscribeVotes } from "../../utils/voting-pubsub.js";

export async function pollResults(app: FastifyInstanceWithZod) {
	app.get(
		"/polls/:pollId/results",
		{
			schema: {
				params: z.object({
					pollId: z.string().uuid(),
				}),
			},
			websocket: true,
		},
		(connection, request) => {
			const { pollId } = request.params;

			subscribeVotes(pollId, (message) => {
				connection.socket.send(JSON.stringify(message));
			});
		},
	);
}
