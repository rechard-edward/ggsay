import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Games from "../views/Games.vue";
import GameDetail from "../views/GameDetail.vue";
import Settings from "../views/Settings.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "dashboard", component: Dashboard },
    { path: "/games", name: "games", component: Games },
    { path: "/games/:id", name: "game-detail", component: GameDetail },
    { path: "/settings", name: "settings", component: Settings },
  ],
});

export default router;
