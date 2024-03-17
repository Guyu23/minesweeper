<script lang="ts"
    setup>
    import { reactive, onMounted } from 'vue'

    interface BlockState {
        x: number
        y: number
        revealed?: boolean
        mine?: boolean
        flagged?: boolean
        adjacentMines?: number
    }

    const WIDTH = 10
    const HEIGHT = 10
    const state = reactive(Array.from({ length: HEIGHT }, (_, y) =>
        Array.from({ length: WIDTH },
            (_, x): BlockState => ({ x, y })
        )))

    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ]

    function updateNumbers() {
        state.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block.mine) return
                directions.forEach(([dx, dy]) => {
                    const newX = x + dx
                    const newY = y + dy
                    if (newX < 0 || newX >= WIDTH || newY < 0 || newY >= HEIGHT) return
                    if (state[newY][newX].mine) {
                        block.adjacentMines = (block.adjacentMines || 0) + 1
                    }
                })
            })
        })
    }


    function onClick(x: number, y: number) {
        console.log(x, y)
    }


    function generateMines() {
        for (const row of state) {
            for (const block of row) {
                block.mine = Math.random() < 0.3
            }
        }
    }

    function getBlockClass(block: BlockState) {
        return block.mine ? 'text-red' : 'text-gray'
    }

    onMounted(() => {
        generateMines()
    })
</script>

<template>
    <div>
        Minesweeper
        <div v-for="(row, index) in state"
            :key="index" flex='~' items-center justify-center>
            <button v-for="(item, index) in row"
                w-8
                h-8
                border
                flex='~'
                items-center
                justify-center
                hover:bg-gray
                :class='getBlockClass(item)'
                :key="index">
                <div v-if='item.mine'
                    i-fxemoji-bomb>
                    
                </div>
                <div v-else>
                    {{ item.adjacentMines || '-' }}
                </div>
            </button>
        </div>
    </div>
</template>
<style scoped></style>
