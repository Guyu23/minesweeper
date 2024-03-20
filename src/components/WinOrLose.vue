<script lang="ts"
        setup>
        import { onMounted } from 'vue'
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
        const modal = ref(null)
        const modalClass = ref('modal')
        const props = defineProps(['win'])

        function hideModal() {
            modalClass.value = 'modal modal-hide'
        }

        onMounted(() => {
            if (props.win)
                celebrate()
        })
</script>

<template>
    <div :class="modalClass"
         ref="modal"
         bg-slate-200:20
         absolute
         backdrop-blur
         flex
         flex-col
         items-center
         justify-center
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
             mt4
             :class='win ? "text-green" : "text-red"'>{{ win ? `Congratulations!` : 'OOPS! You Lose~~~' }}</div>
    </div>
</template>

<style scoped>
.modal {
    backdrop-filter: blur(2px);
    width: 15rem;
    height: 15rem;
    top: calc(50% - 7.5rem);
    left: calc(50% - 7.5rem);
    border-radius: 6px;
    animation: showModal 0.5s ease-in-out forwards;
}

.modal-hide {
    animation: hideModal 0.5s ease-in-out forwards;
}

@keyframes hideModal {
    0% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.1);
    }

    100% {
        opacity: 0;
        transform: scale(0.5);
    }
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
