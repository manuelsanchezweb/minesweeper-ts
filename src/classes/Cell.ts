import p5 from 'p5'

interface ICell {
  instance: p5
  x: number
  y: number
  width: number
}

export class Cell {
  public mine = true
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
  }

  public show() {
    this.p.rect(this.x, this.y, this.width, this.width) // Draw a rectangle to represent a safe cell
  }
}
