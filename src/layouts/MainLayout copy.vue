<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <ToolbarTitle :toolbarTitle="toolbarTitle" />
        <q-btn flat dense round icon="notifications" aria-label="">

        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-primary"
      :width="250"
      :breakpoint="767"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label class="text-white" header> Navigation </q-item-label>
        <!-- <NavLink
          v-for="link in NavLinks"
          :key="link.title"
          v-bind="link"
          @click="handleClick(link.title)"
        /> -->
        <q-expansion-item
          expand-separator
          icon="view_module"
          label="Menu"
          class="text-white"
        >
          <NavLink
            v-for="link in SubMasters"
            :key="link.title"
            v-bind="link"
            @click="handleClick(link.title)"
          />
        </q-expansion-item>
        <!-- <q-separator spaced /> -->
        <q-item
          v-if="storeAuth.isLoggedIn"
          @click="storeAuth.logout()"
          clickable
          class="text-white"
          tag="a"
        >
          <q-item-section avatar>
            <q-avatar v-if="storeAuth.isLoggedIn" size="30px">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <q-icon v-else name="logout"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>Log out</q-item-label>
            <q-item-label
              class="text-caption text-weight-thin"
              ></q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-primary shadow-up-2">
      <q-tabs
        v-model="tab"
        dense
        class="text-white"
        active-color="grey-8"
        indicator-color="transparent"
      >
        <q-route-tab
          v-for="nav in ButtomLinks"
          :key="nav.name"
          :name="nav.name"
          :icon="nav.icon"
          :to="nav.route"
          :label="nav.label"
          @click="handleClick(nav.label)"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import NavLink from "components/Nav/NavLink.vue";
import ToolbarTitle from "components/Layout/ToolbarTitle.vue";
import { useStoreAuth } from 'src/stores/storeAuth'

const storeAuth = useStoreAuth()
const leftDrawerOpen = ref(false)

const SubMasters = [
  {
    title: "Home Care",
    icon: "local_hospital",
    link: "/home",
  },

];
const tab = ref("home");
const ButtomLinks = ref([
  {
    name: "Home",
    icon: "home",
    label: "Home",
    route: "/",
    requiredLevel: null, // Available to all
  },

  {
    name: "Alert",
    icon: "notification_important",
    label: "Alert",
    route: "/alert",
    requiredLevel: null, // Available to all
  },
  {
    name: "Account",
    icon: "person",
    label: "Account",
    route: "/profiles",
    requiredLevel: null,

    // Available to all
  },
]);


function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toolbarTitle = ref("Homecare"); // Initial title
const updateToolbarTitle = (newTitle) => {
  toolbarTitle.value = newTitle;
};
const handleClick = (title) => {
  updateToolbarTitle(title);
};

</script>
