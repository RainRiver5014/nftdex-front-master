import styled from "styled-components";

const Button = styled.button`{
  cursor: pointer;
  padding: 12px 14px;
  align-self: center;
  color: #BE2525;
  border-radius: 6px;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  background-color: #EDEDED;
  --tw-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  margin-bottom: 22px;
  @media (max-width: 768px) {
    margin-top: 20px;
    align-self: center;
  }
}`
const Cancel = styled.button`{
  cursor: pointer;
  padding: 12px 14px;
  align-self: center;
  border-radius: 6px;
  text-transform: uppercase;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 600;
  margin-bottom: 22px;
  @media (max-width: 768px) {
    margin-top: 20px;
    align-self: center;
  }
}`
const NFTButton = ({title, onClick, type, disabled}) => {
    if (type === "cancel") {
        return <Cancel disabled={disabled} className={"focus:outline-none focus:ring-0 focus:ring-transparent"}
                       onClick={onClick}>{title}</Cancel>
    }
    return <Button style={{
        opacity: disabled ? 0.25 : 1,
        pointerEvents: disabled ? "none" : "initial",
    }} disabled={disabled} className={"focus:outline-none focus:ring-0 focus:ring-transparent"}
                   onClick={ onClick}>{title}</Button>
}
export default NFTButton