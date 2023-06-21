<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router';
import { usePosts } from '../stores/posts';
import { useUsers } from '../stores/users';
import { computed } from 'vue';

const route = useRoute();
const postStore = usePosts();
const usersStore = useUsers();

const id = route.params.id as string
const post = postStore.all.get(id)

if (!post) {
    throw new Error(`Post with id ${id} was not found`);
}

const canEdit = computed( () => {
    if (!usersStore.currentUserId) { return false }
    if (usersStore.currentUserId !== post.authorId) { return false }
    return true
})
</script>

<template>
    <div class="columns">
        <div class="column"></div>
        <div class="column is-two-thirds">
            <RouterLink
                v-if="canEdit"
                :to="`/posts/${post.id}/edit`"
                class="is-link button is-rounded"
            >Edit Post</RouterLink>
            <h1>{{ post.title }}</h1>
            <div v-html="post.html" />
        </div>
    </div>
    <div class="column"></div>
</template>