import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Pinia, createPinia, setActivePinia } from "pinia";
import Navbar from './Navbar.vue'
import { Router, createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '../router';
import { useUsers } from '../stores/users';

vi.stubGlobal('fetch', vi.fn(() => {
    
}))

describe("Navbar", () => {
    let pinia: Pinia
    let router: Router

    beforeEach(() => {
        const el = document.createElement('div')
        el.id = 'modal'
        document.body.appendChild(el)
        pinia = createPinia()
        setActivePinia(pinia)
        router = createRouter({
            history: createMemoryHistory(),
            routes: routes
        })
    })

    it("renders signin and signup when not authenticated", async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [pinia, router]
            }
        })
        expect(wrapper.find('#sign-up').exists()).toBe(true)
        expect(wrapper.find('[data-testid="sign-in"]').exists()).toBe(true)
    })

    it("renders new post and logout when authenticated", async () => {
        const users = useUsers()
        users.currentUserId = "1"
        const wrapper = mount(Navbar, {
            global: {
                plugins: [pinia, router]
            }
        })
        expect(wrapper.find('a').text()).toBe('New Post')
        expect(wrapper.find('button').text()).toBe('Log Out')
        await wrapper.find("#logout").trigger('click')

        expect(wrapper.find('#sign-up').exists()).toBe(true)
        expect(wrapper.find('[data-testid="sign-in"]').exists()).toBe(true)
        await wrapper.find('[data-testid="sign-in"]').trigger('click')
        expect(document.body.querySelector('#signin-form')).toBeTruthy()
    })
})
