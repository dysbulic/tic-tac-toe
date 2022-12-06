const Gameboard = (() => {
  const board = Array(9);
  let round = 0;
  return { round, board };
})();

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

Array.from(document.querySelectorAll(".box")).forEach((elem) =>
  elem.addEventListener("click", ({ target: { id: idx } }) => {
    if (elem.innerHTML === "") {
      const player = players[Gameboard.round++ % 2];
      player.selections.push(Number(idx));
      elem.innerHTML = player.marker;
    }
    console.log(`Round #${Gameboard.round}`);
    players.forEach((plr) =>
      console.log(`Player ${plr.name}: [${plr.selections}]`)
    );
    const winner = players.find((plr) => plr.hasWon());
    if (winner) {
      console.log(`Player ${winner.name} won!`);
    }
  })
);

function Player(name, marker, selections = []) {
  return {
    name,
    marker,
    selections,
    hasWon() {
      return winningConditions.some((cond) =>
        cond.every((idx) => this.selections.includes(idx))
      );
    },
  };
}

const players = [new Player("duke", "X"), new Player("kude", "O")];
