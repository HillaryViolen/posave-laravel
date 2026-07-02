export async function deleteConversation(conversationId: number): Promise<void> {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

    const res = await fetch(`/chatbot/conversations/${conversationId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
            'X-CSRF-TOKEN': csrfToken,
            Accept: 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
    }
}