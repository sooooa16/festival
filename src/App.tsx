import styled from "styled-components";
import Seat from "./components/Seat";

function App() {
  const Wrapper = styled.div`
    width: 100vw;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    padding: 40px;
  `;

  const TOTAL_SEAT = 60;

  return (
    <Wrapper>
      {Array.from({ length: TOTAL_SEAT }, (_, i) => (
        <Seat key={i + 1} number={i + 1} />
      ))}
    </Wrapper>
  );
}

export default App;
