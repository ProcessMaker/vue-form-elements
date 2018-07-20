let Validator = require('validatorjs');

export default {
    props: [
        'validation',
        'validationData'
    ],
    data() {
        return {
            validator: null
        }
    },
    mounted() {
        this.updateValidation()
    },
    watch: {
        // Triggered whenever the v-model is updated
        value() {
            this.updateValidation()
        },
        // Triggered whenever the validation rule is updated
        validation() {
            this.updateValidation()
        },
        label() {
            this.updateValidation()
        },
        validationData: {
            handler: function() {
                console.log("In handling validationData change")
                this.updateValidation() 
            },
            deep: true
        }
    },
    methods: {
        updateValidation() {
            if (this.validation) {
                let data = this.validationData ? this.validationData : {[this.name]: this.value}
                let rules = {
                    [this.name]: this.validation
                }
                this.validator = new Validator(data, rules)
                // Validation will not run until you call passes/fails on it
                this.validator.passes()
            } else {
                this.validator = null
            }
        }
    }
}