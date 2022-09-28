import Vue from 'vue';
import { watch, ref } from "@vue/composition-api";
import VueCompositionAPI from '@vue/composition-api';

Vue.use(VueCompositionAPI);
// const computedValue = ( props ) => {
    // const validationData = ref(props.validationData);
   
    // return computed(() => {
    //     return "hola mundo" + content;
    //   });
   
// };
export const useHtmlEditorControl = (props) => {
    console.log("useHtmlEditorControl");
    const content = ref(props.content);
    console.log(content.value);
    watch(
        () => content,
        (newContent, prevContent) => {
            console.log("deep ", newContent, prevContent);
            // content.value = newContent.value + "test";
        }
        );
    // console.log(props);
    // computedValue(props);
    return {
        test: "aa"
    }
}