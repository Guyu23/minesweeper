<script lang="ts"
    setup>
    import { ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useElementSize } from '@vueuse/core'
    import { getRandomId } from '../composables/utils'
    import WinOrLose from '~/components/WinOrLose.vue'
    import MineBlock from '~/components/MineBlock.vue'
    import MineFunctions from '~/components/MineFunctions.vue'
    import { useMinesweeperStore } from '~/stores/minesweeper'
    import type { BlockState } from '~/stores/minesweeper'

    const WIDTH = 10
    const HEIGHT = 10
    const mineSweeperStore = useMinesweeperStore()
    const { gameStatus } = storeToRefs(mineSweeperStore)
    const map = ref(null)

    const { width, height } = useElementSize(map)

    const state = ref(
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

    /**
     * 生成地雷
     */
    function generateMines(initialBlock: BlockState) {
        for (const row of state.value) {
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

    /**
     * 翻开方块或者计算周围地雷数量
     */
    function checkDirections(block: BlockState, fn?: Function) {
        directions.forEach(([dx, dy]) => {
            const newX = block.x + dx
            const newY = block.y + dy
            if (newX < 0 || newX >= WIDTH || newY < 0 || newY >= HEIGHT)
                return
            const newBlock = state.value[newY][newX]
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

    /**
     * 更新周围地雷数量
     */
    function updateNumbers() {
        state.value.forEach((row) => {
            row.forEach((block) => {
                if (block.mine)
                    return
                checkDirections(block)
            })
        })
    }

    /**
     * 检查游戏状态
     */
    function checkGameStates() {
        if (!mineSweeperStore.mineGenerated)
            return
        const blocks = state.value.flat()
        if (blocks.every(block => block.revealed || (block.flagged && block.mine)))
            gameStatus.value = 'won'
    }

    function resetGame() {
        mineSweeperStore.changeMineGenerated(false)
        mineSweeperStore.setGameStatus('playing')
        state.value = Array.from({ length: HEIGHT }, (_, y) =>
            Array.from(
                { length: WIDTH },
                (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false, id: getRandomId(6) }),
            ))
    }
</script>

<template>
    <div>
        <div font-fun
            text-2xl
            m4>Minesweeper <sub text-sm>Guyu</sub></div>
        <MineFunctions @reset-game='resetGame' />
        <div ref='map'
            relative
            flex
            flex-col>
            <div v-for="(row, index) in state"
                :key="index"
                flex="~"
                items-center
                justify-center>
                <MineBlock v-for="block in row"
                    :key="block.id"
                    :block
                    @generate-mines='generateMines'
                    @check-directions='checkDirections'
                    @check-game-status='checkGameStates' />
            </div>
            <WinOrLose v-if="gameStatus !== 'playing'"
                :win="gameStatus === 'won'"
                :width
                :height />
        </div>
    </div>
</template>

<style scoped></style>
