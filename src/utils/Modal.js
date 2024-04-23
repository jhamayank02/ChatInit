import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

const Backdrop = (props)=>{
    const dispatch = useDispatch();
    return <div onClick={() => dispatch(props.hideModal())} className="z-20 h-[-webkit-fill-available] w-[100%] fixed opacity-50 bg-[#8a8a8a]">
    </div>
}

const ModalOverlay = ({children, top, right})=>{
    return <div className="overflow-x-hidden overflow-y-auto z-30 bg-white px-5 py-10 rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] max-h-[1400px] md:w-[80%] xl:w-[500px] xl:max-h-[550px]">
        {children}
    </div>
}

const Modal = (props)=>{
    const portalElement = document.getElementById('overlays');

    return (
        <>
            {ReactDOM.createPortal(<Backdrop hideModal={props.hideModal}></Backdrop>, portalElement)}
            {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
        </>
    )
}

export default Modal;