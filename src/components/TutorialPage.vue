<template>
    <div class="content">
        <img src="../assets/name.svg" alt="MemoryT" id="name-img" />
        <div className="card-grid">
            <div
                class="scene scene-card"
                v-for="(card, index) in cards"
                :key="index"
            >
                <div
                    class="card"
                    @click="flip(card)"
                    :class="{ ' is-flipped': card.isFlipped }"
                >
                    <div class="card-face card-face-front">?</div>
                    <div class="card-face card-face-back">
                        <h1>{{ card.header }}</h1>
                        <p>{{ card.content }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-div">
            <router-link class="button primary-button" to="/Setup"
                >Begin</router-link
            >
            <router-link
                class="button primary-button"
                :to="{
                    name: 'Play',
                    params: {
                        difficulty: 'Easy',
                        theme: 'None',
                    },
                }"
                >Quickplay</router-link
            >
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
export default {
    setup() {
        const cards = ref([
            {
                header: "A Match:",
                content:
                    "A player makes a match if the two cards turned picture-side-up are identical.",
                isFlipped: false,
            },
            {
                header: "A Miss:",
                content:
                    "A player misses if the two cards turned over are not identical and the two cards are turned back.",
                isFlipped: false,
            },
            {
                header: "The Game:",
                content:
                    "The game continues until all cards have been matched and removed from the playing area.",
                isFlipped: false,
            },
            {
                header: "Score:",
                content:
                    "Get as low score as possible, one turn equals one score. Don't forget to keep and eye on the clock.",
                isFlipped: false,
            },
        ]);

        function flip(card) {
            card.isFlipped = !card.isFlipped;
        }
        setTimeout(() => flip(cards.value[0]), 1500);
        return { cards, flip };
    },
};
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 90%;
    width: 100%;
}
.card-grid {
    display: grid;
    grid-template-columns: 15rem 15rem 15rem 15rem;
    place-items: center;
    grid-auto-rows: auto;
    grid-gap: 5rem;
}
.scene {
    width: 100%;
    height: 20rem;
    perspective: 600px;
}
.card-face-back {
    padding: 1rem 0;
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
    .scene {
        height: 20rem;
    }
    .card-grid {
        grid-template-columns: 15rem 15rem;
        grid-gap: 3rem;
    }
}
/* Landscape */
@media only screen and (min-width: 1366px) and (max-height: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1.5) {
}

/* IPAD 1,2, mini */
/* LANDSCAPE */
@media only screen and (min-width: 1024px) and (max-height: 768px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .scene {
        height: 18rem;
    }
    .card-grid {
        grid-column-gap: 2rem;
        grid-template-columns: 13rem 13rem 13rem 13rem;
    }
    /* .card-face-back p {
        font-size: 1.3rem;
    } */
}
/* IPAD 1,2, mini PORTRAIT*/
@media only screen and (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
    .scene {
        height: 17rem;
    }
    /* .card-face-back p {
        font-size: 1.2rem;
    } */
    .card-grid {
        grid-template-columns: 12rem 12rem;
        grid-gap: 2rem;
    }
}
/* ----------- iPhone X ----------- */
/* Portrait */
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait) {
    .card-grid {
        grid-template-columns: 10rem 10rem;
        grid-gap: 0.5rem;
    }
    .scene {
        height: 15rem;
    }
    .button-div {
        width: 100%;
    }
    .card-face-back {
        padding: 0.5rem 0.2rem;
    }
    .card-face-back h1 {
        font-size: 1.5rem;
    }
    .card-face-back p {
        font-size: 1.1rem;
    }
}

/* Landscape */
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape) {
    .content {
        height: 100%;
        justify-content: space-around;
		padding-top: 2rem;
    }
    .card-grid {
        grid-template-columns: 10rem 10rem 10rem 10rem;
        grid-gap: 1rem;
    }
    .scene {
        height: 13rem;
    }
    .button-div {
        width: 50%;
    }
    .card-face-back {
        padding: 0.5rem 0.2rem;
    }
    .card-face-back h1 {
        font-size: 1.5rem;
    }
    .card-face-back p {
        font-size: unset;
    }
}
</style>