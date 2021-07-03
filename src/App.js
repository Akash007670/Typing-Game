import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const getWords = () =>
  `Last month a grand exhibition was held in our city. My friends and I went to see it in evening.

  Our first impression on entering the grounds was that whole thing looked like a fairyland. The vast space was decorated in magnificent, bright and purple colour and lit up with countless lights. Men, women and children were moving from corner to corner, admiring the beauty of all kinds of stalls set up. These stalls were like small shops.
  
  While the stalls made a very interesting sight, what attracted us most was the Children's Corner in the exhibition. The Children's Corner was crowded with boys and girls. All types of amusements could be seen here. Children and some grown-ups were enjoying the giant wheel, wooden hoses, dodge-cars, railway train and other things. I too had my share of fun with my friends and returned home after enjoying a most delightful evening. 
   `.split(" ");

function WordData(props) {
  const { text, active, correct } = props;

  const rerender = useRef(0);
  useEffect(() => {
    rerender.current += 1;
  });

  if (correct === true) {
    return (
      <span className="correct">
        {text} ({rerender.current}){" "}
      </span>
    );
  }
  if (correct === false) {
    return (
      <span className="incorrect">
        {text} ({rerender.current}){" "}
      </span>
    );
  }

  if (active) {
    return (
      <span className="active">
        {text} ({rerender.current}){" "}
      </span>
    );
  }

  return (
    <span>
      {text} ({rerender.current}){" "}
    </span>
  );
}

WordData = React.memo(WordData);

//setting up a timer

function Timer(props) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { correctWords, startCounting } = props;

  useEffect(() => {
    if (startCounting) {
      setInterval(() => {
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  return (
    <div>
      <span>Time : {timeElapsed}</span>
      <p>W.P.M : {(correctWords / minutes || 0).toFixed(2)}</p>
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
    if (!startCounting) {
      setStartCounting(true);
    }
    if (value.endsWith(" ")) {
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
      <h1>Typing test </h1>
      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />
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
      <input
        type="text"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
        placeholder="Enter the words here"
      />
    </div>
  );
}

export default App;
