import {ReactNode} from "react";
import "./PaperButton.css";

interface PaperButtonProps {
    children: ReactNode;
    onClick: () => void;
}
export function PaperButton({children, onClick}: PaperButtonProps) {
    return (
        <button onClick={onClick} className="button-55" role="button">{children}</button>
    );
}