<script lang="ts"
        setup
>
import { reactive } from 'vue'
import confetti from 'canvas-confetti'
import { getRandomId } from '../composables/utils'

interface BlockState {
  x: number
  y: number
  id: string
  revealed: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}

let WIDTH = 10
let HEIGHT = 10
const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from(
      { length: WIDTH },
      (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false, id: getRandomId(6) }),
    )),
)

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const numberColors = [
  'text-blue',
  'text-green',
  'text-cyan',
  'text-yellow',
  'text-pink',
  'text-orange',
  'text-purple',
  'text-red',
]

function checkDirections(block: BlockState, fn?: Function) {
  directions.forEach(([dx, dy]) => {
    const newX = block.x + dx
    const newY = block.y + dy
    if (newX < 0 || newX >= WIDTH || newY < 0 || newY >= HEIGHT)
      return
    const newBlock = state[newY][newX]
    if (fn) {
      if (newBlock.revealed || newBlock.flagged)
        return
      fn(newBlock)
    }
    else {
      if (newBlock.mine)
        block.adjacentMines += 1
    }
  })
}

function updateNumbers() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine)
        return
      checkDirections(block)
    })
  })
}

let mineGenerated = false
const dev = false

function expandWave(block: BlockState) {
  if (block.revealed)
    return
  block.revealed = true
  if (block.adjacentMines)
    return
  checkDirections(block, expandWave)
}

function onClick(block: BlockState) {
  if (!mineGenerated) {
    mineGenerated = true
    generateMines(block)
  }
  if (block.mine) {
    alert('lose')
    return
  }
  if (!block.flagged)
    expandWave(block)

  checkGameStates()
}

function flagBlock(block: BlockState) {
  !block.revealed && (block.flagged = !block.flagged)
  checkGameStates()
}

function generateMines(initialBlock: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (
        Math.abs(block.x - initialBlock.x) <= 1
        || Math.abs(block.y - initialBlock.y) <= 1
      )
        continue
      block.mine = Math.random() < 0.15
    }
  }
  updateNumbers()
}

function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-200/20'
  if (!block.revealed)
    return 'bg-gray-500/40'
  return block.mine ? 'bg-red/50' : numberColors[block.adjacentMines || 0]
}

function checkGameStates() {
  if (!mineGenerated)
    return
  const blocks = state.flat()
  if (blocks.every(block => block.revealed || (block.flagged && block.mine)))
    celebrate()
}

function celebrate() {
  const scalar = 3
  const unicorn = confetti.shapeFromText({ text: '🍔', scalar })
  const smile = confetti.shapeFromText({ text: '🍓', scalar })
  const lemon = confetti.shapeFromText({ text: '🍋', scalar })
  const defaults = {
    angle: 180,
    spread: 360,
    ticks: 120,
    gravity: 0,
    decay: 0.96,
    startVelocity: 20,
    shapes: [unicorn],
    scalar,
  }

  confetti({
    ...defaults,
    particleCount: 30,
  })

  confetti({
    ...defaults,
    particleCount: 20,
    shapes: [lemon],
  })

  confetti({
    ...defaults,
    particleCount: 10,
    shapes: [smile],
  })

  confetti({
    ...defaults,
    particleCount: 15,
    scalar: scalar / 2,
    shapes: ['circle'],
  })
}
</script>

<template>
  <div>
    Minesweeper
    <div
      v-for="(row, index) in state"
      :key="index"
      flex="~"
      items-center
      justify-center
    >
      <button
        v-for="block in row"
        :key="block.id"
        border="1 gray-400/30"
        flex="~"
        m1
        h-10
        w-10
        items-center
        justify-center
        font-bold
        transition-all
        hover="bg-gray-200/20"
        :class="getBlockClass(block)"
        @click="onClick(block)"
        @contextmenu.prevent="flagBlock(block)"
      >
        <template v-if="block.flagged">
          <div i-fxemoji:triangularflagonpost />
        </template>
        <template v-else-if="block.revealed || dev">
          <div
            v-if="block.mine"
            i-fxemoji-bomb
          />
          <div v-else>
            {{ block.adjacentMines || '' }}
          </div>
        </template>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
