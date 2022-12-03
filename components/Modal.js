import { motion } from "framer-motion"
import styled from "styled-components"
import CloseIcon from "./icon/CloseIcon"


function Modal({
   onClose,
   children,
   title,
   icon,
   marginTop = "50px",
   height="500px",
   width="300px",
   btnSubmitName = "ยืนยัน",
   isBtnSubmit = false
}) {
   const handleCloseClick = (e) => {
      e.preventDefault()
      onClose()
   }
   
   return (
      <motion.div
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         // transition={{ ease: "easeOut", duration: 0.5 }}
      >
         <StyledModalOverlay>
            <motion.div
               initial={{ y: 100 }}
               whileInView={{ y: 0 }}
               // transition={{ duration: 0.5 }}
            >
               <StyledModal marginTop={marginTop}>
                  <StyledModalHeader>
                     {title && icon && (
                        <StyledModalTitle>
                           <span>{icon}</span>
                           {title}
                        </StyledModalTitle>
                     )}
                     {title && !icon && <StyledModalTitle>{title}</StyledModalTitle>}

                     <StyleModalCloseButton onClick={handleCloseClick}>
                        <motion.div whileHover={{ scale: 1.1 }}>
                           <CloseIcon />
                        </motion.div>
                     </StyleModalCloseButton>
                  </StyledModalHeader>
                  <StyledModalBody height={height} width={width}>{children}</StyledModalBody>
                  <StyledModalFooter>
                     <button>ยกเลิก</button>
                     {isBtnSubmit && (
                        <button type="submit">{btnSubmitName}</button>
                     )}
                  </StyledModalFooter>
               </StyledModal>
            </motion.div>
         </StyledModalOverlay>
      </motion.div>
   )
}

const StyledModalFooter = styled.div`
  position: absolute;
  bottom: 0;
  padding: 10px;
  width: 100%;
  height: 60px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 2px 2px 0 0;
  display: flex;
  justify-content: end;
  gap: 5px;
  & > button {
    cursor: pointer;
  }
`

const StyledModalTitle = styled.h2`
  margin: 0;
  height: 44.5px;
  display: flex;
  align-items: center;
  font-weight: 400;
  & > span {
    padding: 2px;
    align-self: end;
    margin-right: 1px;
  }
`
const StyledModalBody = styled.div`
  padding: 0px 20px 70px 20px;
  min-width: 350px;
  width: ${props => props.width};
  height: ${props => props.height};
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
`
const StyleModalCloseButton = styled.button`
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  color: rgba(0, 0, 0, 0.3);
`

const StyledModalHeader = styled.div`
  color: rgba(0, 0, 0, 0.7);
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  border-radius: 0 0 4px 4px;
`

const StyledModal = styled.div`
  position: relative;
  background: white;
  border-radius: 2px;
  margin-top: ${(props) => props.marginTop};
  margin-left: 10px;
  margin-right: 10px;
`
const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`

export default Modal
