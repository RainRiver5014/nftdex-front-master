import styled from "styled-components";

const Wrapper = styled.div`{
  .hide-scroll-bar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
  }
}`

const HorizontalMasonry = ({children}) => {
    return <Wrapper
        className="flex overflow-x-scroll hide-scroll-bar"
    >
        <div
            className="flex flex-nowrap"
        >
            {children}
        </div>
    </Wrapper>
}

export default HorizontalMasonry;