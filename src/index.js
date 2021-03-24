import React from "react";

import ReactDOM from "react-dom";

import './index.css';


function Square(props){
  const winningSquareStyle = {
    backgroundColor: '#ccc'
  };

  return (
    <button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square
       value={this.props.squares[i]}
       onClick={() => this.props.onClick(i)}
       winningSquare = {winningSquare}
      />
    );
  }

  render() {
    let boardSquares = [];
    for(let row = 0; row < 3; row++){
      let boardRow = [];
      for(let col = 0; col < 3; col++){
        boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props){
  super(props);
  this.state = {
    history : [{
      squares : Array(9).fill(null),
      clickedSquare : [0,0]
    }],
    stepNumber: 0,
    xIsNext: true,
    ascending: true,
  };

  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)|| squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const row = checkrow(i)
    const col = checkcol(i)
    this.setState(
      { history : 
           history.concat([{squares : squares, 
                          clickedSquare : [col,row]}
                        ]),
        
      stepNumber: history.length,
      xIsNext : !this.state.xIsNext,
      }
      );
  }

  sortHandleClick(){
    this.setState({
      ascending: !this.state.ascending
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const active = {
      fontWeight: 'bold'
    };

    const inactive = {
      fontWeight: 'normal'
    };
    const history = this.state.history
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)
    const clickedSquare = current.clickedSquare
    const ascending = this.state.ascending;
    //array.map(function(currentValue, index, arr), thisValue)
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move (col, row) => (' +clickedSquare[0]+","+clickedSquare[1]+")":
        'Go to game start';
      return (
          <li key={move}>
            <button style={this.state.stepNumber === move ? active : inactive} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
    });
   
    let status;
    if (winner){
      status = 'Winner is ' + winner.winner
    }else{
      if (history.length === 10){
        status = 'Its a Draw loosers!!';
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      }
         
    return (
      <div className="game">
        <div className="game-board">
          <Board 
              squares = {current.squares} 
              onClick = {(i) => this.handleClick(i)}
              winner={winner && winner.winningSquares}
          />
        </div>
        <div className="game-info">
          <div>
            {status}
          </div>
          <div><button onClick={() => this.sortHandleClick(moves)}>Toggle Sort Order</button></div>
          
          <ul>{ascending ? moves : moves.reverse()}</ul>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i]
      };
    }
  }
  return null;
}

// Or simply use clickedSquare:[Math.floor((i % 3) + 1), Math.floor((i / 3) + 1)] instead of below
function checkrow(i){
  if (i>=0 && i <=2){
    return 1
  }else if (i>=3 && i <=5){
    return 2
  }else{
    return 3
  }
}

function checkcol(i){
  if (i === 0 || i === 3 || i === 6 ){
    return 1
  }else if (i === 1 || i === 4 || i === 7 ){
    return 2
  }else{
    return 3
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
