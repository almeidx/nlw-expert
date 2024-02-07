import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { X } from "lucide-react";
import type { Note } from "../app.tsx";

export function NoteCard({ note, onNoteDelete }: NoteCardProps) {
	function handleNoteDelete() {
		onNoteDelete(note.id);
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger className="rounded-md bg-slate-800 flex flex-col p-5 gap-3 overflow-hidden relative outline-none text-left hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
				<span className="text-sm font-medium text-slate-300">
					{formatDistanceToNow(note.date, { locale: pt, addSuffix: true })}
				</span>

				<p className="text-sm leading-6 text-slate-400">{note.content}</p>

				<div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50" />

				<Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden">
					<Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
						<X className="size-5" />
					</Dialog.Close>

					<div className="flex flex-1 flex-col gap-3 p-5">
						<span className="text-sm font-medium text-slate-300">
							{formatDistanceToNow(note.date, { locale: pt, addSuffix: true })}
						</span>

						<p className="text-sm leading-6 text-slate-400">{note.content}</p>
					</div>

					<button
						className="w-full bg-slate-800 py-4 text-center text-sm font-medium text-slate-300 outline-none group"
						onClick={handleNoteDelete}
						type="button"
					>
						Deseja <span className="text-red-400 group-hover:underline">apagar esta nota</span>?
					</button>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

interface NoteCardProps {
	note: Note;
	onNoteDelete: (id: string) => void;
}
