<script lang="ts" setup>

import { computed, ref } from 'vue';
import { NewUser } from '../users.js'
import { validate, lenght, required } from '../validation.js'
import FormInput from './FormInput.vue';

defineProps<{
    error?: string;
}>();

const emit = defineEmits<{
    (event: 'submit2', payload: NewUser): void
}>()

const username = ref('')
const usernameStatus = computed( () => {
  return validate(username.value, [required, lenght({ min: 5, max: 10 })])
})

const password = ref('')
const passwordStatus = computed( () => {
  return validate(password.value, [required, lenght({ min: 10, max: 32 })])
})

const isInvalid = computed(() => {
    return (!usernameStatus.value.valid || !passwordStatus.value.valid)
})

async function handleSubmit () {
    if (isInvalid.value) {
        return
    }
    const newUser: NewUser = {
        username: username.value,
        password: password.value
    }
    
    try {
        emit('submit2', newUser)
        console.log('emit submit')
    } catch (e) {}    
}
</script>

<template>
    <form class="form" @submit.prevent="handleSubmit">
        <FormInput data-testid="username" name="Username" v-model="username" :status="usernameStatus" type="text" />
        <FormInput data-testid="password" name="Password" v-model="password" :status="passwordStatus" type="password" />
        <div v-if="error" class="is-danger help">
            {{ error }}
        </div>
        <button class="button" :disabled="isInvalid">Submit</button>
    </form>
</template>

<style scoped>
.form {
    background: white;
    padding: 30px;
    margin-top: 50px;
}
</style>

