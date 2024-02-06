import { z } from "zod";
import { FastifyInstanceWithZod } from "../../lib/fastify.js";
import { prisma } from "../../lib/prisma.js";

export async function getPoll(app: FastifyInstanceWithZod) {
	app.get(
		"/polls/:pollId",
		{
			schema: {
				params: z.object({
					pollId: z.string().uuid(),
				})
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
					}
				},
			});

			if (!poll) {
				reply.statusCode = 404;
				return { error: "Poll not found" };
			}

			return poll;
		},
	);
}
