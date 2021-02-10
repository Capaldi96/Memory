<template>
    <div class="scoreboard-content">
        <div v-if="!request.status" class="error-content">
			<error :errorMessage="request.message"></error>
        </div>
        <div v-if="request.status" class="content">
			<h1>Scoreboard</h1>
            <div class="button-div">
                <input
                    type="radio"
                    name="difficulty"
                    id="easy-button"
                    @click="changeList('Easy')"
                    :checked="checked == 'Easy'"
                />
                <label for="easy-button" class="button secondary-button"
                    >Easy</label
                >

                <input
                    type="radio"
                    name="difficulty"
                    id="medium-button"
                    @click="changeList('Medium')"
                    :checked="checked == 'Medium'"
                />
                <label for="medium-button" class="button secondary-button"
                    >Medium</label
                >
                <input
                    type="radio"
                    name="difficulty"
                    id="hard-button"
                    @click="changeList('Hard')"
                    :checked="checked == 'Hard'"
                />
                <label for="hard-button" class="button secondary-button"
                    >Hard</label
                >
            </div>
            <transition name="fade-in" mode="out-in">
                <div id="scoreboard" :key="keyValue">
                    <table id="leaderboard">
                        <thead>
                            <th></th>
                            <th class="name">Name</th>
                            <th class="theme">Theme</th>
                            <th class="time">Time</th>
                            <th class="score">Score</th>
                        </thead>

                        <tbody>
                            <tr v-for="(item, index) in list" :key="item._id">
                                <td class="placement">{{ index + 1 }}.</td>
                                <td class="name">{{ item.name }}</td>
                                <td class="theme">{{ item.theme }}</td>
                                <td class="time">
                                    {{ formatTime(item.minutes) }}:{{
                                        formatTime(item.seconds)
                                    }}
                                </td>
                                <td class="score">{{ item.score }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, onBeforeMount, reactive } from "vue";
import axios from "axios";
import Error from "./Error.vue";
export default {
    props: {
        difficulty: String,
    },
	components:{
		Error
	},
    setup(props) {
        onBeforeMount(() => {
            if (props.difficulty) {
                checked.value = props.difficulty;
            }
            getScore(props.difficulty);
        });
        const checked = ref("Easy");
        const list = ref([]);
		const request = reactive({
			status:null,
			message:''
		})
        const easyList = ref([]);
        const mediumList = ref([]);
        const hardList = ref([]);
        const keyValue = ref(false);
        function changeList(difficulty) {
            keyValue.value = !keyValue.value;
            if (difficulty === "Easy") {
                if (easyList.value.length === 0) {
                    getScore("Easy");
                } else list.value = easyList.value;
            } else if (difficulty === "Medium") {
                if (mediumList.value.length === 0) {
                    getScore("Medium");
                } else list.value = mediumList.value;
            } else if (difficulty === "Hard") {
                if (hardList.value.length === 0) getScore("Hard");
                else list.value = hardList.value;
            }
        }
        async function getScore(group) {
            await axios
                .get("/api/getScoreBoard/" + group)
                .then((res) => {
                    list.value = res.data;
                    if (easyList.value.length === 0 && group == "Easy")
                        easyList.value = res.data;
                    if (mediumList.value.length === 0 && group === "Medium")
                        mediumList.value = res.data;
                    if (hardList.value.length === 0 && group === "Hard")
                        hardList.value = res.data;
                    request.status = true;
                })
                .catch((err) => {
                    request.message = err.message;
                    request.status = false;
                });
        }
        function formatTime(time) {
            if (time < 10) {
                return "0" + time;
            }
            return time;
        }
        return {
            list,
            changeList,
            checked,
            formatTime,
            keyValue,
            request
        };
    },
};
</script>

<style scoped>
.scoreboard-content{
    height: 100%;
    width: 100%;
}
.error-content {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
}
.error-div {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 100%;
}
.content h1{
	font-size: 3rem;
}
.button-div {
    display: flex;
    flex-direction: row;
    width: 30%;
    justify-content: space-between;
}
input[type="radio"] {
    display: none;
}
#scoreboard {
    width: 60%;
    display: flex;
    flex-direction: column;
    height: 65%;
    overflow-y: auto;
}
table#leaderboard {
    font-size: 2rem;
    color: #c77dff;
}
th.name {
    text-align: left;
}
td.score,
td.placement,
td.time,
td.theme {
    text-align: center;
}
#leaderboard tr td,
th {
    padding: 0.2rem 0;
}

/* ------- iPad 3, 4 and Pro 9.7" ------- */
/* Portrait */
@media only screen and (min-width: 1024px) and (max-height: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1.5) {
    #scoreboard {
        width: 90%;
    }
    .button-div {
        width: 50%;
    }
}
/* Landscape */
@media only screen and (min-width: 1366px) and (max-height: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1.5) {
    #scoreboard {
        width: 80%;
    }
    .button-div {
        width: 40%;
    }
}

/* IPAD 1,2, mini */
/* LANDSCAPE */
@media only screen and (min-width: 1024px) and (max-height: 768px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    #scoreboard {
        width: 95%;
    }
    .button-div {
        width: 50%;
    }
    #name-img {
        width: 40%;
    }
}
/* IPAD 1,2, mini PORTRAIT*/
@media only screen and (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
    #scoreboard {
        width: 90%;
    }
    .theme {
        display: none;
    }
    .button-div {
        width: 70%;
    }
}
</style>