import './style.css'
import p5 from 'p5'
import { make2DArray } from './utils'
import { Cell } from './classes/Cell'
import {
  $ARIA_ACTION,
  $ARIA_GENERAL,
  CELL_SIZE,
  MINES_PER_LEVEL,
} from './config'

// p5 with typescript has to run in instance mode, not global, that is why this wrapping
const sketch = (p: p5) => {
  let grid: Cell[][]
  let COLS: number
  let ROWS: number
  let numberOfMines: number = MINES_PER_LEVEL.EASY
  let gameOverFlag = false

  const restartGame = () => {
    gameOverFlag = false
    // Reset game state here, similar to your existing setup function
    // Reset numberOfMines if necessary
    p.setup() // Call setup again to reinitialize the game
    $ARIA_GENERAL.textContent = `Number of mines: ${numberOfMines}. Number of cells: ${
      COLS * ROWS
    }. Click on a cell to reveal it.`
  }

  p.setup = () => {
    p.createCanvas(400, 400)
    COLS = Math.floor(p.width / CELL_SIZE)
    ROWS = Math.floor(p.height / CELL_SIZE)
    grid = make2DArray(COLS, ROWS)

    // Populate the grid with cells
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j] = new Cell({
          instance: p,
          i: i,
          j: j,
          width: CELL_SIZE,
          grid: grid,
        })
      }
    }

    // Pick total number of mines randomly
    let options = []
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        options.push([i, j])
      }
    }
    for (let n = 0; n < numberOfMines; n++) {
      let index = Math.floor(p.random(options.length))

      let choice = options[index]
      let i = choice[0]
      let j = choice[1]
      // Deletes that spot so it's no longer an option
      options.splice(index, 1)

      grid[i][j].mine = true
    }

    // Count the number of mines around each cell
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j].countMines()
      }
    }

    $ARIA_GENERAL.textContent = `Number of mines: ${numberOfMines}. Number of cells: ${
      COLS * ROWS
    }. Click on a cell to reveal it.`
  }

  p.draw = () => {
    p.background(255)
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j].show()
      }
    }
  }

  const checkWin = () => {
    let win = true
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        if (!grid[i][j].mine && !grid[i][j].revealed) {
          win = false
          break
        }
      }
      if (!win) break
    }

    if (win) {
      $ARIA_GENERAL.textContent = `Congratulations, you won! Click on the canvas to restart the game.`
    }

    return win
  }

  const gameOver = () => {
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j].revealed = true
      }
    }
  }

  p.mousePressed = () => {
    if (gameOverFlag) {
      restartGame()
      return
    }

    const col = Math.floor(p.mouseX / CELL_SIZE)
    const row = Math.floor(p.mouseY / CELL_SIZE)

    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      $ARIA_ACTION.textContent = `Clicked on cell ${col}, ${row}`
      grid[col][row].reveal()

      if (grid[col][row].mine) {
        $ARIA_GENERAL.textContent = `Game over! You clicked on a mine. Click on the canvas to restart the game.`

        gameOverFlag = true
        gameOver()
      } else if (checkWin()) {
        gameOverFlag = true
      }
    }
  }
}

new p5(sketch)
