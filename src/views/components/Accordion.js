import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="my-2">
            <button
                style={{backgroundColor: isOpen ? "#C2C2C2":"#810000", color: isOpen?"black":"white", fontWeight: "bold"}}
                className={`accordion-button rounded-pill p-2 ${isOpen ? 'active' : ''}`}
                onClick={toggleAccordion}
            >
                <span className="px-4">{isOpen ?<FiMinus /> : <FiPlus />}{"  "}{title}</span>
            </button>
            {isOpen && <div className="accordion-content">{content}</div>}
        </div>
    )
}

export default Accordion;