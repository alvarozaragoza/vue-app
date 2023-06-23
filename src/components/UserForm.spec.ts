import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Pinia, createPinia, setActivePinia } from "pinia";
import UserForm from './UserForm.vue'
import { Router, createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '../router';
import { useUsers } from '../stores/users';

vi.stubGlobal('fetch', vi.fn(() => {
    
}))

describe("UserForm", () => {
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

    it("runs through the workflow", async () => {
        const wrapper = mount(UserForm, {
            global: {
                plugins: [pinia, router]
            }
        })

        const btn = wrapper.find('button')
        expect(btn.element.disabled).toBe(true)

        expect(
            wrapper.find('[data-testid="username"]').find('.is-danger').text()
        ).toBe('This field is required')
        expect(
            wrapper.find('[data-testid="password"]').find('.is-danger').text()
        ).toBe('This field is required')

        await wrapper.find('#Username').setValue('user')
        await wrapper.find('#Password').setValue('password')

        expect(
            wrapper.find('[data-testid="username"]').find('.is-danger').text()
        ).toBe('This field must have between 5 and 10 characters')
        expect(
            wrapper.find('[data-testid="password"]').find('.is-danger').text()
        ).toBe('This field must have between 10 and 32 characters')

        expect(btn.element.disabled).toBe(true)

        await wrapper.find('#Username').setValue('username')
        await wrapper.find('#Password').setValue('password123')

        expect(
            wrapper.find('[data-testid="username"]').find('.is-danger').exists()
        ).toBe(false)
        expect(
            wrapper.find('[data-testid="password"]').find('.is-danger').exists()
        ).toBe(false)

        expect(btn.element.disabled).toBe(false)

        wrapper.find('form').trigger('submit.prevent')
        expect(wrapper.emitted().submit2[0]).toEqual([{
             username: 'username',
             password: 'password123'
        }])

        console.log(wrapper.emitted().submit2)
        
    })
})
