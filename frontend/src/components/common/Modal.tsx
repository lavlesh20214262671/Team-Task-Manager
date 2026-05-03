import { ReactNode } from 'react';

type ModalProps = { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode };

const Modal = ({ title, onClose, children, footer }: ModalProps) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <span className="modal-title">{title}</span>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      {children}
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

export default Modal;
