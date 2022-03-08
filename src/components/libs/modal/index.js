import NFTButton from "../../NFTButton";

const defaultProps = {
    title: "",
    footer: true,
    header: true,
    visible: false,
    width: 600,
    fullX: false,
    fullY: false,
    onClose: () => {
    },
    onOk: () => {

    }
}
const Modal = ({children, title, footer, visible, onClose, fullX, header, onOk, okText, cancelText}) => {
    if (!visible) {
        return null
    }
    return <div
        className={"modal fixed w-full h-full top-0 left-0 bottom-0 inline-block flex items-center justify-center pointer-events-none z-50 " + (!visible ? "opacity-0" : "z-40 pointer-events-auto")}>
        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" onClick={onClose}/>

        <div
            className={"modal-container fixed overflow-x-hidden overflow-y-auto bg-white rounded shadow-lg mx-10 md:mx-0 " + (fullX ? "mx-auto" : "")}
            style={{
                maxWidth: 1000,
                maxHeight: "calc(100vh)",
                zIndex: 1000,
                minWidth: 388
            }}>
            <div className="modal-content py-4 text-left px-6">
                {
                    header && <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">{title}</p>
                        <div className="modal-close cursor-pointer z-50" onClick={onClose}>
                            <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18"
                                 onClick={onClose}
                                 height="18" viewBox="0 0 18 18">
                                <path
                                    d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                            </svg>
                        </div>
                    </div>
                }

                {children}


            </div>
            {
                footer &&
                <div className="flex md:justify-center justify-around py-6 md:py-8"
                     style={{backgroundColor: "rgb(236, 236, 236)"}}>
                    <div className={"flex justify-center flex-col"}>
                        <NFTButton onClick={onClose} title={cancelText ? cancelText : "Cancel"} type={"cancel"}/>
                    </div>
                    {/*<button*/}
                    {/*    className="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400 uppercase">Create*/}
                    {/*    Offer*/}
                    {/*</button>*/}
                    <div className={"flex justify-center flex-col items-center"}>
                        <NFTButton onClick={onOk} title={okText ? okText : "Submit"}/>
                    </div>
                </div>
            }
        </div>
    </div>
}

Modal.defaultProps = defaultProps;
export default Modal