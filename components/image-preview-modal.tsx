'use client'

interface ImagePreviewModalProps {
  previewImage: { src: string; alt: string } | null
  onClose: () => void
}

export function ImagePreviewModal({ previewImage, onClose }: ImagePreviewModalProps) {
  if (!previewImage) return null

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-99 p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-xl border border-primary/30 bg-card overflow-hidden shadow-2xl">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent z-10" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-lg
              border border-border bg-card text-muted-foreground
              hover:border-primary/40 hover:text-primary hover:bg-primary/5
              transition-all duration-200"
            aria-label="Close preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Corner brackets */}
          <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/50 z-10" />
          <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40 z-10" />

          <img
            src={previewImage.src}
            alt={previewImage.alt}
            className="w-full h-auto max-h-[75vh] object-contain"
          />

          {/* Caption */}
          {previewImage.alt && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-linear-to-t from-black/80 to-transparent z-10">
              <p className="text-sm font-semibold text-white line-clamp-1">{previewImage.alt}</p>
            </div>
          )}

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent z-10" />
        </div>
      </div>
    </div>
  )
}
