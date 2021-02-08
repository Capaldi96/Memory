<template>
    <div class="play-content">
        <div v-if="!finished" class="game-content">
            <div id="score">
                <h1>Score:{{ score }}</h1>
                <h1>{{ min }}:{{ sec }}</h1>
            </div>
            <div :class="memoryCardsGridClass" v-if="!finished">
                <div
                    class="scene scene-card"
                    v-for="card in memoryCards"
                    :key="card._id"
                    :class="{ ' remove-card': card.isMatched }"
                >
                    <div
                        class="card"
                        @click="flip(card)"
                        :class="{ ' is-flipped': card.isFlipped }"
                    >
                        <div class="card-face card-face-front">?</div>
                        <div class="card-face card-face-back">
                            <img :src="card.img" :alt="card.name" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <submitScoreComponent
            v-if="finished"
            :score="score"
            :difficulty="props.difficulty"
			:time="time"
        ></submitScoreComponent>
    </div>
</template>

<script>
import { onBeforeMount, reactive, ref } from "vue";
import axios from "axios";
import submitScoreComponent from "./submitScoreComponent.vue";
export default {
    props: {
        theme: String,
        difficulty: String,
    },
    components: {
        submitScoreComponent,
    },
    computed: {
        sec() {	
            if (this.time.seconds < 10) {
                return "0" + this.time.seconds;
            }
            return this.time.seconds;
        },
        min() {
            if (this.time.minutes < 10) {
                return "0" + this.time.minutes;
            }
            return this.time.minutes;
        },
    },
    setup(props) {
        onBeforeMount(() => {
            switch (props.difficulty) {
                case "Easy":
                    memoryCardsGridClass.value = "flex-6";
                    getCards(props.theme, 3);
                    break;
                case "Medium":
                    memoryCardsGridClass.value = "flex-8";
                    getCards(props.theme, 4);
                    break;
                case "Hard":
                    memoryCardsGridClass.value = "flex-12";
                    getCards(props.theme, 6);
                    break;
                default:
                    break;
            }
        });
        const memoryCards = ref([]);
        const memoryCardsGridClass = ref(null);
        const finished = ref(false);
        const cards = ref([]);
        const score = ref(0);
		const time = reactive({
            start: false,
            minutes: 0,
            seconds: 0,
        });
		let interval;
        let flippedCards = [];
        async function getCards(group, amount) {
            await axios
                .get("/api/getCards/" + group + "/" + amount)
                .then((res) => {
                    cards.value = res.data;
                    duplicateAndShuffle(cards);
                })
                .catch((err) => {
                    console.log("Something went wrong", err);
                });
        }
        /* Randomize array in-place using Durstenfeld shuffle algorithm */
        function duplicateAndShuffle(cards) {
            let cards1 = JSON.parse(JSON.stringify(cards.value));
            let cards2 = JSON.parse(JSON.stringify(cards.value));
            memoryCards.value = memoryCards.value.concat(cards1, cards2);
            for (var i = memoryCards.value.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = memoryCards.value[i];
                memoryCards.value[i] = memoryCards.value[j];
                memoryCards.value[j] = temp;
            }
        }
        function flip(card) {
            if (card.isMatched || card.isFlipped || flippedCards.length === 2)
                return;
            card.isFlipped = true;
            if (!time.start) {
                startTimer();
            }
            if (flippedCards.length < 2) {
                flippedCards.push(card);
            }
            if (flippedCards.length === 2) matchCards(card);
        }
        function startTimer() {
            ticking();
            interval = setInterval(ticking, 1000);
            time.start = true;
        }
        function ticking() {
            if (time.seconds !== 59) {
                time.seconds++;
                return;
            }
            time.minutes++;
            time.seconds = 0;
        }
        function matchCards() {
            score.value++;
            if (flippedCards[0].name === flippedCards[1].name) {
                setTimeout(() => {
                    flippedCards.forEach((card) => (card.isMatched = true));
                    flippedCards = [];
                    if (
                        memoryCards.value.every(
                            (card) => card.isMatched === true
                        )
                    ) {
                        clearInterval(interval);
                        setTimeout(() => (finished.value = true), 1500);
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    flippedCards.forEach((card) => (card.isFlipped = false));
                    flippedCards = [];
                }, 2000);
            }
        }

        return {
            memoryCards,
            flip,
            memoryCardsGridClass,
            finished,
            score,
            props,
            time,
        };
    },
};
</script>

<style scoped>
.play-content {
    width: 100%;
    height: 100%;
}
.game-content {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
}
.input-container {
    width: 40%;
    display: flex;
    flex-direction: column;
}

.flex-12 {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    justify-content: center;
    align-content: center;
}
.flex-12 .scene {
    margin: 0.8rem;
    min-height: 22rem;
    width: 14%;
    perspective: 600px;
}

.flex-8 {
    width: 70%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    overflow: hidden;
}
.flex-8 .scene {
    margin: 1rem;
    min-height: 22rem;
    width: 20%;
    perspective: 600px;
}
.flex-6 {
    width: 60%;
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}
.flex-6 .scene {
    width: 23%;
    margin: 1rem;
    min-height: 22rem;
    perspective: 600px;
}
#score {
    position: absolute;
    right: 2rem;
    top: 1rem;
	text-align: center;
}
.remove-card {
    animation-name: disappear;
    animation-duration: 1200ms;
    animation-timing-function: ease-out;
    animation-delay: 0;
    animation-direction: alternate;
    animation-fill-mode: forwards;
}

/* ------- iPad 3, 4 and Pro 9.7" ------- */
/* Portrait */
@media only screen and (min-width: 1024px) and (max-height: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1.5) {
    .flex-12 {
        width: 95%;
    }
    .flex-12 .scene {
        min-height: 18rem;
        width: 23%;
		margin:.5rem;
    }
    .flex-8 {
        width: 100%;
    }
    .flex-8 .scene {
        margin: 1rem;
        width: 25%;
        max-height: 18rem;
    }
    .flex-6 {
        width: 90%;
    }
    .flex-6 .scene {
        width: 28%;
        min-height: 23rem;
    }
}

/* Landscape */
@media only screen and (min-width: 1366px) and (max-height: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1.5) {
    .flex-12 .scene {
        margin: 0.8rem;
        min-height: 18rem;
        width: 18%;
    }
    .flex-8 {
        width: 100%;
    }
    .flex-8 .scene {
        width: 20%;
        margin: 1rem;
        max-height: 20rem;
    }
    .flex-6 {
        width: 80%;
    }
    .flex-6 .scene {
        width: 23%;
        min-height: 20rem;
    }
}

/* IPAD 1,2, mini */
/* IPAD 1,2, mini PORTRAIT*/
@media only screen and (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
    .flex-12{
		width:100%;
	}
	.flex-12 .scene {
        margin: 0.5rem;
        min-height: 15rem;
        width: 22%;
    }
    .flex-12 .card-face-front {
        font-size: 8rem;
    }
    .flex-8 {
        width: 90%;
    }
    .flex-8 .scene {
        width: 30%;
        min-height: 17rem;
        margin: 0.5rem;
    }
    .flex-6 {
        width: 100%;
    }
    .flex-6 .scene {
        width: 27%;
        margin: 1rem;
        min-height: 18rem;
    }
}
/* LANDSCAPE */
@media only screen and (min-width: 1024px) and (max-height: 768px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .flex-12 {
        width: 100%;
    }
    .flex-12 .scene {
        margin: 0.4rem;
        min-height: 14rem;
        width: 15%;
    }
    .flex-12 .card-face-front {
        font-size: 8rem;
    }
    .flex-8 {
        width: 90%;
    }
    .flex-8 .scene {
        margin: 0.8rem;
        width: 21%;
        min-height: 16rem;
    }
    .flex-6 {
        width: 80%;
    }
    .flex-6 .scene {
        margin: 1rem;
        width: 25%;
        min-height: 17rem;
    }
}

@keyframes disappear {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
}
</style>