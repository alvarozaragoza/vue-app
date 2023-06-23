<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';
import { Post, TimelinePost } from '../posts';
import { marked } from 'marked';
import highlightjs from 'highlight.js';
import debounce from "lodash/debounce";
import { useUsers } from '../stores/users';

const props = defineProps<{
    post: TimelinePost | Post;
}>()

const emit = defineEmits<{
    (event: "submit", post: Post): void;
}>();

const title = ref(props.post.title);
const content = ref(props.post.markdown);
const html = ref('');
const contentEditable = ref<HTMLDivElement>();

const usersStore = useUsers();

function parseHtml (markdown: string) {
    marked.parse(markdown, {
        gfm: true,
        breaks: true,
        highlight: (code) => {
            return highlightjs.highlightAuto(code).value
        }
    }, (err, parseResult) => {
        if (err) {
            throw Error('Error parsing content')
        }
        html.value = parseResult
    })
}

watch(content, debounce((newContent) => {
    parseHtml(newContent)
}, 250), {
    immediate: true
})

onMounted(() => {
    if (!contentEditable.value) {
        throw Error('ContentEditable DOM node was not found')
    }
    contentEditable.value.innerText = content.value
})

function handleInput() {
    if (!contentEditable.value) {
        throw Error('ContentEditable DOM node was not found')
    }
    content.value = contentEditable.value.innerText
}

async function handleClick () {
    if (!usersStore.currentUserId) {
        throw Error('User was not found')
    }
    const newPost: Post = {
        ...props.post,
        created: typeof props.post.created === 'string' ? props.post.created : props.post.created.toISO(),
        authorId: usersStore.currentUserId,
        title: title.value,
        markdown: content.value,
        html: html.value
    }
    emit('submit', newPost);
}

</script>

<template>
    <div class="columns">
        <div class="column">
            <div class="field">
                <div class="label">Post Title</div>
                <input type="text" class="input" v-model="title">
                {{ title }}
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column">
            <div id="contenteditable" contenteditable ref="contentEditable" @input="handleInput" />
        </div>
        <div class="column">
            <div v-html="html" />
        </div>
    </div>
    <div class="columns">
        <div class="column">
            <button id="submit" class="button is-primary is-pulled-right" @click="handleClick">
                Save Post
            </button>
        </div>
    </div>
</template>