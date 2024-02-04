/**
 * The size of the grid cells
 */
export const CELL_SIZE = 40

/**
 * The number of mines per level of difficulty
 */
export const MINES_PER_LEVEL = {
  EASY: 2,
  MEDIUM: 20,
  HARD: 30,
}

/**
 * The ARIA live region element
 */
export const $ARIA_GENERAL = document.querySelector(
  '[data-a11y-general]'
) as HTMLDivElement
export const $ARIA_ACTION = document.querySelector(
  '[data-a11y-action]'
) as HTMLDivElement
