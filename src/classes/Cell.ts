import p5 from 'p5'
import { $ARIA_ACTION } from '../config'

interface ICell {
  instance: p5
  i: number
  j: number
  width: number
  grid: Cell[][]
}

export class Cell {
  public mine
  public revealed = false
  private p: p5
  private i: number
  private j: number
  private x: number
  private y: number
  private width: number
  private neighbourCount: number
  private grid: Cell[][]

  constructor({ instance: p, i, j, width, grid }: ICell) {
    this.p = p // Store the p5 instance
    this.i = i
    this.j = j
    this.x = i * width
    this.y = j * width
    this.width = width
    this.mine = false
    this.neighbourCount = 0
    this.grid = grid
  }

  /**
   * Show the cell on the canvas
   */
  public show() {
    this.p.stroke(0) // Draw a black border around the cell
    this.p.noFill() // Don't fill the cell
    this.p.rect(this.x, this.y, this.width, this.width) // Draw a rectangle to represent a safe cell

    if (this.revealed) {
      if (this.mine) {
        this.p.fill(127) // Fill the cell with a grey color
        this.p.ellipse(
          this.x + this.width * 0.5,
          this.y + this.width * 0.5,
          this.width * 0.5
        ) // Draw a circle to represent a mine
      } else {
        this.p.fill(200) // Fill the cell with a light grey color
        this.p.rect(this.x, this.y, this.width, this.width) // Draw a rectangle to represent a safe cell
        if (this.neighbourCount > 0) {
          this.p.textAlign(this.p.CENTER) // Center the text
          this.p.fill(0)
          this.p.text(
            this.neighbourCount,
            this.x + this.width * 0.5,
            this.y + this.width / 1.5
          ) // Draw the number of mines around the cell (if any
        }
      }
    }
  }

  /**
   * Check if the given coordinates are inside the cell
   */
  public contains(x: number, y: number) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.width
    )
  }

  /**
   * Reveal the cell
   */
  public reveal() {
    this.revealed = true

    if (this.mine) {
      $ARIA_ACTION.textContent = `Mine revealed at row ${this.i + 1}, column ${
        this.j + 1
      }. Game over.`
    } else {
      const message =
        this.neighbourCount > 0
          ? `Revealed cell at row ${this.i + 1}, column ${this.j + 1}. ${
              this.neighbourCount
            } mines detected nearby.`
          : `Revealed cell at row ${this.i + 1}, column ${
              this.j + 1
            }. No mines nearby.`
      $ARIA_ACTION.textContent = message
    }

    if (this.neighbourCount === 0) {
      this.floodFill()
    }
  }

  /**
   * Count the number of mines around the cell
   */
  public countMines() {
    if (this.mine) {
      this.neighbourCount = -1
      return
    }

    let total = 0
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        let i = this.i + xOffset
        let j = this.j + yOffset
        if (
          i > -1 &&
          i < this.grid.length &&
          j > -1 &&
          j < this.grid[0].length
        ) {
          if (this.grid[i][j].mine) {
            total++
          }
        }
      }
    }

    this.neighbourCount = total
  }

  /**
   * Flood fill the grid
   */
  private floodFill() {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        let i = this.i + xOffset
        let j = this.j + yOffset
        if (
          i > -1 &&
          i < this.grid.length &&
          j > -1 &&
          j < this.grid[0].length
        ) {
          if (!this.grid[i][j].mine && !this.grid[i][j].revealed) {
            this.grid[i][j].reveal()
          }
        }
      }
    }
  }
}
