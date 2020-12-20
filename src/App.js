import React, { useState, useEffect } from "react";
import './App.css';

const App = () => {
  const [board, setBoard] = useState({
    columns: 7,
    rows: 6,
  });

  const [players, setPlayers] = useState({
    Player1: true,
    Player2: false,
  });

  const [boardArray, setBoardArray] = useState([]);

  const [message, setMessage] = useState("Player1's turn");

  useEffect(() => {
    const boardFinal = [];
    for (let i = 0; i < board.columns; i++) {
      let column = []
      for (let j = 0; j < board.rows; j++) {
        column.push({ cellNumber: j, played: "disc" });
      }
      boardFinal.push(column);
    }
    setBoardArray(boardFinal);
    setPlayers({
      Player1: true,
      Player2: false,
    })
    setMessage("Player1's turn")
  }, [board]);

  const play = (i) => {
    let playedCellIndex = boardArray[i].findIndex((column) => column.played === "disc");
    if (playedCellIndex === -1) {
      setMessage("No more spots available, try another column");
    } else {
      setBoardArray(boardArray.map((element, index) => {
        if (index === i && players.Player1) {
          element[playedCellIndex].played = "Player1";
          setPlayers({ Player1: !players.Player1, Player2: !players.Player2 });
          setMessage("Player2's turn");
        } else if (index === i) {
          element[playedCellIndex].played = "Player2";
          setPlayers({ Player1: !players.Player1, Player2: !players.Player2 })
          setMessage("Player1's turn");
        }
        return element;
      }));
      if (playedCellIndex > 2) {
        verticalWin(boardArray[i]);
      }
      horizontalWin(boardArray, playedCellIndex);
      diagonalRightWin(boardArray);
      diagonalLeftWin(boardArray);
      draw(boardArray);
    }

  }

  const verticalWin = (column) => {
    let count = 0;
    for (let i = 3; i < column.length; i++) {
      if (column[i].played !== 'disc') {
        for (let j = i - 3; j < column.length; j++) {
          if (count === 4) {
            count = 0;
            setMessage(`${column[i].played} is the winner`);
            break;
          }
          if (column[i].played === column[j].played) {
            count++;
          } else {
            count = 0;
          }
        }
      }
    }
  }

  const horizontalWin = (column, cellIndex) => {
    let count = 0;
    for (let i = 3; i < column.length; i++) {
      if (column[i][cellIndex].played !== 'disc') {
        for (let j = 0; j < column.length; j++) {
          if (count === 4) {
            count = 0;
            setMessage(`${column[i][cellIndex].played} is the winner`);
            break;
          }
          if (column[i][cellIndex].played === column[j][cellIndex].played) {
            count++;
          } else {
            count = 0;
          }
        }
      }
      count = 0;
    }
  }

  const diagonalRightWin = boardArr => {
    for (let i = 0; i < board.columns - 3; i++) {
      for (let j = 0; j < board.rows - 3; j++) {
        if (boardArr[i][j].played !== 'disc') {
          if (boardArr[i][j].played === boardArr[i + 1][j + 1].played &&
            boardArr[i][j].played === boardArr[i + 2][j + 2].played &&
            boardArr[i][j].played === boardArr[i + 3][j + 3].played) {
            setMessage(`${boardArr[i][j].played} is the winner`);
            break;
          }
        }
      }
    }
  }

  const diagonalLeftWin = boardArr => {
    for (let i = 0; i < board.columns - 3; i++) {
      for (let j = board.rows - 1; j > 2; j--) {
        if (boardArr[i][j].played !== 'disc') {
          if (boardArr[i][j].played === boardArr[i + 1][j - 1].played &&
            boardArr[i][j].played === boardArr[i + 2][j - 2].played &&
            boardArr[i][j].played === boardArr[i + 3][j - 3].played) {
            setMessage(`${boardArr[i][j].played} is the winner`);
            break;
          }
        }
      }
    }
  }

  const draw = boardArr => {
    let count = 0;
    for (const column of boardArr) {
      for (const cell of column) {
        if (cell.played.includes('disc')) {
          count = 0;
          break;
        }
        count++;
      }
    };
    if (count === board.columns * board.rows) {
      setMessage(`Draw, there is no the winner`);
    }
  }


  const reset = () => {
    setBoard({
      columns: 7,
      rows: 6,
    });
  }

  return (
    <div className="App">
      <p className="message">{message}</p>
      <div className="board">
        {
          boardArray.map((column, i) => {
            return (
              <div className="column" key={i} id={`column${i}`} onClick={message.includes('winner') ? null : () => play(i)}>
                {column.map((cell, j) => {
                  return (
                    <div className="cell" key={j} id={`cell${i},${cell.cellNumber}`}>
                      <div className={boardArray[i][j].played} key={j} id={`cell${i},${cell.cellNumber}`} />
                    </div>
                  )
                })}
              </div>
            );
          })
        }
      </div>

      <button onClick={reset}>New Game</button>
    </div>
  );
}

export default App;
