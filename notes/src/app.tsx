import { ChangeEvent, useState } from "react";
import logoSvg from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card.tsx";
import { NoteCard } from "./components/note-card.tsx";

export function App() {
	const [search, setSearch] = useState("");
	const [notes, setNotes] = useState<Note[]>(() => {
		const localNotes = localStorage.getItem("notes");

		if (localNotes) {
			return JSON.parse(localNotes) as Note[];
		}

		return [];
	});

	function onNoteCreate(content: string) {
		const newNote = {
			id: crypto.randomUUID(),
			date: new Date(),
			content,
		};

		const newNotes = [newNote, ...notes];

		setNotes(newNotes);

		localStorage.setItem("notes", JSON.stringify(newNotes));
	}

	function onNoteDelete(id: string) {
		const newNotes = notes.filter((note) => note.id !== id);

		setNotes(newNotes);

		localStorage.setItem("notes", JSON.stringify(newNotes));
	}

	function handleSearch(event: ChangeEvent<HTMLInputElement>) {
		setSearch(event.target.value);
	}

	const filteredNotes = search.length
		? notes.filter((note) => note.content.toLowerCase().includes(search.toLowerCase()))
		: notes;

	return (
		<div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
			<img src={logoSvg} alt="NLW Expert" />

			<form className="w-full">
				<input
					className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
					type="text"
					placeholder="Pesquise pelas suas notas..."
					onChange={handleSearch}
					value={search}
				/>
			</form>

			<div className="h-px bg-slate-700" />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
				<NewNoteCard onNoteCreate={onNoteCreate} />

				{filteredNotes.map((note) => (
					<NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete} />
				))}
			</div>
		</div>
	);
}

export interface Note {
	id: string;
	date: Date;
	content: string;
}
