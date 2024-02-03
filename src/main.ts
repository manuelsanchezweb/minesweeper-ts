import './style.css'
import p5 from 'p5'
import { make2DArray } from './utils'
import { Cell } from './classes/Cell'
import { CELL_SIZE } from './config'

// p5 with typescript has to run in instance mode, not global, that is why this wrapping
const sketch = (p: p5) => {
  let grid: Cell[][]
  let COLS: number
  let ROWS: number

  p.setup = () => {
    p.createCanvas(400, 400)
    COLS = Math.floor(p.width / CELL_SIZE)
    ROWS = Math.floor(p.height / CELL_SIZE)
    grid = make2DArray(COLS, ROWS)
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

    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j].countMines()
      }
    }
  }

  p.draw = () => {
    p.background(255)
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j].show()
      }
    }
  }

  p.mousePressed = () => {
    const col = Math.floor(p.mouseX / CELL_SIZE)
    const row = Math.floor(p.mouseY / CELL_SIZE)

    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      console.log('Clicked on cell', col, row)
      grid[col][row].reveal()
      grid[col][row].countMines()
    }
  }
}

new p5(sketch)
