<script lang='ts'
    setup>
    import {useMinesweeperStore } from '~/stores/minesweeper'
    import type { BlockState } from '~/stores/minesweeper'

    const emit = defineEmits(['generateMines', 'checkGameStatus', 'checkDirections'])

    defineProps(['block'])

    const mineSweeperStore = useMinesweeperStore()

    const { setGameStatus, changeMineGenerated } = mineSweeperStore

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

    /**
     * 点击后检查游戏状态并翻开方块
     * @param {BlockState} block
     */
    function onClick(block: BlockState) {
        if (!mineSweeperStore.mineGenerated) {
            changeMineGenerated(true)
            emit('generateMines', block)
        }
        if (block.flagged || mineSweeperStore.gameStatus !== 'playing')
            return
        if (block.mine) {
            setGameStatus('lost')
            return
        }
        if (!block.flagged)
            expandWave(block)

        emit('checkGameStatus')
    }

    /**
     * 标记方块
     */
    function flagBlock(block: BlockState) {
        !block.revealed && (block.flagged = !block.flagged)
        emit('checkGameStatus')
    }

    /**
     * 获取方块样式
     */
    function getBlockClass(block: BlockState) {
        if (block.flagged)
            return 'bg-gray-200/20'
        if (!block.revealed)
            return 'bg-gray-500/40'
        return `${block.mine ? 'bg-red/50' : numberColors[block.adjacentMines || 0]}  revealed`
    }

    /**
     * 波浪展开空白块
     */
    function expandWave(block: BlockState, ratio?: number) {
        if (block.revealed)
            return
        block.revealed = true
        block.delay = 0.1 * ((ratio || 1) + 1)
        if (block.adjacentMines)
            return
        emit('checkDirections', block, expandWave)
    }

</script>

<template>
    <button 
        border="1 gray-400/30"
        flex="~"
        relative
        m1
        h-10
        w-10
        items-center
        justify-center
        font-bold
        transition-all
        hover="bg-gray-200/20"
        :class="getBlockClass(block)"
        :style='{ transitionDelay: `${block.delay}s` }'
        @click="onClick(block)"
        @contextmenu.prevent="flagBlock(block)">
        <template v-if="block.flagged">
            <div text-2xl
                i-noto-v1-flag-in-hole />
        </template>
        <template v-else-if="block.revealed">
            <div text-3xl
                v-if="block.mine"
                i-fxemoji-bomb />
            <div v-else>
                {{ block.adjacentMines || '' }}
            </div>
        </template>
    </button>
</template>

<style scoped>
.revealed {
    animation: animeCell 0.3s ease-in-out var(transition-delay) forwards;
}

@keyframes animeCell {
    0% {
        opacity: 0;
        transform: translateY(0);
    }
    60% {
        opacity: 0.5;
        transform: translateY(-10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

/* .cell::after {
    content: '';
    position: absolute;
    background: rgb(107 114 128 / 0.4);
    top: 0;
    left: 0;
} */
</style>