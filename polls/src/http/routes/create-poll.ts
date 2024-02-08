import { z } from "zod";
import type { FastifyInstanceWithZod } from "../../lib/fastify.js";
import { prisma } from "../../lib/prisma.js";

export async function createPoll(app: FastifyInstanceWithZod) {
	app.post(
		"/polls",
		{
			schema: {
				body: z.object({
					title: z.string(),
					options: z.array(z.string()),
				}),
			},
		},
		async (request, reply) => {
			const { title, options } = request.body;

			const { id } = await prisma.poll.create({
				data: {
					title,
					options: {
						createMany: {
							data: options.map((title) => ({ title })),
						},
					},
				},
				select: {
					id: true,
				},
			});

			reply.statusCode = 201;

			return { pollId: id };
		},
	);
}
