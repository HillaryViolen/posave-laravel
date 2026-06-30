import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export function ChatInput() {
    return (
        <div className="border-t p-5">
            <div className="flex gap-3">
                <Input placeholder="Ketik pertanyaan..." className="h-12" />

                <Button size="icon" className="h-12 w-12">
                    <Send size={18} />
                </Button>
            </div>
        </div>
    );
}
