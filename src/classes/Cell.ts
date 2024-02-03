import p5 from 'p5'

interface ICell {
  instance: p5
  x: number
  y: number
  width: number
}

export class Cell {
  public mine
  public revealed = false
  private p: p5
  private x: number
  private y: number
  private width: number

  constructor({ instance: p, x, y, width }: ICell) {
    this.p = p // Store the p5 instance
    this.x = x
    this.y = y
    this.width = width
    this.mine = this.p.random(1) < 0.5 // 50% chance of being a mine
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
}
