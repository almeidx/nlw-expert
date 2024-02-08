import { z } from "zod";
import type { FastifyInstanceWithZod } from "../../lib/fastify.js";
import { prisma } from "../../lib/prisma.js";
import { redis } from "../../lib/redis.js";

export async function getPoll(app: FastifyInstanceWithZod) {
	app.get(
		"/polls/:pollId",
		{
			schema: {
				params: z.object({
					pollId: z.string().uuid(),
				}),
			},
		},
		async (request, reply) => {
			const { pollId } = request.params;

			const poll = await prisma.poll.findUnique({
				where: {
					id: pollId,
				},
				include: {
					options: {
						select: {
							id: true,
							title: true,
						},
					},
				},
			});

			if (!poll) {
				reply.statusCode = 404;
				return { error: "Poll not found" };
			}

			const scores = await redis.zrange(pollId, 0, -1, "WITHSCORES");

			const votes = scores.reduce((acc, value, index, results) => {
				if (index % 2 === 0) {
					const score = Number.parseInt(results[index + 1], 10);
					acc.set(value, score);
				}
				return acc;
			}, new Map<string, number>());

			return {
				...poll,
				options: poll.options.map((option) => ({
					...option,
					score: votes.get(option.id) ?? 0,
				})),
			};
		},
	);
}
