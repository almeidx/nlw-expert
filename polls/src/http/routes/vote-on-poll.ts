import { z } from "zod";
import { FastifyInstanceWithZod } from "../../lib/fastify.js";
import { prisma } from "../../lib/prisma.js";

export async function voteOnPoll(app: FastifyInstanceWithZod) {
	app.post(
		"/polls/:pollId/votes",
		{
			schema: {
				body: z.object({
					pollOptionId: z.string().uuid(),
				}),
				params: z.object({
					pollId: z.string().uuid(),
				}),
			},
		},
		async (request, reply) => {
			const { pollId } = request.params;
			const { pollOptionId } = request.body;

			let { sessionId } = request.cookies;

			if (sessionId) {
				const userPreviousVoteOnPoll = await prisma.vote.findUnique({
					where: {
						sessionId_pollId: {
							sessionId,
							pollId,
						},
					},
					select: {
						pollOptionId: true,
					},
				});

				if (userPreviousVoteOnPoll) {
					if (userPreviousVoteOnPoll.pollOptionId === pollOptionId) {
						reply.statusCode = 400;
						return { error: "You have already voted for this option" };
					}

					await prisma.vote.delete({
						where: {
							sessionId_pollId: {
								sessionId,
								pollId,
							},
						},
					});
				}
			}

			if (!sessionId) {
				sessionId = crypto.randomUUID();

				reply.setCookie("sessionId", sessionId, {
					path: "/",
					maxAge: 60 * 60 * 24 * 30, // 30 days
					signed: true,
					httpOnly: true,
				});
			}

			await prisma.vote.create({
				data: {
					sessionId,
					pollId,
					pollOptionId,
				}
			});

			reply.statusCode = 201;

			return { sessionId };
		},
	);
}
