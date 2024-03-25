<script lang='ts'
        setup>
        import { isDark } from '~/composables/dark'

        defineEmits(['resetGame'])
        const buttons = reactive([
            { text: 'Easy', rows: 8, cols: 8, possibility: 0.2 },
            { text: 'Medium', rows: 10, cols: 10, possibility: 0.3 },
            { text: 'Hard', rows: 12, cols: 12, possibility: 0.4 },
        ])
</script>

<template>
    <div>
        <button class="functionButton"
                v-for="button in buttons"
                :key="button.text"
                mb6
                mt4
                mx4
                w-fit
                :style="{ background: isDark ? 'linear-gradient(90deg, #1E90FF, #00D4FF)' : 'linear-gradient(90deg, #6366F1, #B496FA)', boxShadow: isDark ? '3px 3px 0 white' : '3px 3px 0 black' }"
                px-6
                py-2
                text-white
                font-medium
                @click="$emit('resetGame', { possibility: button.possibility, cols: button.cols, rows: button.rows })">
            {{ button.text }}
        </button>
    </div>
</template>

<style scoped>
.functionButton {
    /* box-shadow: 3px 3px 0 black; */
    transition: all 0.06s linear;
}

.functionButton:active {
    box-shadow: none;
    transform: translateX(3px) translateY(3px);
}
</style>
