import { useState, useEffect } from "react";
import styled from "styled-components";

interface SeatProps {
  number: number;
}

const Container = styled.div<{ $backgroundColor: string }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 20px;
  border: 1px solid #000;
  background: ${(props) => props.$backgroundColor};
  padding: 20px;
  width: 300px;
  height: 200px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const NumberText = styled.p`
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 30px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  margin: 0;
`;

const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TextContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  text-align: start;
`;

const Text = styled.span`
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #ec85ab;
  height: 43px;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border: 1px solid white;
  cursor: pointer;
`;

const Seat = ({ number }: SeatProps) => {
  const [isUsing, setIsUsing] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `seat-${number}`;

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const seatData = JSON.parse(savedData);
      setIsUsing(seatData.isUsing);
      setStartTime(seatData.startTime ? new Date(seatData.startTime) : null);
      setEndTime(seatData.endTime ? new Date(seatData.endTime) : null);
    }
    setIsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!isLoaded) return;

    if (isUsing && startTime && endTime) {
      const seatData = {
        isUsing,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(seatData));
    }
  }, [isUsing, startTime, endTime, storageKey, isLoaded]);

  const calculateRemainingTime = () => {
    if (!startTime || !endTime) return "";

    const now = new Date();
    const remaining = endTime.getTime() - now.getTime();

    if (remaining <= 0) {
      return "시간 종료";
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getBackgroundColor = () => {
    if (!isUsing) return "#fff";
    if (remainingTime === "시간 종료") return "#FF4639";

    const [hours, minutes] = remainingTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= 30) return "#FFD93F"; // 30분 이하일 때 노란색
    return "#FEEAF3";
  };

  useEffect(() => {
    let interval: number | null = null;

    if (isUsing && startTime && endTime) {
      interval = setInterval(() => {
        setRemainingTime(calculateRemainingTime());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isUsing, startTime, endTime]);

  const onClick = () => {
    if (!isUsing) {
      const now = new Date();
      const end = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2시간 추가
      setStartTime(now);
      setEndTime(end);
      setIsUsing(true);
    } else {
      setIsUsing(false);
      setStartTime(null);
      setEndTime(null);
      setRemainingTime("");
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <Container $backgroundColor={getBackgroundColor()}>
      <NumberText>{number}번</NumberText>
      <TextWrapper>
        <TextContainer>
          <Text>시작 시간: </Text>
          <Text>{startTime ? formatTime(startTime) : ""}</Text>
        </TextContainer>
        <TextContainer>
          <Text>종료 시간: </Text>
          <Text>{endTime ? formatTime(endTime) : ""}</Text>
        </TextContainer>
      </TextWrapper>
      <Button type="button" onClick={onClick}>
        {isUsing ? "이용 종료" : "이용 시작"}
      </Button>
    </Container>
  );
};

export default Seat;
