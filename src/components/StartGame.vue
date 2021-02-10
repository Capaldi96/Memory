<template>
    <div class="content">
        <!-- <div class="settings"> -->
        <h1>Select theme and difficulty</h1>
        <div class="diff-carousel">
            <div class="icon" @click="nextOrPrevious(diffCarousel, 'previous')">
                <div class="arrow left-arrow"></div>
            </div>
            <div class="scene">
                <div class="carousel" ref="diffCarousel">
                    <div
                        class="carousel__cell"
                        v-for="(difficulty, i) in difficulties"
                        :key="i"
                    >
                        {{ difficulty }}
                    </div>
                </div>
            </div>
            <div class="icon" @click="nextOrPrevious(diffCarousel, 'next')">
                <div class="arrow right-arrow"></div>
            </div>
        </div>
        <div class="theme-carousel">
            <div
                class="icon"
                @click="nextOrPrevious(themeCarousel, 'previous')"
            >
                <div class="arrow left-arrow"></div>
            </div>
            <div class="scene">
                <div class="carousel" ref="themeCarousel">
                    <div
                        class="carousel__cell"
                        v-for="(theme, i) in themes"
                        :key="i"
                    >
                        {{ theme }}
                    </div>
                </div>
            </div>
            <div class="icon" @click="nextOrPrevious(themeCarousel, 'next')">
                <div class="arrow right-arrow"></div>
            </div>
            <!-- </div> -->
        </div>
        <router-link
            class="button primary-button"
            :to="{
                name: 'Play',
                params: {
                    difficulty: selectedDifficulty,
                    theme: selectedTheme,
                },
            }"
            @click="gameSettings()"
            >Start Game</router-link
        >
    </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { ref } from "vue";
export default {
    setup() {
        let difficulties = ["Easy", "Medium", "Hard"];
        let themes = ["Fruits", "Animals", "Customs", "None"];
        let themeSelectedIndex = 0;
        let themeCellCount = 4;
        let diffSelectedIndex = 0;
        let diffCellCount = 3;
        const diffCarousel = ref(null);
        const themeCarousel = ref(null);
        const selectedDifficulty = ref(null);
        const selectedTheme = ref(null);
        Number.prototype.mod = function (n) {
            return ((this % n) + n) % n;
        };
        // calculate angle, if adding more choices.
        function rotateCarousel(carousel, index, cells) {
            let angle = (index / cells) * -360;
            carousel.style.transform =
                "translateZ(15rem) rotateY(" + angle + "deg)";
        }
        function hideOptionbehindSelected(index, direction) {
            // hides the option that is behind the selected one...
            // temporarily shitty solution
            let remove;
            let show;
            if (direction === "previous") {
                switch (index.mod(themes.length)) {
                    case 0:
                        remove = 2;
                        show = 3;
                        break;
                    case 1:
                        remove = 3;
                        show = 0;
                        break;
                    case 2:
                        remove = 0;
                        show = 1;
                        break;
                    default:
                        remove = 1;
                        show = 2;
                        break;
                }
            } else {
                switch (index.mod(themes.length)) {
                    case 0:
                        remove = 2;
                        show = 1;
                        break;
                    case 1:
                        remove = 3;
                        show = 2;
                        break;
                    case 2:
                        remove = 0;
                        show = 3;
                        break;
                    default:
                        remove = 1;
                        show = 0;
                        break;
                }
            }
            themeCarousel.value.children[show].style.opacity = 1;
            themeCarousel.value.children[remove].style.opacity = 0;
        }
        function gameSettings() {
            // get selected values
            // if (diffSelectedIndex < 0) diffSelectedIndex = difficulties.length;
            selectedDifficulty.value =
                difficulties[diffSelectedIndex.mod(difficulties.length)];
            selectedTheme.value = themes[themeSelectedIndex.mod(themes.length)];
        }
        function nextOrPrevious(carousel, direction) {
            if (carousel == diffCarousel.value) {
                if (direction === "next") {
                    diffSelectedIndex++;
                } else if (direction === "previous") {
                    diffSelectedIndex--;
                }
                rotateCarousel(carousel, diffSelectedIndex, diffCellCount);
            } else if (carousel == themeCarousel.value) {
                if (direction === "next") {
                    themeSelectedIndex++;
                } else if (direction === "previous") {
                    themeSelectedIndex--;
                }
                hideOptionbehindSelected(themeSelectedIndex, direction);
                rotateCarousel(carousel, themeSelectedIndex, themeCellCount);
            }
        }
        return {
            difficulties,
            themes,
            nextOrPrevious,
            diffCarousel,
            themeCarousel,
            gameSettings,
            selectedDifficulty,
            selectedTheme,
        };
    },
};
</script>

<style scoped>
.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.content h1 {
    font-size: 3rem;
}
.scene {
    position: relative;
    width: 300px;
    perspective: 1000px;
}
.diff-carousel,
.theme-carousel {
    display: flex;
    width: 100%;
    justify-content: space-around;
}
.carousel {
    width: 100%;
    height: 100%;
    position: absolute;
    transform: translateZ(15rem);
    transform-style: preserve-3d;
    transition: transform 1s;
}

.carousel__cell {
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 1.5rem;
    display: grid;
    place-items: center;
    transition: transform 1s, opacity 1s;
    color: #e0aaff;
    text-shadow: 3px 2px 1px rgba(16, 0, 43, 0.25);
}
.diff-carousel .carousel__cell:nth-child(1) {
    transform: rotateY(0deg) translateZ(20rem);
}
.diff-carousel .carousel__cell:nth-child(2) {
    transform: rotateY(120deg) translateZ(20rem);
}
.diff-carousel .carousel__cell:nth-child(3) {
    transform: rotateY(240deg) translateZ(20rem);
}
.theme-carousel .carousel__cell:nth-child(1) {
    transform: rotateY(0deg) translateZ(18rem);
}
.theme-carousel .carousel__cell:nth-child(2) {
    transform: rotateY(90deg) translateZ(18rem);
}
.theme-carousel .carousel__cell:nth-child(3) {
    transform: rotateY(180deg) translateZ(18rem);
    opacity: 0;
}
.theme-carousel .carousel__cell:nth-child(4) {
    transform: rotateY(270deg) translateZ(18rem);
}

/* arrow */
.icon {
    transform: translate(0, 0);
    width: 80px;
    height: 60px;
    cursor: pointer;
    display: grid;
    place-items: center;
}

.arrow {
    position: absolute;
    width: 90%;
    height: 10px;
    background-color: #e0aaff;
}

.right-arrow::after,
.right-arrow::before {
    content: "";
    position: absolute;
    width: 60%;
    height: 10px;
    right: -8px;
    background-color: #e0aaff;
}

.right-arrow::after {
    top: -12px;
    transform: rotate(45deg);
}

.right-arrow::before {
    top: 12px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
    transform: rotate(-45deg);
}

.left-arrow::after,
.left-arrow::before {
    content: "";
    position: absolute;
    width: 60%;
    height: 10px;
    left: -8px;
    background-color: #e0aaff;
}

.left-arrow::after {
    top: -12px;
    transform: rotate(-45deg);
}

.left-arrow::before {
    top: 12px;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
    transform: rotate(45deg);
}
/* ------- iPad 3, 4 and Pro 9.7" ------- */
/* Portrait */
@media only screen and (min-width: 1024px) and (max-height: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1.5) {
    .diff-carousel .carousel__cell:nth-child(1) {
        transform: rotateY(0deg) translateZ(14rem);
    }
    .diff-carousel .carousel__cell:nth-child(2) {
        transform: rotateY(120deg) translateZ(14rem);
    }
    .diff-carousel .carousel__cell:nth-child(3) {
        transform: rotateY(240deg) translateZ(14rem);
    }
    .theme-carousel .carousel__cell:nth-child(1) {
        transform: rotateY(0deg) translateZ(12rem);
    }
    .theme-carousel .carousel__cell:nth-child(2) {
        transform: rotateY(90deg) translateZ(12rem);
    }
    .theme-carousel .carousel__cell:nth-child(3) {
        transform: rotateY(180deg) translateZ(12rem);
    }
    .theme-carousel .carousel__cell:nth-child(4) {
        transform: rotateY(270deg) translateZ(12rem);
    }
}

/* Landscape */
@media only screen and (min-width: 1366px) and (max-height: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1.5) {
    .diff-carousel .carousel__cell:nth-child(1) {
        transform: rotateY(0deg) translateZ(16rem);
    }
    .diff-carousel .carousel__cell:nth-child(2) {
        transform: rotateY(120deg) translateZ(16rem);
    }
    .diff-carousel .carousel__cell:nth-child(3) {
        transform: rotateY(240deg) translateZ(16rem);
    }
    .theme-carousel .carousel__cell:nth-child(1) {
        transform: rotateY(0deg) translateZ(15rem);
    }
    .theme-carousel .carousel__cell:nth-child(2) {
        transform: rotateY(90deg) translateZ(15rem);
    }
    .theme-carousel .carousel__cell:nth-child(3) {
        transform: rotateY(180deg) translateZ(15rem);
    }
    .theme-carousel .carousel__cell:nth-child(4) {
        transform: rotateY(270deg) translateZ(15rem);
    }
}

/* IPAD 1,2, mini */
/* IPAD 1,2, mini PORTRAIT*/
@media only screen and (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
	.content h1{
		font-size: 2.5rem;
	}
    .diff-carousel .carousel__cell:nth-child(1) {
        transform: rotateY(0deg) translateZ(10rem);
    }
    .diff-carousel .carousel__cell:nth-child(2) {
        transform: rotateY(120deg) translateZ(10rem);
    }
    .diff-carousel .carousel__cell:nth-child(3) {
        transform: rotateY(240deg) translateZ(10rem);
    }
    .theme-carousel .carousel__cell:nth-child(1) {
        transform: rotateY(0deg) translateZ(8rem);
    }
    .theme-carousel .carousel__cell:nth-child(2) {
        transform: rotateY(90deg) translateZ(8rem);
    }
    .theme-carousel .carousel__cell:nth-child(3) {
        transform: rotateY(180deg) translateZ(8rem);
    }
    .theme-carousel .carousel__cell:nth-child(4) {
        transform: rotateY(270deg) translateZ(8rem);
    }
}
/* LANDSCAPE */
@media only screen and (min-width: 1024px) and (max-height: 768px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .diff-carousel .carousel__cell:nth-child(1) {
        transform: rotateY(0deg) translateZ(13rem);
    }
    .diff-carousel .carousel__cell:nth-child(2) {
        transform: rotateY(120deg) translateZ(13rem);
    }
    .diff-carousel .carousel__cell:nth-child(3) {
        transform: rotateY(240deg) translateZ(13rem);
    }
    .theme-carousel .carousel__cell:nth-child(1) {
        transform: rotateY(0deg) translateZ(12rem);
    }
    .theme-carousel .carousel__cell:nth-child(2) {
        transform: rotateY(90deg) translateZ(12rem);
    }
    .theme-carousel .carousel__cell:nth-child(3) {
        transform: rotateY(180deg) translateZ(12rem);
    }
    .theme-carousel .carousel__cell:nth-child(4) {
        transform: rotateY(270deg) translateZ(12rem);
    }
}
</style>