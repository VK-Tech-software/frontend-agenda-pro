import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl p-8 text-center">
        <CheckCircle className="mx-auto mb-4 text-teal-600" size={48} />
        <h2 className="text-2xl font-bold mb-2">
          Solicitação enviada 🎉
        </h2>
        <p className="text-muted-foreground mb-6">
          Sua solicitação foi enviada com sucesso. 
          Em breve você receberá a confirmação.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
        >
          Fechar
        </button>
      </DialogContent>
    </Dialog>
  );
}