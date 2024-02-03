export function make2DArray(cols: number, rows: number) {
  let arr = new Array(cols)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows)
  }
  return arr
}
