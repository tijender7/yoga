import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TERMS_CONTENT } from "@/app/legal/terms"

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-8 text-gray-600">
            {TERMS_CONTENT.sections.map((section, index) => (
              <section key={index} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <p className="leading-relaxed">
                  {section.content}
                </p>
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="text-gray-600">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="pt-4 text-sm text-gray-500 border-t">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 