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
  let level = localStorage.getItem('minesweeperLevel') || 'EASY'
  let numberOfMines: number = MINES_PER_LEVEL[level]
  let gameOverFlag = false
  let currentRow = 0
  let currentCol = 0

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

    updateDiscoveredSpots()
    addListenerSelect()
  }

  p.draw = () => {
    p.background(255)
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j].show(currentRow, currentCol) // Pass currentRow and currentCol here
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
    currentCol = col // Update currentCol to the clicked column
    currentRow = row

    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      $ARIA_ACTION.textContent = `Clicked on cell ${col}, ${row}`
      grid[col][row].reveal()
      updateDiscoveredSpots()

      if (grid[col][row].mine) {
        gameOverFlag = true
        gameOver()
      } else if (checkWin()) {
        gameOverFlag = true
      }
    }
  }

  p.keyPressed = () => {
    if (gameOverFlag && p.key === 'r') {
      restartGame()
    }

    switch (p.keyCode) {
      case p.LEFT_ARROW:
        currentCol = Math.max(currentCol - 1, 0)
        break
      case p.RIGHT_ARROW:
        currentCol = Math.min(currentCol + 1, COLS - 1)
        break
      case p.UP_ARROW:
        currentRow = Math.max(currentRow - 1, 0)
        break
      case p.DOWN_ARROW:
        currentRow = Math.min(currentRow + 1, ROWS - 1)
        break
      case p.ENTER:
      case 32: // Space key code
        if (
          currentCol >= 0 &&
          currentCol < COLS &&
          currentRow >= 0 &&
          currentRow < ROWS
        ) {
          grid[currentCol][currentRow].reveal()
          updateDiscoveredSpots()

          if (grid[currentCol][currentRow].mine) {
            gameOverFlag = true
            gameOver()
          } else if (checkWin()) {
            gameOverFlag = true
          }
        }
        break
    }

    updateARIAForCell(currentRow, currentCol)

    return false
  }

  function updateARIAForCell(row: number, col: number) {
    const cell = grid[col][row] // Ensure you access the correct cell based on your grid organization
    let ariaMsg = `Cell at row ${row + 1}, column ${col + 1} is `
    ariaMsg += cell.revealed
      ? cell.mine
        ? 'a mine. Game over.'
        : `${cell.neighbourCount} mines detected nearby.`
      : 'not revealed yet.'
    $ARIA_ACTION.textContent = ariaMsg
  }

  function updateDiscoveredSpots() {
    let discovered = 0
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        if (grid[i][j].revealed) {
          discovered++
        }
      }
    }
    const totalSpots = COLS * ROWS
    const totalSpotsWithoutMines = totalSpots - numberOfMines
    const undiscovered = totalSpotsWithoutMines - discovered
    const currentLevel = localStorage.getItem('minesweeperLevel') || 'EASY'

    $ARIA_GENERAL.textContent = `Level ${currentLevel}. There are ${numberOfMines} mines and ${totalSpots} spots in total, you have discovered ${discovered} / ${totalSpotsWithoutMines} spots. ${undiscovered} spots left to discover.`
  }

  function addListenerSelect() {
    const levelSelect = document.getElementById('level-select')
    levelSelect.value = localStorage.getItem('minesweeperLevel') || 'EASY'

    levelSelect.addEventListener('change', (e) => {
      const level = e.target.value
      localStorage.setItem('minesweeperLevel', level)

      restartGame()
    })
  }

  const restartGame = () => {
    gameOverFlag = false
    currentRow = 0 // Reset the currentRow to 0
    currentCol = 0 // Reset the currentCol to 0

    let level = localStorage.getItem('minesweeperLevel') || 'EASY'
    numberOfMines = MINES_PER_LEVEL[level]

    p.setup()

    updateARIAForCell(currentRow, currentCol)
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
      const currentLevel = localStorage.getItem('minesweeperLevel') || 'EASY'
      $ARIA_GENERAL.textContent = `Congratulations, you completed the ${currentLevel} level of difficulty! Click on the canvas or press R to restart the game.`
    }

    return win
  }

  const gameOver = () => {
    $ARIA_GENERAL.textContent = `Game over! You clicked on a mine. Click on the canvas to restart the game or press R.`

    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j].revealed = true
      }
    }
  }
}

new p5(sketch)
