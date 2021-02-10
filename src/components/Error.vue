<template>
    <div class="error-div">
        <h1>Ooopsies! Something went wrong, try again later.</h1>
        <h1>{{ props.errorMessage }}</h1>
    </div>
</template>

<script>
export default {
    props: {
        errorMessage: String,
    },
    setup(props) {
        return { props };
    },
};
</script>

<style scoped>
.error-div {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>