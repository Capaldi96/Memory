<template>
    <div class="gallery-content">
        <h1 v-if="!request.loading && request.status">The Deck</h1>
        <div class="gallery" v-if="!request.loading && request.status">
            <div
                class="scene scene-card"
                v-for="card in galleryCards"
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
                        <p>{{ card.group }}</p>
                        <p>{{ card.name }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="error-div" v-else-if="!request.loading && !request.status">
            <error :errorMessage="request.message"></error>
        </div>
        <div class="loading" v-else-if="loading">
            <swapping-squares-spinner
                :animation-duration="1000"
                :size="80"
                :color="'#c77dff'"
            />
        </div>
    </div>
</template>

<script>
import { ref, onBeforeMount, reactive } from "vue";
import axios from "axios";
import { SwappingSquaresSpinner } from "epic-spinners";
import Error from "./Error.vue";

export default {
    components: {
        SwappingSquaresSpinner,
        Error,
    },
    setup() {
        onBeforeMount(() => {
            getCards();
        });
        const galleryCards = ref([]);
        const request = reactive({
            status: null,
            loading: true,
            message: "",
        });
        function flipAllCards() {
            galleryCards.value.forEach((element,index) => {
                setTimeout(() => {
                    element.isFlipped = true;
                }, index * 150);
            });
        }
        async function getCards() {
            await axios
                .get("/api/getAllCards")
                .then((res) => {
                    galleryCards.value = res.data;
                    request.loading = false;
                    request.status = true;
                    setTimeout(flipAllCards, 1000);
                })
                .catch((err) => {
                    console.log(err);
                    request.message = err.message;
                    request.loading = false;
                    request.status = false;
                });
        }
        function flip(card) {
            card.isFlipped = !card.isFlipped;
        }
        return { galleryCards, request, flip };
    },
};
</script>

<style scoped>
.gallery-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
}
.gallery-content h1 {
    font-size: 3rem;
}
.error-div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.gallery {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    height: 80%;
    overflow-y: scroll;
}

.gallery .scene {
    margin: 1rem;
    min-height: 17rem;
    width: 12%;
    perspective: 600px;
}
.card-face-back {
    padding: 1rem;
}
.card-face-back p {
    text-align: left;
    margin: 0.3rem;
}
.card-face img {
    border-radius: 1rem;
    width: 100%;
    height: 70%;
}
::-webkit-scrollbar-track {
    margin: 4rem 0;
}

/* ------- iPad 3, 4 and Pro 9.7" ------- */
/* Portrait */
@media only screen and (min-width: 1024px) and (max-height: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1.5) {
    .gallery .scene {
        width: 20%;
    }
}

/* Landscape */
@media only screen and (min-width: 1366px) and (max-height: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1.5) {
    .gallery .scene {
        width: 17%;
    }
}

/* IPAD 1,2, mini */
/* IPAD 1,2, mini PORTRAIT*/
@media only screen and (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
    .gallery .scene {
        width: 25%;
    }
}
/* LANDSCAPE */
@media only screen and (min-width: 1024px) and (max-height: 768px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .gallery .scene {
        width: 20%;
    }
}
</style>