let Validator = require('validatorjs');
import moment from 'moment-timezone';

// To include another language in the Validator with variable processmaker
let globalObject = typeof window === 'undefined'
  ? global
  : window;

if (globalObject.ProcessMaker && globalObject.ProcessMaker.user && globalObject.ProcessMaker.user.lang) {
    Validator.useLang(globalObject.ProcessMaker.user.lang);
}

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
                let validationRules = '';
               
                if (typeof this.validation !== 'string' && this.validation.length) {
                    let rules = [];

                    this.validation.forEach(configs => {
                        rules.push(configs.value); 
                    });
            
                    validationRules = rules;
                } else {
                    validationRules = this.validation;
                }

                let rules = {
                    [fieldName]: validationRules
                }
                this.registerCustomRules(data);
                this.validator = new Validator(data, rules, this.validationMessages ? this.validationMessages : null)
                this.validator.setAttributeNames({ [fieldName]: this.label });
                this.validator.errors.first(this.name);
                // Validation will not run until you call passes/fails on it
                this.validator.passes();
            } else {
                this.validator = null
            }

            // Show data type validation messages if exists
            if (this.dataTypeValidator && !this.dataTypeValidatorPasses) {
                if (!this.value) {
                    this.validator = null;
                    return;
                }
                this.validator = this.dataTypeValidator;
            }
        },
        registerCustomRules(data) {
            Validator.register('after', function(date, params) {
                // checks if incoming 'params' is a date or a key reference.
                let checkDate = moment(params);
                if (!checkDate.isValid()) {
                    params = data[params];
                }
                // check if its valid date
                if (!moment(params).isValid()) {
                    return false;
                }
                
                const inputDate = moment(date).toISOString();
                const afterDate = moment(params).toISOString();
            
                return inputDate > afterDate;
            }, 'The :attribute must be after :after.');
            
            Validator.register('after_or_equal', function(date, params) {
                // checks if incoming 'params' is a date or a key reference.
                let checkDate = moment(params);
                if (!checkDate.isValid()) {
                    params = data[params];
                }

                // check if its valid date
                if (!moment(params).isValid()) {
                    return false;
                }

                const inputDate = moment(date).toISOString();
                const equalOrAfterDate = moment(params).toISOString();
                
                return inputDate >= equalOrAfterDate;
            }, 'The :attribute must be equal or after :after_or_equal.');
            
            Validator.register('before', function(date, params) {
                // checks if incoming 'params' is a date or a key reference.
                let checkDate = moment(params);
                if (!checkDate.isValid()) {
                    params = data[params];
                }

                // check if its valid date
                if (!moment(params).isValid()) {
                    return false;
                }

                const inputDate = moment(date).toISOString();
                const beforeDate = moment(params).toISOString();
                
                return inputDate < beforeDate;
            }, 'The :attribute must be before :before.');
            
            Validator.register('before_or_equal', function(date, params) {
                // checks if incoming 'params' is a date or a key reference.
                let checkDate = moment(params);
                if (!checkDate.isValid()) {
                    params = data[params];
                }

                // check if its valid date
                if (!moment(params).isValid()) {
                    return false;
                }
            
                const inputDate = moment(date).toISOString();
                const beforeDate = moment(params).toISOString();
                
                return inputDate <= beforeDate;
            }, 'The :attribute must be equal or after :before_or_equal.');
        }
    }
}
