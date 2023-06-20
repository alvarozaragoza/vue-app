import { ref, shallowRef } from "vue";
import HelloWorld from "../components/HelloWorld.vue";
import SignupForm from "../components/SignupForm.vue"

const show = ref(false);
const component = shallowRef();

export function useModal () {
    return {
        show,
        component,
        showModal: (type: 'signIn' | 'signUp' ) => {
            show.value = true
            switch (type) {
                case 'signIn': return component.value = HelloWorld
                case 'signUp': return component.value = SignupForm
            }
        },
        hideModal: () => (show.value = false)
    }
}