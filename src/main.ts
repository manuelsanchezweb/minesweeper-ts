import p5 from 'p5'
import { make2DArray } from './utils'
import { Cell } from './classes/Cell'

// p5 with typescript has to run in instance mode, not global, that is why this wrapping
const sketch = (p: p5) => {
  let grid: Cell[][]
  let COLS: number
  let ROWS: number
  let CELL_SIZE = 20

  p.setup = () => {
    p.createCanvas(400, 400)
    COLS = p.width / CELL_SIZE
    ROWS = p.height / CELL_SIZE
    grid = make2DArray(COLS, ROWS)
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j] = new Cell({
          instance: p,
          x: i * CELL_SIZE,
          y: j * CELL_SIZE,
          width: CELL_SIZE,
        })
      }
    }
    // Add your setup code here
  }

  p.draw = () => {
    // Add your drawing code here
    p.background(255)
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        grid[i][j].show()
      }
    }
  }
}

new p5(sketch)
