import { createWebHistory, createRouter } from "vue-router";
import Setup from "../components/StartGame.vue";
import Tutorial from "../components/TutorialPage.vue";
import Play from "../components/Play.vue";
import Scoreboard from "../components/Scoreboard.vue";
import CreateCard from "../components/CreateCard.vue";
import Gallery from "../components/Gallery.vue";


const routes = [
	{
		path: "/",
		name: "Tutorial",
		component: Tutorial,
	},
	{
		path: "/Setup",
		name: "Setup",
		component: Setup,
	},

	{
		path: '/Play/:difficulty/:theme',
		name: 'Play',
		component: Play,
		props: true,
	},
	{
		path: "/Scoreboard/:difficulty",
		name: "Scoreboard",
		component: Scoreboard,
		props:true,
	},
	{
		path: "/Create",
		name: "CreateCard",
		component: CreateCard,
	},
	{
		path: "/Gallery",
		name: "Gallery",
		component: Gallery,
	},

];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;