import { z } from "zod";
import { validateResponse } from "./ValidateRequest";

const NoteSchema = z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    createdAt: z.number()
});

const NoteListSchema = z.object({
    list: z.array(NoteSchema),
    pageCount: z.number()
});

const NoteListFilterSchema = z.object({
    page: z.number(),
    pageSize: z.number()
})

export type Note = z.infer<typeof NoteSchema>;
export type NoteList = z.infer<typeof NoteListSchema>
export type NoteListFilter = z.infer<typeof NoteListFilterSchema>

export function fetchNotesList(filter: object = {}): Promise<NoteList> {
    const params = new URLSearchParams();
    if (Object.keys(filter).length > 0) {
        for (const [key, value] of Object.entries(filter)) {
            params.append(key, value)
        }
    }

    return fetch(`/api/notes?${params.toString()}`)
        .then(validateResponse)
        .then(response => response.json())
        .then(data => NoteListSchema.parse(data))
}

export function createNote(title: string, text: string): Promise<void> {
    return fetch('/api/notes', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title, text})
    })
        .then(() => undefined)
}