import logoSvg from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card.tsx";
import { NoteCard } from "./components/note-card.tsx";

const note = {
	date: new Date(),
	content: "Hello World",
};

export function App() {
	return (
		<div className="mx-auto max-w-6xl my-12 space-y-6">
			<img src={logoSvg} alt="NLW Expert" />

			<form className="w-full">
				<input
					className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
					type="text"
					placeholder="Pesquise pelas suas notas..."
				/>
			</form>

			<div className="h-px bg-slate-700" />

			<div className="grid grid-cols-3 auto-rows-[250px] gap-6">
				<NewNoteCard />

				<NoteCard note={note} />
			</div>
		</div>
	);
}
