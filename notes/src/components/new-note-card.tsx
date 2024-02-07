import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreate }: NoteCardProps) {
	const [showOnboarding, setShowOnboarding] = useState(true);
	const [isRecording, setIsRecording] = useState(false);
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

		if (!content) {
			toast.error("A nota não pode estar vazia!");
			return;
		}

		onNoteCreate(content);

		setContent("");
		setShowOnboarding(true);

		toast.success("Nota criada com sucesso!");
	}

	function handleRecordingStart() {
		const isSpeechRecognitionSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
		if (!isSpeechRecognitionSupported) {
			toast.error("O seu navegador não suporta gravações de áudio.");
			return;
		}

		setIsRecording(true);
		setShowOnboarding(false);

		const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

		speechRecognition = new SpeechRecognition();

		speechRecognition.lang = "pt-PT";
		speechRecognition.continuous = true;
		speechRecognition.maxAlternatives = 1;
		speechRecognition.interimResults = true;

		speechRecognition.onresult = (event) => {
			const transcript = Array.from(event.results).reduce((acc, result) => acc + result[0].transcript, "");
			setContent(transcript);
		};

		speechRecognition.onerror = (error) => {
			console.error("An error occurred while recording audio.", error);
		};

		speechRecognition.start();
	}

	function handleRecordingStop() {
		setIsRecording(false);

		speechRecognition?.stop();
		speechRecognition = null;
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

				<Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden">
					<Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
						<X className="size-5" />
					</Dialog.Close>

					<form className="flex-1 flex flex-col" onSubmit={handleSaveNote}>
						<div className="flex flex-1 flex-col gap-3 p-5">
							<span className="text-sm font-medium text-slate-300">Adicionar nota</span>

							{showOnboarding ? (
								<p className="text-sm leading-6 text-slate-400">
									Comece por{" "}
									<button
										className="font-medium text-lime-400 hover:underline"
										onClick={handleRecordingStart}
										type="button"
									>
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
									value={content}
								/>
							)}
						</div>

						{isRecording ? (
							<button
								className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm font-medium text-slate-300 outline-none hover:text-slate-100"
								onClick={handleRecordingStop}
								type="button"
								key="stop-recording"
							>
								<div className="size-3 rounded-full bg-red-500 animate-pulse" /> A gravar... Clique para parar
							</button>
						) : (
							<button
								className="w-full bg-lime-400 py-4 text-center text-sm font-medium text-lime-950 outline-none hover:bg-lime-500"
								type="submit"
								key="save-note"
							>
								Guardar nota
							</button>
						)}
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

interface NoteCardProps {
	onNoteCreate: (content: string) => void;
}
