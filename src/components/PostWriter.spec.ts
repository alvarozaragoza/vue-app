import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Pinia, createPinia, setActivePinia } from "pinia";
import PostWriter from './PostWriter.vue'
import { Router, createMemoryHistory, createRouter } from 'vue-router';
import { routes } from '../router';
import { useUsers } from '../stores/users';

vi.stubGlobal('fetch', vi.fn(() => {
    
}))

describe("PostWriter", () => {
    let pinia: Pinia
    let router: Router

    beforeEach(() => {
        const el = document.createElement('div')
        el.id = 'modal'
        document.body.appendChild(el)
        pinia = createPinia()
        setActivePinia(pinia)
        const user = useUsers()
        user.currentUserId = "1"
        router = createRouter({
            history: createMemoryHistory(),
            routes: routes
        })
    })

    it("writes a post using markdown", () => {
        return new Promise<void>( async (resolve) => {
            const wrapper = mount(PostWriter, {
                global: {
                    plugins: [pinia, router]
                },
                props: {
                    post: {
                        id: "1",
                        title: "",
                        authorId: "1",
                        created: "",
                        markdown: "",
                        html: ""  
                    }
                }
            })

            wrapper.find<HTMLDivElement>("#contenteditable").element.innerText = '# Title'
            await wrapper.find("#contenteditable").trigger("input");     

            setTimeout( async () => {
                await wrapper.find('#submit').trigger('click')
                console.log(wrapper.html());
                console.log((wrapper.emitted().submit)[0])
                expect((wrapper.emitted().submit)[0]).toEqual(
                    [
                        {
                          id: '1',
                          title: '',
                          authorId: '1',
                          created: '',
                          markdown: '# Title',
                          html: '<h1 id="title">Title</h1>\n'
                        }
                    ]
                )
                expect((wrapper.emitted().submit)[0]).toMatchInlineSnapshot(`
                  [
                    {
                      "authorId": "1",
                      "created": "",
                      "html": "<h1 id=\\"title\\">Title</h1>
                  ",
                      "id": "1",
                      "markdown": "# Title",
                      "title": "",
                    },
                  ]
                `)
                resolve()
            }, 400);
        })
    })
})
