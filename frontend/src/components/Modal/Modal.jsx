import React from "react";
import "./Modal.css";

function Modal(props) {
  return (
    <div className="modal">
      <header className="modal__header">{props.title}</header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {props.canCancel && (
          <button className="modal__action-cancel" onClick={props.onCancel}>
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button className="modal__action-confirm" onClick={props.onConfirm}>
            {props.confirmText}
          </button>
        )}
      </section>
    </div>
  );
}

export default Modal;
