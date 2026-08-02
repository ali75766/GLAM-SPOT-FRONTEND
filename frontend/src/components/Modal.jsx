import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

function Modal({ isOpen, onClose, title, children, width = "max-w-3xl" }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="fixed inset-0 z-[70] bg-[#130f22]/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className={`w-full ${width}`}
            >
              <div className="glass-card max-h-[86vh] overflow-hidden rounded-[2rem]">
                <div className="flex items-center justify-between border-b border-line px-6 py-5">
                  <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-background text-lg text-foreground"
                  >
                    <FiX />
                  </button>
                </div>
                <div className="max-h-[calc(86vh-5.5rem)] overflow-y-auto p-6">{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default Modal;
