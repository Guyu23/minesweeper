<script lang='ts'
    setup>
    defineEmits(['resetGame'])
</script>

<template>
    <div>
        <button @click='$emit("resetGame")'>Rest</button>
        <!-- <button>Easy</button>
        <button>Hard</button> -->
    </div>
</template>

<style scoped></style>
