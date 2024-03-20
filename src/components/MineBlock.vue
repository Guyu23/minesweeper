<script lang='ts'
        setup>
        import { storeToRefs } from 'pinia'
        import { isDark } from '~/composables/dark'
        import { useMinesweeperStore } from '~/stores/minesweeper'
        import type { BlockState } from '~/stores/minesweeper'

        defineProps(['block'])

        const emit = defineEmits(['generateMines', 'checkGameStatus', 'checkDirections'])

        const mineSweeperStore = useMinesweeperStore()
        const { clickBlock, mineGenerated, gameStatus } = storeToRefs(mineSweeperStore)
        const { setGameStatus, changeMineGenerated } = mineSweeperStore

        const animationEnded = ref(false)

        const numberColors = [
            'rgb(96 165 250)',
            'rgb(74 222 128)',
            'rgb(34 211 238)',
            'rgb(250 204 21)',
            'rgb(244 114 182)',
            'rgb(251 146 60)',
            'rgb(192 132 252)',
            'rgb(248 113 113)',
        ]

        const whiteBg = computed(() => isDark.value ? 'transparent' : 'white')

        function blockStyle(block: BlockState) {
            return {
                animationDelay: getAnimationDelay(block),
                backgroundColor: (block.mine && gameStatus.value === 'lost')
                    ? 'transparent'
                    : block.revealed && animationEnded.value
                        ? whiteBg.value
                        : block.flagged
                            ? whiteBg.value
                            : 'rgb(107 114 128 / 0.4)',
                color: block.mine && animationEnded.value ? 'rgb(248 113 113)' : numberColors[block.adjacentMines || 0],
                // borderColor:  block.mine && animationEnded.value ? 'rgb(156 163 175 / 0.3)' : block.revealed ? numberColors[block.adjacentMines || 0] : 'rgb(156 163 175 / 0.3)'
            }
        }

        /**
         * 点击后检查游戏状态并翻开方块
         * @param {BlockState} block
         */
        function onClick(block: BlockState) {
            if (gameStatus.value !== 'playing')
                return
            if (!mineGenerated.value) {
                changeMineGenerated(true)
                emit('generateMines', block)
            }
            if (block.flagged || gameStatus.value !== 'playing')
                return
            if (block.mine) {
                setGameStatus('lost')
                return
            }
            if (!block.flagged)
                clickBlock.value = block
            expandWave(block)

            emit('checkGameStatus')
        }

        /**
         * 标记方块
         */
        function flagBlock(block: BlockState) {
            if (gameStatus.value !== 'playing')
                return
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
            return `revealed`
        }

        /**
         * 波浪展开空白块
         */
        function expandWave(block: BlockState) {
            if (block.revealed)
                return
            block.revealed = true
            if (clickBlock.value) {
                const diffX = Math.abs(block.x - clickBlock.value.x)
                const diffY = Math.abs(block.y - clickBlock.value.y)
                block.delay = 0.06 * Math.max(diffX, diffY)
            }
            if (block.adjacentMines)
                return
            emit('checkDirections', block, expandWave)
        }

        function getAnimationDelay(block: BlockState) {
            return `${block.delay || 0}s`
        }

        function changeAnimationStatus(e: AnimationEvent) {
            if ((e.target as HTMLElement)?.classList?.contains('revealed'))
                animationEnded.value = true
        }
</script>

<template>
    <button class="cell"
            border="1 gray-400/30"
            rounded
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
            :style="blockStyle(block)"
            @click="onClick(block)"
            @animationend="changeAnimationStatus($event)"
            @contextmenu.prevent="flagBlock(block)">
        <template v-if="gameStatus === 'lost' && block.mine">
            <div class="bombBg" />
            <div class="bomb"
                 i-fxemoji-bomb
                 text-2xl />
        </template>
        <template v-else-if="block.flagged">
            <div class="flagBg" />
            <div class="flag"
                 i-noto-v1-flag-for-flag-china
                 text-xl />
        </template>
        <template v-else-if="block.revealed && animationEnded">
            {{ block.adjacentMines || '' }}
        </template>
    </button>
</template>

<style scoped>
.cell {
    animation: animeCell 0.3s linear;
}

.revealed {
    animation: animeWave 0.3s linear;
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

@keyframes animeWave {
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

.bomb,
.flag {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
}

.flagBg,
.bombBg {
    position: absolute;
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background: linear-gradient(-45deg,
            rgba(228, 63, 17, 0.5) 70%,
            rgba(253, 223, 0, 0.5));
    filter: blur(10px);
}

.bombBg {
    background: linear-gradient(-45deg,
            rgba(220, 38, 38, 0.5) 70%,
            rgba(249, 115, 22, 0.5));
}
</style>
