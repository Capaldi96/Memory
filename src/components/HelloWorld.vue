<template>
    <div class="hello">
        <button @click="change()">Change</button>
    </div>
</template>

<script>
import { ref } from "vue";
export default {
    setup() {
        const msg = ref("hello");

        function change() {
            msg.value = "Kalle";
        }
        return { msg, change };
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
