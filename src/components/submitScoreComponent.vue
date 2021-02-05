<template>
    <div class="finished-content">
        <img src="../assets/name.svg" alt="MemoryT" id="name-img" />
        <div class="score-form" v-if="!loading">
            <div class="form-text" v-if="!uploaded">
                <h1>Good job! You got {{ score }} points.</h1>
                <h2>Enter your name below and submit your score.</h2>
            </div>
            <div class="form-text" v-else>
                <h1>Your score was uploaded!</h1>
                <h2>Check out the scoreboard or play another game?</h2>
            </div>
            <div class="input-container" v-if="!uploaded">
                <label
                    for="score-name-input"
                    class="input-label"
                    :class="form.moveUp ? 'move-up' : ''"
                    >Name</label
                >

                <input
                    type="text"
                    @focus="form.moveUp = true"
                    @blur="
                        form.touched = true;
                        if (!form.name) form.moveUp = false;
                    "
                    v-model="form.name"
                    id="score-name-input"
                    autocomplete="off"
                    required
                />
                    <p
                        :style="{
                            visibility:
                                form.touched && !validateName()
                                    ? 'visible'
                                    : 'hidden',
                        }"
                    >
                        {{ form.message }}
                    </p>
            </div>
            <div class="button-div" v-if="!uploaded">
                <button
                    class="button primary-button"
                    :disabled="!validateName()"
                    @click="submitScore()"
                >
                    Submit
                </button>
                <router-link class="button secondary-button" to="/Setup"
                    >New Game</router-link
                >
            </div>
            <div class="button-div" v-else>
                <router-link
                    class="button secondary-button"
                    :to="{
                        name: 'Scoreboard',
                        params: {
                            difficulty: props.difficulty,
                        },
                    }"
                    >See score</router-link
                >
                <router-link class="button secondary-button" to="/Setup"
                    >New Game</router-link
                >
            </div>
        </div>
        <div class="loading" v-else-if="loading && !uploaded">
            <swapping-squares-spinner
                :animation-duration="1000"
                :size="80"
                :color="'#c77dff'"
            />
        </div>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import { SwappingSquaresSpinner } from "epic-spinners";

export default {
    components: {
        SwappingSquaresSpinner,
    },
    props: {
        score: Number,
        difficulty: String,
    },
    setup(props) {
        const form = reactive({
            touched: false,
            message: "Let's not forget the name!",
            name: "",
            moveUp: false,
        });
        const uploaded = ref(false);
        const loading = ref(false);
        function validateName() {
            if (form.name.length < 1) {
                form.message = "Let's not forget the name!";
                return false;
            } else if (form.name.length < 2) {
                form.message = "Hey! Name is too short, min 2 characters!";
                return false;
            } else if (form.name.length > 20) {
                form.message = "Hey! Name is too long, max 20 characters.";
                return false;
            } else {
                return true;
            }
        }
        async function submitScore() {
            loading.value = true;
            let tmp = {
                name: form.name,
                score: props.score,
                difficulty: props.difficulty,
            };
            try {
                const response = await fetch(
                    "/api/submitScore",
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify(tmp),
                    }
                );
                const text = await response.text();
                let data = JSON.parse(text);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
            uploaded.value = true;
            loading.value = false;
        }
        return { submitScore, form, validateName, loading, uploaded, props };
    },
};
</script>

<style scoped>
.finished-content {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
/* .finished-content h1 {
    font-size: 3rem;
} */
.loading {
    height: 100%;
    width: 100%;
    display: grid;
    place-items: center;
}
.uploaded-div {
    width: 60%;
    height: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}
.score-form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 60%;
    height: 70%;
}
.form-text {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: space-between;
    height: 20%;
}
.button-div {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 40%;
}

/* ------- iPad 3, 4 and Pro 9.7" ------- */
/* Portrait */
@media only screen and (min-width: 1024px) and (max-height: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1.5) {
    .score-form {
        width: 100%;
    }
}

/* Landscape */
@media only screen and (min-width: 1366px) and (max-height: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1.5) {
    .score-form {
        width: 80%;
    }
}

/* IPAD 1,2, mini */
/* IPAD 1,2, mini PORTRAIT*/
@media only screen and (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
    .finished-content {
        height: 90%;
    }
    .score-form {
        width: 100%;
        height: 80%;
    }
    .input-container,
    .button-div {
        width: 50%;
    }
}
/* LANDSCAPE */
@media only screen and (min-width: 1024px) and (max-height: 768px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .finished-content {
        height: 100%;
    }
    .score-form {
        width: 100%;
        height: 85%;
    }
}
</style>