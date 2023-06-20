<script lang="ts" setup>
import UserForm from './UserForm.vue';
import { useUsers } from '../stores/users';
import { NewUser } from '../users';
import { useModal } from '../composables/modal';

const usersStore = useUsers()
const modal = useModal()

async function handleSignup (newUser: NewUser) {
    console.log('handleSignup')
    await usersStore.createUser( newUser )
    modal.hideModal()
}
</script>

<template>
    <UserForm @submit2="handleSignup" />
</template>
