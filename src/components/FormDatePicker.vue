<template>
    <div class="form-group position-relative">
        <label v-uni-for="name">{{label}}</label>
        <date-picker
                :config="config"
                :value="date"
                @input="setDate"
                :disabled="disabled"
                :placeholder="placeholder"
                :data-test="dataTest"
        />
        <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
            <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
            <div v-if="error">{{error}}</div>
        </div>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
</template>

<script>
    import {createUniqIdsMixin} from 'vue-uniq-ids';
    import ValidationMixin from './mixins/validation';
    import DataFormatMixin from "./mixins/DataFormat";
    import datePicker from 'vue-bootstrap-datetimepicker';
    import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
    import moment from 'moment-timezone';
    import {getLang, getTimezone, getUserDateFormat, getUserDateTimeFormat} from '../dateUtils';

    const uniqIdsMixin = createUniqIdsMixin();
    const datetimeStdFormat = 'YYYY-MM-DDTHH:mm:ssZZ';

    export default {
        mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
        components: {
            datePicker
        },
        props: {
            emitIso: Boolean,
            name: String,
            placeholder: String,
            label: String,
            error: String,
            helper: String,
            dataFormat: String,
            value: String,
            inputClass: {type: [String, Array, Object], default: 'form-control'},
            dataTest: String,
            disabled: null,
        },
        data() {
            return {
                date: null,
                config: {
                    format: datetimeStdFormat,
                    timeZone: getTimezone(),
                    locale: getLang(),
                    useCurrent: false,
                    showClear: true,
                    showClose: true,
                    icons: {
                        time: 'far fa-clock',
                        date: 'far fa-calendar',
                        up: 'fas fa-arrow-up',
                        down: 'fas fa-arrow-down',
                        previous: 'fas fa-chevron-left',
                        next: 'fas fa-chevron-right',
                        today: 'fas fa-calendar-check',
                        clear: 'far fa-trash-alt',
                        close: 'far fa-times-circle'
                    }
                },
            }
        },
        watch: {
            dataFormat: {
                immediate: true,
                handler() {
                    this.config.format = this.dataFormat === 'datetime' ? Object(dateUtils["d" /* getUserDateTimeFormat */])() : Object(dateUtils["c" /* getUserDateFormat */])();

                    if (typeof (this.value) === 'undefined') {
                        var newDate = moment();
                        this.emitir(newDate);
                    }
                    else {
                        this.setDate(this.value);
                    }                }
            },
            value: {
                immediate: false,
                handler: function handler(_value) {
                    if (typeof (_value) === 'undefined') {
                        var newDate = moment();
                        this.emitir(newDate);
                    }
                    else {
                        this.setDate(_value);
                    }
                }
            }        },
        methods: {
            emitir: function (fecha) {
                var porEmitir = this.emitIso ? fecha.toISOString() : fecha.format(this.config.format);
                console.log('>>Emitiendo: ', porEmitir);
                this.$emit('input', porEmitir);
            },
            fechita: function(fecha) {
                console.log('fechita', fecha);
                moment_timezone_default().tz.setDefault(this.config.timeZone);
                if (fecha) {
                    return moment_timezone_default()(fecha, this.config.format).tz(this.config.timeZone);
                }
                else {
                    return moment_timezone_default()().tz(this.config.timeZone);
                }
            },
            setDate(date) {
                console.log('----------');
                console.log('** setDate: ', date);
                if (typeof (date) === 'undefined') {
                    var newDate = moment();
                    this.emitir(newDate);
                    return;
                }
                moment_timezone_default().tz.setDefault(this.config.timeZone);
                var currentDate = moment_timezone_default()(this.date, this.config.format).tz(this.config.timeZone);
                var newDate = moment_timezone_default.a.tz(moment_timezone_default()(date, this.config.format).format('YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DDTHH:mm:ss', this.config.timeZone);

                console.log('currentDate: ' + currentDate.toString());
                console.log('newDate: ' + newDate.toString());
                //console.log('moment(date):' + moment_timezone_default()(date).toString());
                //console.log('moment(date, ZH)' + moment_timezone_default()(date, this.config.timeZone).toString());
                //console.log('moment(date, LP)' + moment_timezone_default()(date, 'America/La_Paz').toString());

                if (newDate.isSame(currentDate, 'minute') || !newDate.isValid()) {
                    this.emitir(currentDate);
                    return;
                }

                this.date = newDate;
                console.log('Emitiendo: '+ newDate.format(this.config.format));
                console.log('----------');
                this.emitir(newDate);
            }
        },
    };
</script>

<style>
    .inspector-container .bootstrap-datetimepicker-widget.dropdown-menu {
        font-size: 11px;
    }
</style>
