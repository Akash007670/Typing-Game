import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const getWords = () =>
  `Last month a grand exhibit interesting sight, what attracted us most was the Children's Corner in the exhibition. The Children's Corner was crowded with boys and girls. All types of amusements could be seen here. Children and some grown-ups were enjoying the giant wheel, wooden hoses, dodge-cars, railway train and other things. I too had my share of fun with my friends and returned home after enjoying a most delightful evening. 
   `.split(" ");

function WordData(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className="correct">{text} </span>;
  }
  if (correct === false) {
    return <span className="incorrect">{text} </span>;
  }

  if (active) {
    return <span className="active">{text} </span>;
  }

  return <span>{text} </span>;
}

WordData = React.memo(WordData);

//setting up a timer

function Timer(props) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { correctWords, startCounting } = props;

  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(id);
    };
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  return (
    <div className="timer">
      <span>
        <b>Time :</b> {timeElapsed}
      </span>
      <span>
        <b>WPM :</b> {(correctWords / minutes || 0).toFixed(2)}
      </span>
      <span>
        <b>Incorrect words :</b> {!correctWords}
      </span>
    </div>
  );
}

function App() {
  const [userInput, setUserInput] = useState("");
  const words = useRef(getWords());
  const [startCounting, setStartCounting] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);

  const processInput = (value) => {
    if (activeWordIndex === words.current.length - 1) {
      return;
    }
    if (!startCounting) {
      setStartCounting(true);
    }
    if (value.endsWith(" ")) {
      if (activeWordIndex === words.current.length - 1) {
        setStartCounting(false);
      } else {
        setUserInput("completed");
      }
      setActiveWordIndex((index) => index + 1);
      setUserInput(" ");
      setStartCounting(true);

      //correct word
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === words.current[activeWordIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  };

  return (
    <div className="App">
      <h1 className="title">Typing test </h1>
      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />
      <div className="paragrafh-wrapper">
        <p>
          {words.current.map((word, index) => {
            return (
              <WordData
                text={word}
                active={index === activeWordIndex}
                correct={correctWordArray[index]}
              />
            );
          })}
        </p>
      </div>
      <input
        className="input-area"
        type="text"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
        placeholder="Enter the words here"
      />
    </div>
  );
}

export default App;
