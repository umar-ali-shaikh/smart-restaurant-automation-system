import { useEffect } from "react";

export default function Modal({
  open,
  title,
  subtitle,
  children,
  onClose,
  size = "lg",
}) {
  /* ======================================
      ESC CLOSE
  ====================================== */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  /* ======================================
      LOCK SCROLL
  ====================================== */

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ======================================
      HIDE
  ====================================== */

  if (!open) return null;

  /* ======================================
      SIZE
  ====================================== */

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]",
  };

  /* ======================================
      UI
  ====================================== */

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/70
        backdrop-blur-md
        p-4
        animate-fadeIn
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      {/* MODAL */}

      <div
        className={`
          relative
          w-full
          ${sizeClasses[size]}
          max-h-[90vh]
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-[#101010]
          shadow-[0_20px_80px_rgba(0,0,0,0.7)]
          animate-[modalPop_.25s_ease]
        `}
      >
        {/* TOP GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-[180px]
            bg-[radial-gradient(circle_at_top,rgba(212,170,90,0.18),transparent_70%)]
          "
        />

        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            z-20
            border-b
            border-white/5
            bg-[#101010]/90
            backdrop-blur-md
            px-8
            py-6
          "
        >
          {/* CLOSE */}

          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="
              absolute
              right-5
              top-5
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/5
              text-xl
              text-white
              transition-all
              duration-300
              hover:scale-105
              hover:border-red-400/40
              hover:bg-red-500/10
              hover:text-red-300
            "
          >
            ×
          </button>

          {/* TITLE */}

          {title && (
            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white
              "
            >
              {title}
            </h2>
          )}

          {/* SUBTITLE */}

          {subtitle && (
            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-relaxed
                text-zinc-400
              "
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* CONTENT */}

        <div
          className="
            custom-scrollbar
            max-h-[calc(90vh-110px)]
            overflow-y-auto
            px-8
            py-6
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
