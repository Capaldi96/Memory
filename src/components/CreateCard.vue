<template>
    <div class="create-content">
        <transition name="fade-in" mode="out-in">
            <div class="form-content" v-if="!loading">
                <h1>Create your own card</h1>
                <div class="create-card-form">
                    <div class="form-container">
                        <div class="input-container">
                            <label
                                for="card-name-input"
                                id="card-name-label"
                                class="input-label"
                                :class="form.nameMoveUp ? 'move-up' : ''"
                                >Name</label
                            >
                            <input
                                type="text"
                                @focus="form.nameMoveUp = true"
                                @blur="
                                    form.nameTouched = true;
                                    if (!form.name) form.nameMoveUp = false;
                                "
                                v-model="form.name"
                                id="card-name-input"
                                autocomplete="off"
                                name="name-input"
                                required
                            />
                            <p
                                :style="{
                                    visibility:
                                        form.nameTouched && !validateName()
                                            ? 'visible'
                                            : 'hidden',
                                }"
                            >
                                {{ form.nameMessage }}
                            </p>
                        </div>
                        <div class="input-container">
                            <label
                                for="card-group-input"
                                id="card-group-label"
                                class="input-label"
                                :class="form.groupMoveUp ? 'move-up' : ''"
                                >Group</label
                            >
                            <input
                                type="text"
                                @focus="form.groupMoveUp = true"
                                @blur="
                                    form.groupTouched = true;
                                    if (!form.group) form.groupMoveUp = false;
                                "
                                v-model="form.group"
                                id="card-group-input"
                                autocomplete="off"
                                name="group-input"
                                required
                            />
                            <p
                                :style="{
                                    visibility:
                                        form.groupTouched && !validateGroup()
                                            ? 'visible'
                                            : 'hidden',
                                }"
                            >
                                {{ form.groupMessage }}
                            </p>
                        </div>
                        <div class="button-div">
                            <label
                                for="file-input"
                                id="file-label"
                                class="button primary-button"
                                @click="form.imageTouched = true"
                                >{{
                                    form.image ? "Change Image" : "Choose Image"
                                }}</label
                            >
                            <input
                                type="file"
                                accept="image/*"
                                @change="uploadImage($event)"
                                id="file-input"
                                name="file-input"
                            />
                            <button
                                class="button primary-button"
                                :disabled="
                                    !validateName() ||
                                    !validateImage() ||
                                    !validateGroup()
                                "
                                @click="uploadImageToCloudinary(form.image)"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                    <div class="card-div">
                        <div class="scene scene-card">
                            <div
                                class="card"
                                @click="flip(form)"
                                :class="{ ' is-flipped': form.isFlipped }"
                            >
                                <div class="card-face card-face-front">?</div>
                                <div class="card-face card-face-back">
                                    <img
                                        v-if="form.image"
                                        :src="form.image"
                                        :alt="form.name"
                                    />
                                </div>
                            </div>
                        </div>
                        <p
                            :style="{
                                visibility:
                                    form.imageTouched && !validateImage()
                                        ? 'visible'
                                        : 'hidden',
                            }"
                        >
                            {{ form.imageMessage }}
                        </p>
                    </div>
                </div>
                <transition name="fade-in" mode="out-in">
                    <h2 :style="{ visibility: uploaded ? 'visible' : 'hidden' }">{{uploadMessage}}</h2>
                </transition>
            </div>
        </transition>
        <transition name="fade-in" mode="out-in">
            <div class="form-content" v-if="loading">
                <swapping-squares-spinner
                    :animation-duration="1000"
                    :size="80"
                    :color="'#c77dff'"
                />
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import "epic-spinners/dist/lib/epic-spinners.min.css";
//import { AtomSpinner } from "epic-spinners/dist/lib/epic-spinners.min.js";
import { SwappingSquaresSpinner } from "epic-spinners";

export default {
    components: {
        SwappingSquaresSpinner,
    },
    setup() {
        const loading = ref(false);
        const uploaded = ref(false);
        const form = reactive({
            name: "",
            image: null,
            group: "",
            nameMoveUp: false,
            groupMoveUp: false,
            nameTouched: false,
            imageTouched: false,
            groupTouched: false,
            nameMessage: "Let's not forget the name!",
            groupMessage: "Let's not forget the group!",
            imageMessage: "Let's not forget the image!",
        });
		const isDisabled = ref(true);
		const uploadMessage = ref('');
        function flip(card) {
            card.isFlipped = !card.isFlipped;
        }
        function uploadImage(e) {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = (e) => {
                form.image = e.target.result;
            };
        }
        function resetForm() {
            form.name = "";
            form.image = null;
            form.group = "";
            form.nameMoveUp = false;
            form.groupMoveUp = false;
            form.nameTouched = false;
            form.imageTouched = false;
            form.groupTouched = false;
            form.nameMessage = "Let's not forget the name!";
            form.groupMessage = "Let's not forget the group!";
            form.imageMessage = "Let's not forget the image!";
        }
        function validateName() {
            if (form.name.length < 1) {
                form.nameMessage = "Let's not forget the name!";
                return false;
            } else if (form.name.length < 2) {
                form.nameMessage = "Hey! Name is too short, min 2 characters!";
                return false;
            } else if (form.name.length > 15) {
                form.nameMessage = "Hey! Name is too long, max 15 characters.";
                return false;
            } else {
                return true;
            }
        }
        function validateGroup() {
            if (form.group.length < 1) {
                form.groupMessage = "Let's not forget the group!";
                return false;
            } else if (form.group.length < 3) {
                form.groupMessage =
                    "Hey! Group is too short, min 3 characters!";
                return false;
            } else if (form.group.length > 15) {
                form.groupMessage =
                    "Hey! Group is too long, max 15 characters.";
                return false;
            } else {
                return true;
            }
        }
        function validateImage() {
            if (form.image === null) {
                return false;
            } else {
                return true;
            }
        }

        async function uploadImageToCloudinary(base64Encoded) {
            loading.value = true;
            try {
                let response = await fetch("/api/uploadImage", {
                    method: "POST",
                    body: JSON.stringify({ data: base64Encoded }),
                    headers: { "Content-type": "application/json" },
                });
                let data = await response.json();
                let newCard = {
                    name: form.name,
                    img:
                        "https://res.cloudinary.com/deusclkek/image/upload/v1601296218/" +
                        data.id,
                    group: form.group,
                    custom: true,
                };
                addNewCard(newCard);
            } catch (error) {
                loading.value = false;
                console.log(error);
                uploadedStatus("fail", error.message);
                // form.image = error.err;
            }
        }
        function uploadedStatus(status) {
			uploadMessage.value = false;
            if (status === "success") {
				uploadMessage.value = 'Success! Your card was added to the deck.';
                uploaded.value = true;
				setTimeout(() => (uploaded.value = false), 3000);
				
            } else if (status === "fail") {
				uploadMessage.value = 'Something went wrong, try again later.';
                uploaded.value = true;
            }
        }
        async function addNewCard(newCard) {
            try {
                await fetch("/api/addCard", {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(newCard),
                });
                uploadedStatus("success");
                resetForm();
                loading.value = false;
            } catch (error) {
                console.log(error);
                uploadedStatus("fail");
                // form.image = error.err
            }
        }
        return {
            flip,
            uploadImage,
            uploadImageToCloudinary,
            form,
            isDisabled,
            loading,
            validateName,
            validateGroup,
            validateImage,
			uploaded,
			uploadMessage
        };
    },
};
</script>

<style scoped>
.create-content {
    width: 100%;
    height: 100%;
}
.form-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
h2 {
    color: #c77dff;
    font-weight: normal;
}
h1 {
    color: #c77dff;
    font-weight: normal;
    font-size: 3rem;
}
.create-card-form {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 60%;
    height: 60%;
}
.form-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 40%;
    justify-content: space-evenly;
}
.input-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.input-container input {
    width: 90%;
}
.button-div {
    display: flex;
    width: 90%;
    justify-content: flex-end;
}
.button-div label {
    margin-right: 2rem;
}
.card-div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 25%;
    height: 70%;
    text-align: center;
}
input[type="file"] {
    display: none;
}
label.input-label {
    transform: translateY(4rem);
}
label.input-label.move-up {
    transform: translateY(-2px);
}

.scene {
    height: 90%;
    width: 100%;
    perspective: 600px;
}
/* ------- iPad 3, 4 and Pro 9.7" ------- */
/* Portrait */
@media only screen and (min-width: 1024px) and (max-height: 1366px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1.5) {
    .create-card-form {
        width: 100%;
    }
    .card-div {
        width: 30%;
        height: 80%;
        justify-content: center;
    }
    .form-container {
        height: 70%;
    }

    .scene {
        height: 60%;
        margin-bottom: 1rem;
    }
}
/* Landscape */
@media only screen and (min-width: 1366px) and (max-height: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1.5) {
    .create-card-form {
        height: 60%;
        width: 90%;
    }
}

/* IPAD 1,2, mini */
/* LANDSCAPE */
@media only screen and (min-width: 1024px) and (max-height: 768px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
    .create-card-form {
        height: 70%;
        width: 100%;
    }
}
/* IPAD 1,2, mini PORTRAIT*/
@media only screen and (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 1) {
    .create-card-form {
        width: 100%;
    }
    .card-div {
        width: 30%;
        height: 90%;
        justify-content: center;
    }
    .form-container {
        height: 90%;
        width: 50%;
    }

    .scene {
        height: 60%;
        margin-bottom: 1rem;
    }
}
</style>