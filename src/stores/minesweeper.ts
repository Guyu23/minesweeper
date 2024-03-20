import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMinesweeperStore = defineStore('gameStatus', () => {
    type GameStatus = 'playing' | 'won' | 'lost'

    const gameStatus = ref<GameStatus>('playing')
    const mineGenerated = ref(false)
    const clickBlock = ref<BlockState>()

    function setGameStatus(status: GameStatus) {
      gameStatus.value = status
    }

    function changeMineGenerated(status: boolean) {
      mineGenerated.value = status
    }

    return {
      gameStatus,
      mineGenerated,
      clickBlock,
      setGameStatus,
      changeMineGenerated,
    }
})

export interface BlockState {
  x: number
  y: number
  id: string
  revealed: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
  delay: number
}
