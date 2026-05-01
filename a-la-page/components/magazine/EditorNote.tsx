import { Issue } from "@/lib/types";
import { formatDate } from "@/lib/formatting";

interface EditorNoteProps {
  issue: Issue;
}

export function EditorNote({ issue }: EditorNoteProps) {
  const note = issue.editorNote;

  return (
    <section className="py-12 md:py-16 px-4 bg-cream">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-start gap-6 md:gap-8">
          {/* Left Divider */}
          <div className="hidden md:block w-px h-32 bg-gold-champagne opacity-50"></div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-gray-dark mb-4">
              編輯語
            </p>
            <p className="text-body md:text-lg font-serif italic text-black mb-6 leading-relaxed">
              &ldquo;{note.text}&rdquo;
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-light">
              <div>
                <p className="text-sm font-sans font-bold text-gray-dark">
                  {note.author}
                </p>
                <p className="text-xs text-gray-dark opacity-60">
                  {formatDate(note.date)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-dark uppercase tracking-widest">
                  編輯選文
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditorNote;
