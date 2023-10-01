import { useEffect, useState } from "react";
import ScoreBoard from "./components/ScoreBoard";

import blueCandy from "./assets/blue-candy.png";
import greenCandy from "./assets/green-candy.png";
import orangeCandy from "./assets/orange-candy.png";
import purpleCandy from "./assets/purple-candy.png";
import redCandy from "./assets/red-candy.png";
import yellowCandy from "./assets/yellow-candy.png";
import blank from "./assets/blank.png";

// making 64 positions.
// we want an 8 by 8 board.
const width = 8;

// candyColors
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width + width];
      const decidedColor = currentColorArrangement[i];

      // checking if each square in the column of three is...
      // equal to the decidedColor.
      if (
        columnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        setScoreDisplay((score) => score + 3)
        // deleting the matched squares
        columnOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width + width, i + width * 3];
      const decidedColor = currentColorArrangement[i];

      // checking if each square in the column of three is...
      // equal to the decidedColor.
      if (
        columnOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        setScoreDisplay((score) => score + 4)
        // deleting the matched squares
        columnOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];

      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      // it will skip the current iteration
      if (notValid.includes(i)) continue;

      // checking if each square in the column of three is...
      // equal to the decidedColor.
      if (
        rowOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        setScoreDisplay((score) => score + 3)
        // deleting the matched squares
        rowOfThree.forEach((square) => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];

      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      // it will skip the current iteration
      if (notValid.includes(i)) continue;

      // checking if each square in the column of three is...
      // equal to the decidedColor.
      if (
        rowOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        setScoreDisplay((score) => score + 4)
        // deleting the matched squares
        rowOfFour.forEach((square) => (currentColorArrangement[square] = blank));
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }
      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  console.log(scoreDisplay);

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = () => {

    // parseInt to convert string to number
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );

    currentColorArrangement[squareBeingReplacedId] =
      squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute('src');

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
    ];
    // checking if the square to be replaced is among...
    // the valid moves.
    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (
      squareBeingReplacedId &&
      validMove &&
      (isARowOfFour || isARowOfThree || isAColumnOfFour || isAColumnOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] =
        squareBeingDragged.getAttribute('src');

      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  // creating a function that generates 64
  const createBoard = () => {
    // we are going to save the randomColorArrangment to
    // the state.
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      // randomly select colors
      // randomly select a color from the list
      const randomNumberFrom0to5 = Math.floor(
        Math.random() * candyColors.length
      );
      const randomColor = candyColors[randomNumberFrom0to5];
      randomColorArrangement.push(randomColor);
    }

    // this will keep trigerring the useState...
    // and causing a re-render leading to and
    // infinite render loop
    setCurrentColorArrangement(randomColorArrangement);
  };

  // calling the function
  // this function will trigger an infinite render,
  // if we don't use it inside a useEffect
  // we want this function to run once.
  useEffect(() => {
    createBoard();
  }, []);

  // everytime the checkForColumnOfThree function changes, we are
  // going to check for the three matches along a column.
  useEffect(() => {
    // we want to check for the columnOfThree
    // every 100 milliseconds
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      // setting a new currentColorArrangment
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  // console.log(currentColorArrangement);

  return (
    <div className="app">
      <div className="game">
        {/* iterating through an array */}
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;
