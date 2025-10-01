import "./Toaster.css";
import { useEffect } from "react"
import { Toast } from "react-bootstrap";
import { useMessageActions, useMessageList } from "./MessageHooks";

interface Props {
  position: string;
}

const Toaster = ({ position }: Props) => {
  const messageList = useMessageList();
  const { deleteMessage } = useMessageActions();

  useEffect(() => {
    const interval = setInterval(() => {
      if (messageList.length) {
        deleteExpiredToasts();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList]);

  const deleteExpiredToasts = () => {
    const now = Date.now();

    for (let msg of messageList) {
      if (
        msg.expirationMillisecond > 0 &&
        msg.expirationMillisecond < now
      ) {
        deleteMessage(msg.id);
      }
    }
  };

  return (
    <>      <div className={`toaster-container ${position}`}>
        {messageList.map((msg, i) => (
          <Toast
            id={msg.id}
            key={i}
            className={msg.bootstrapClasses}
            autohide={false}
            show={true}
            onClose={() => deleteMessage(msg.id)}
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">{msg.title}</strong>
            </Toast.Header>
            <Toast.Body>{msg.text}</Toast.Body>
          </Toast>
        ))}
      </div>
    </>
  );
};

export default Toaster;
