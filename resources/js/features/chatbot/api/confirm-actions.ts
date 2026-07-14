import axios from 'axios';

export async function confirmAction(actionId: number): Promise<{ status: string; result: unknown }> {
    const res = await axios.post(`/ai/actions/${actionId}/confirm`);
    return res.data;
}

export async function cancelAction(actionId: number): Promise<{ status: string }> {
    const res = await axios.post(`/ai/actions/${actionId}/cancel`);
    return res.data;
}