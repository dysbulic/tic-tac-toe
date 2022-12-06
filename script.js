const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function Game() {
  this.board = Array(9)
  this.round = 1
}

function Player(name, marker, selections = []) {
  return {
    name,
    marker,
    selections,
    hasWon() {
      return winningConditions.some((cond) =>
        cond.every((idx) => this.selections.includes(idx))
      )
    },
  }
}

const game = new Game()
const players = [new Player('Duke', 'X'), new Player('Kude', 'O')]
const stat = document.getElementById('status')
const boxes = Array.from(document.querySelectorAll('.box'))
const wins = Object.fromEntries(
  players.map(({ marker }) => marker).map((mark) => [mark, 0])
)
let resetting = false

const reset = async (status = null) => {
  resetting = true
  try {
    await new Promise((accept) => setTimeout(accept, 4000))
    players.forEach((plr) => (plr.selections = []))
    boxes.forEach((box) => (box.textContent = ''))
    if (status) {
      stat.textContent = status
    }
  } finally {
    resetting = false
  }
}

boxes.forEach((elem) =>
  elem.addEventListener('click', ({ target: { id: idx } }) => {
    if (resetting) return
    if (elem.innerHTML === '') {
      ++game.round
    }
    const player = players[game.round % players.length]
    const next = players[(game.round + 1) % players.length]
    if (elem.innerHTML === '') {
      player.selections.push(Number(idx))
      elem.textContent = player.marker
    }
    // prettier-ignore
    stat.innerHTML = (
      `Round #${game.round} (<span title="${
        players.map(({ name, marker }) => `${name}: ${wins[marker]}`).join('\n')
      }">${
        players.map(({ marker }) => `${
          next.marker === marker ? '<span class="active">' : ''
        }${marker}${
          next.marker === marker ? '</span>' : ''
        }:${wins[marker]}`).join('/')
      }</span>)`
    )
    players.forEach((plr) =>
      console.log(`Player ${plr.name}: [${plr.selections}]`)
    )
    const winner = players.find((plr) => plr.hasWon())
    if (winner) {
      wins[winner.marker]++
      stat.textContent = `${winner.name} won!`
      game.round = 1
      reset('Tic-Tac-Toe')
    } else if ((game.round - 1) % 9 === 0) {
      stat.textContent = `${players.map(({ name }) => name).join(' & ')} drew!`
      reset('Try Again')
    }
  })
)
