export async function renameConversation(conversationId: number, title: string): Promise<void> {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

    const res = await fetch(`/chatbot/conversations/${conversationId}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            Accept: 'application/json',
        },
        body: JSON.stringify({ title }),
    });

    if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
    }
}