import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ChangeEvent, useState, FormEvent } from "react";
import { toast } from "sonner";

export function NewNoteCard() {
	const [showOnboarding, setShowOnboarding] = useState(true);
	const [content, setContent] = useState("");

	function handleStartEditor() {
		setShowOnboarding(false);
	}

	function handleEditorContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setContent(event.target.value);

		if (event.target.value === "") {
			setShowOnboarding(true);
		}
	}

	function handleSaveNote(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		console.log("nota criada:", content);

		toast.success("Nota criada com sucesso!");
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger className="rounded-md flex flex-col gap-3 text-left bg-slate-700 p-5 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
				<span className="text-sm font-medium text-slate-200">Adicionar nota</span>

				<p className="text-sm leading-6 text-slate-400">
					Grave uma nota em áudio que irá ser convertida para texto automaticamente.
				</p>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50" />

				<Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none overflow-hidden">
					<Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
						<X className="size-5" />
					</Dialog.Close>

					<form className="flex-1 flex flex-col" onSubmit={handleSaveNote}>
						<div className="flex flex-1 flex-col gap-3 p-5">
							<span className="text-sm font-medium text-slate-300">Adicionar nota</span>

							{showOnboarding ? (
								<p className="text-sm leading-6 text-slate-400">
									Comece por{" "}
									<button className="font-medium text-lime-400 hover:underline" type="button">
										gravar uma nota
									</button>{" "}
									em áudio ou, se preferir,{" "}
									<button
										className="font-medium text-lime-400 hover:underline"
										onClick={handleStartEditor}
										type="button"
									>
										escreva uma nota em texto
									</button>
									.
								</p>
							) : (
								<textarea
									autoFocus
									className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
									placeholder="Escreva a sua nota..."
									onChange={handleEditorContentChange}
								/>
							)}
						</div>

						<button
							className="w-full bg-lime-400 py-4 text-center text-sm font-medium text-lime-950 outline-none hover:bg-lime-500"
							type="submit"
						>
							Guardar nota
						</button>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
