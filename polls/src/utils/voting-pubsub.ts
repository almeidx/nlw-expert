export const channels: Record<string, Subscriber[]> = {};

export function subscribeVotes(pollId: string, subscriber: Subscriber) {
	channels[pollId] ??= [];
	channels[pollId].push(subscriber);
}

export function publishVotes(pollId: string, message: Message) {
	if (!channels[pollId]) {
		return;
	}

	for (const subscriber of channels[pollId]) {
		subscriber(message);
	}
}

interface Message {
	pollOptionId: string;
	votes: number;
}

type Subscriber = (message: Message) => void;
