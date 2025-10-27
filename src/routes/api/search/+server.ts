// src/routes/api/search/+server.ts
import { json } from '@sveltejs/kit';
import { searchByIsbn } from '$lib/searchService';

export async function POST({ request }) {
    const { isbn } = await request.json();
    try {
        const result = await searchByIsbn(isbn);
        return json({ result });
    } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
    }
}
