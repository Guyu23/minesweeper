<script lang="ts"
    setup>
    import { computed, onMounted } from 'vue'
    import confetti from 'canvas-confetti'

    function celebrate() {
        const scalar = 3
        const unicorn = confetti.shapeFromText({ text: '🍔', scalar })
        const smile = confetti.shapeFromText({ text: '🍓', scalar })
        const lemon = confetti.shapeFromText({ text: '🍋', scalar })
        const defaults = {
            angle: 180,
            spread: 360,
            ticks: 160,
            gravity: 0,
            decay: 0.96,
            startVelocity: 20,
            shapes: [unicorn],
            scalar,
            origin: { y: 0.4 },
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

    const props = defineProps(['win', 'height', 'width'])
    const style = {
        top: `${props.height / 4}px`,
        left: `${props.width / 2 - props.height / 4}px`,
        width: `${props.height / 2}px`,
        height: `${props.height / 2}px`,
        'backdrop-filter': 'blur(2px)'
    }

    const modalClass = ref('modal')

    function hideModal () {
        modalClass.value = 'modal modal-hide'
    }

    onMounted(() => {
        if (props.win)
            celebrate()
    })
</script>

<template>
    <div :class="modalClass"
        bg-slate-200:20
        absolute
        backdrop-blur
        flex
        flex-col
        items-center
        justify-center
        :style
        @click='hideModal'>
        <div v-if='!win'
            class='lose'
            w-32
            h-32 />
        <div v-else
            class='win'
            w-32
            h-32 />
        <div font-fun
            font-bold
            text-2xl
            my4
            :class='win ? "text-green" : "text-red"'>{{ win ? `Congratulations!` : 'OOPS! You Lose~~~'}}</div>
    </div>
</template>

<style scoped>
.modal {
    animation: showModal 0.5s ease-in-out forwards;
}

.modal-hide {
    display: none;
}

@keyframes showModal {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.1);
    }
    75% {
        opacity: 1;
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.win {
    background-image: url('../../public/win.png');
    background-size: cover;
}
.lose {
    background-image: url('../../public/lose.png');
    background-size: cover;
}
</style>
