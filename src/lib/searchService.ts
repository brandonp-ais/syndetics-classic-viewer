// src/lib/searchService.ts
export async function searchByIsbn(isbn: string): Promise<any> {
    if (!isbn) throw new Error('Please enter an ISBN.');
    const base_url = 'http://titlepeek.follettsoftware.com/v4/details/{isbn}?customerNumber=9610465';
    const url = base_url.replace('{isbn}', isbn);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch data');
    return await res.json();
}
