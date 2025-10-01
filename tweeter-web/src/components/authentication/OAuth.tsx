import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastType } from "../toaster/Toast";
import { useMessageActions } from "../toaster/MessageHooks";
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface Props {
    company: IconName;
}

const OAuth = (props: Props) => {
    const { displayInfoMessage, displayErrorMessage } = useMessageActions();
    const displayInfoMessageWithDarkBackground = (message: string): void => {
        displayInfoMessage(
            message,
            3000,
            "text-white bg-primary"
        );
    };

    return (
        <>
        <button
            type="button"
            className="btn btn-link btn-floating mx-1"
            onClick={() =>
                displayInfoMessageWithDarkBackground(props.company.concat(" registration is not implemented."))
            }
        >
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={props.company.toLowerCase().concat("Tooltip")}>{props.company}</Tooltip>}
            >
                <FontAwesomeIcon icon={["fab", props.company]} />
            </OverlayTrigger>
        </button>
        </>
    );
};

export default OAuth;