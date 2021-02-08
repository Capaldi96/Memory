<template>
    <div id="burger" @click="toggleMenu" :class="{ burgerActive: showMenu }">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div class="sidebar" :class="{ active: showMenu }">
        <div class="nav-links">
            <router-link to="/">Tutorial</router-link>
            <router-link to="/Setup">Play</router-link>
            <router-link to="/Scoreboard/Easy">Scoreboard</router-link>
            <router-link to="/Create">Create a card</router-link>
        </div>
    </div>

    <router-view v-slot="{ Component }">
        <transition name="slide-right" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<script>
import { ref } from "vue";
export default {
    name: "App",
    watch: {
        $route() {
            this.showMenu = false;
        },
    },
    components: {},
    setup() {
        const showMenu = ref(false);
        function toggleMenu() {
            showMenu.value = !showMenu.value;
        }
        return { showMenu, toggleMenu };
    },
};
</script>

<style>
/* NOT SCOPED */
@import url("https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap");
/* transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.slide-top-enter-active,
.slide-top-leave-active,
.slide-bottom-enter-active,
.slide-bottom-leave-active,
.scale-enter-active,
.scale-leave-active {
    transition: all 1.2s ease-in-out;
}
.fade-in-enter-active,
.fade-in-leave-active {
    transition: all 0.6s ease-in-out;
}
.scale-enter-from,
.scale-leave-to {
    transform: scale(0) skew(45deg);
}
.fade-in-enter-from,
.fade-in-leave-to {
    opacity: 0;
}
.slide-right-enter-from {
    transform: translate(100%, 0);
}
.slide-right-leave-to {
    transform: translate(-100%, 0);
}
.slide-left-enter-from,
.slide-left-leave-to {
    transform: translate(-120%, 0);
}
.slide-top-enter-from {
    transform: translate(0, -120%);
}
.slide-top-leave-to {
    transform: translate(0, 120%);
}
.slide-bottom-enter-from,
.slide-bottom-leave-to {
    transform: translate(0, 120%);
}
/* transition end */
* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
html,
body {
    font-family: "Luckiest Guy", cursive;
    margin: 0;
    height: 100vh;
}
#burger {
    display: block;
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 1000;
    -webkit-user-select: none;
    user-select: none;
}

#burger span {
    display: block;
    width: 3rem;
    height: 0.3rem;
    margin-bottom: 0.5rem;
    position: relative;
    background: #e0aaff;
    border-radius: 3px;
    z-index: 1;
    transform-origin: 4px 0px;
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
}

#burger span:first-child {
    transform-origin: 0% 0%;
}

#burger span:nth-last-child(2) {
    transform-origin: 0% 100%;
}

#burger.burgerActive span {
    opacity: 1;
    transform: rotate(-45deg);
}
#burger.burgerActive span:nth-last-child(3) {
    transform: rotate(45deg) translate(0, -6px);
}
#burger.burgerActive span:nth-last-child(2) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
}
.button {
    display: grid;
    place-items: center;
    border-radius: 1.2rem;
    cursor: pointer;
    text-decoration: none;
    font-family: "Luckiest Guy", cursive;
    border: none;
    width: 8rem;
    font-size: 1rem;
    height: 3rem;
    color: #e0aaff;
    text-shadow: 3px 2px 1px rgba(16, 0, 43, 0.25);
}
#file-label {
    width: 8rem;
    font-size: 1rem;
    height: 3rem;
}

.primary-button {
    background: #7b2cbf;
    box-shadow: 0px 0px 15px 3px #c77dff;
    transition: all 0.3s ease-in-out;
    outline: none;
}
.primary-button:not(:disabled):hover,
.primary-button:not(:disabled):focus {
    transform: scale(1.1);
    box-shadow: 0px 0px 5px 4px #c77dff;
}
.primary-button:disabled {
    background: transparent;
    color: rgb(88, 85, 85);
    box-shadow: 0px 0px 15px 0px rgb(88, 85, 85);
}
.secondary-button {
    background: transparent;
    transition: all 0.3s ease-in-out;
	box-shadow: 0px 0px 15px 3px #c77dff;
}
.secondary-button:not(:disabled):hover,
.secondary-button:not(:disabled):focus {
    background: #7b2cbf;
	box-shadow: 0px 0px 15px 4px #c77dff;
}
input[type="radio"]:checked+label{
	background: #7b2cbf;
	box-shadow: 0px 0px 15px 4px #c77dff;
}
.sidebar {
    height: 100%; /* 100% Full-height */
    width: 0; /* 0 width - change this with JavaScript */
    position: fixed; /* Stay in place */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    background-color: #3c096c;
    box-shadow: 20px 4px 4px rgba(16, 0, 43, 0.25);
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}
.nav-links {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 5rem;
    height: 25rem;
    padding-left: 2rem;
}
.nav-links a {
    text-decoration: none;
    font-size: 2rem;
    color: #c77dff;
    text-shadow: 10px 4px 4px rgba(16, 0, 43, 0.25);
}
.nav-links a.router-link-active{
	text-decoration: underline;
}
.active {
    width: 20rem;
    border-radius: 0 5rem 5rem 0;
}
body {
    background: url("./assets/background.png") no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}
#app {
    height: 100%;
    width: 100%;
    overflow: hidden;
}

#name-img {
    width: 30%;
}
h1,
h2,
h3 {
    color: #c77dff;
    font-weight: normal;
}
.card {
    position: relative;
    width: 100%;
    border-radius: 1rem;
    height: 100%;
    cursor: pointer;
    transform-style: preserve-3d;
    transform-origin: center right;
    transition: transform 1s;
    background: #7b2cbf;
}
.card.is-flipped {
    transform: translateX(-100%) rotateY(180deg);
}
.card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    color: #e0aaff;
	border-spacing: 0;
    text-align: center;
    backface-visibility: hidden;
}
.card-face-back {
    transform: rotateY(180deg);
    box-shadow: 20px 4px 4px rgba(16, 0, 43, 0.40);
	border-radius: 1rem;
    
}
.card-face-back img {
    width: 100%;
    border-radius: 1rem;
    height: 100%;
}
.card-face-back p {
    margin-top: 5%;
    font-size: 1.3rem;
    font-weight: 100;
    padding: 1rem;
    /* text-shadow: 10px 4px 4px rgba(16, 0, 43, 0.25); */
    text-shadow: 3px 2px 1px rgba(16, 0, 43, 0.25);
}
.card-face-front {
    display: grid;
    place-items: center;
	border: 2px solid #e0aaff;
	border-radius: 1rem;
    font-size: 10rem;
    font-weight: 100;
    text-shadow: 10px 4px 4px rgba(16, 0, 43, 0.25);
    box-shadow: 20px 4px 4px rgba(16, 0, 43, 0.40);
}
label {
    font-size: 2rem;
    color: #c77dff;
}
label.input-label {
    padding-left: 1rem;
    transition: all 0.3s ease-in-out;
    transform: translateY(3.8rem);
}
label.input-label.move-up {
    transform: translateY(-2px);
}
input[type="text"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    border: none;
    border-radius: 1rem;
    border: 2px solid #c77dff;
    box-shadow: 0px 0px 0px 0px #c77dff;
    background-color: transparent;
    /* border-radius: 2rem; */
    color: #c77dff;
    text-align: left;
    padding: 1rem 1rem;
    width: 100%;
    margin: 0.5rem 0;
    font-family: "Luckiest Guy", cursive;
    font-size: 1.6rem;
    transition: all 0.3s ease-in-out;
}
input[type="text"]:focus {
    border: 2px solid #c77dff;
    box-shadow: 0px 0px 15px 3px #c77dff;
}

p {
    font-size: 1.1rem;
    color: #c77dff;
}

@media only screen and (min-width: 768px) and (max-height: 1366px) and (orientation: portrait) {
    body {
        background: url("./assets/small-background.png") no-repeat center center
            fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    }
}
/* ------- iPad 3, 4 and Pro 9.7" ------- */
/* Portrait */
@media only screen and (min-width: 1024px) and (max-height: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1.5) {
    #name-img {
        width: 60%;
    }
}
/* Landscape */
@media only screen and (min-width: 1366px) and (max-height: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1.5) {
    #name-img {
        width: 40%;
    }
}

/* IPAD 1,2, mini */
/* LANDSCAPE */
@media only screen and (min-width: 1024px) and (max-height: 768px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    #name-img {
        width: 40%;
    }
}
/* IPAD 1,2, mini PORTRAIT*/
@media only screen and (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
    #name-img {
        width: 50%;
    }
}
</style>
