import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [gameMode, setGameMode] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    tie: 0
  });

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]            
  ];

  const checkWinner = (boardState) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        setWinner(boardState[a]);
        setWinningLine(combo);
        updateScore(boardState[a]);
        return;
      }
    }

    if (!boardState.includes(null)) {
      setWinner('tie');
      updateScore('tie');
    }
  };

  const updateScore = (winner) => {
    setScores(prevScores => ({
      ...prevScores,
      [winner]: prevScores[winner] + 1
    }));
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    
    checkWinner(newBoard);
  };

  //random moves for cpu in single player
  useEffect(() => {
    if (gameMode === 'single' && !isXNext && !winner) {
      const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === null) acc.push(index);
        return acc;
      }, []);

      if (emptyCells.length > 0) {
        const timeout = setTimeout(() => {
          const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          const newBoard = [...board];
          newBoard[randomIndex] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
          checkWinner(newBoard);
        }, 500);

        return () => clearTimeout(timeout);
      }
    }
  }, [isXNext, board, gameMode, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const backToModeSelection = () => {
    resetGame();
    setGameMode(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, tie: 0 });
  };

  const renderCell = (index) => {
    const isWinningCell = winningLine.includes(index);
    
    return (
      <div 
        key={index}
        onClick={() => handleClick(index)} 
        className={`cell ${isWinningCell ? 'winning-cell' : ''} ${darkMode ? 'dark' : 'light'}`}
      >
        {board[index]}
      </div>
    );
  };


  if (gameMode === null) {
    return (
      <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="toggle-container">
          <div className="toggle-switch">
            <label className="switch-label">
              <input type="checkbox" className="checkbox" checked={!darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        
        
        <div className="header">
          <div className="title-container">
            <h1>TicTacToe</h1>
            <a href="https://github.com/CimanesDev" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>by CimanesDev</h2>
            </a>
          </div>
        </div>

        <div className="mode-selection">
          <button onClick={() => setGameMode('single')}>
            1 Player
          </button>
          <button onClick={() => setGameMode('multi')}>
            2 Players
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="toggle-container">
        <div className="toggle-switch">
          <label className="switch-label">
            <input type="checkbox" className="checkbox" checked={!darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="header">
        <div className="title-container">
          <h1>TicTacToe</h1>
          <a href="https://github.com/CimanesDev" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>by CimanesDev</h2>
          </a>
        </div>
      </div>
      
      <div className="game-info">
        <h3>
          {gameMode === 'single' ? '1 Player Mode' : '2 Player Mode'}
        </h3>
        <div className="scoreboard">
          <div>
            <p>X: {scores.X}</p>
          </div>
          <div>
            <p>Ties: {scores.tie}</p>
          </div>
          <div>
            <p>O: {scores.O}</p>
          </div>
        </div>
        {!winner && (
          <p className="turn-indicator">
            {isXNext ? 'X' : 'O'}'s turn
          </p>
        )}
      </div>
      
      {winner && (
        <div className="winner-announcement">
          <h2>
            {winner === 'tie' ? "It's a tie!" : `${winner} wins!`}
          </h2>
        </div>
      )}
      
      <div className="game-board">
        {board.map((_, index) => renderCell(index))}
      </div>
      
      <div className="game-controls">
        <button onClick={resetGame}>
          New Game
        </button>
        <button onClick={resetScores}>
          Reset Scores
        </button>
        <button onClick={backToModeSelection}>
          Change Mode
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;