let Validator = require('validatorjs');

export default {
    props: [
        'validation',
        'validationData',
        'validationField',
        'validationMessages'
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
                this.updateValidation() 
            },
            deep: true
        }
    },
    methods: {
        updateValidation() {
            if (this.validation) {
                let fieldName = this.validationField ? this.validationField : this.name;
                let data = this.validationData ? this.validationData : {[fieldName]: this.value}
                let rules = {
                    [fieldName]: this.validation
                }
                this.validator = new Validator(data, rules, this.validationMessages ? this.validationMessages : null)
                // Validation will not run until you call passes/fails on it
                this.validator.passes()
            } else {
                this.validator = null
            }
        }
    }
}