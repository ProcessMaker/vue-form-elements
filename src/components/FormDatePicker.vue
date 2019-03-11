<template>
    <div class="form-group">
        <label v-uni-for="name">{{label}}</label>
        <datetime
                type="datetime"
                v-model="content"
                :value="content"
                @input="updateValue"
                :input-class="dtClass"
                :value-zone="dtZoneServer"
                :zone="dtZoneClient"
                :title="placeholder"
                :format="dtFormat"
                :phrases="dtPhrases"
                :hour-step="dtHourStep"
                :minute-step="dtMinuteStep"
                :min-datetime="dtMin"
                :max-datetime="dtMax"
                :week-start="7"
                :use12-hour="dtUse12Hour"
                auto
        ></datetime>

        <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
            <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
            <div v-if="error">{{error}}</div>
        </div>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
</template>


<script>
  /* global ProcessMaker*/
  import {createUniqIdsMixin} from "vue-uniq-ids";
  import ValidationMixin from "./mixins/validation";
  import {Datetime} from 'vue-datetime';

  // You need a specific loader for CSS files
  import 'vue-datetime/dist/vue-datetime.css'

  // Create the mixin
  const uniqIdsMixin = createUniqIdsMixin();
  export default {
    mixins: [uniqIdsMixin, ValidationMixin],
    components: {
      datetime: Datetime
    },
    props: [
      'label',
      'error',
      'helper',
      'type',
      'name',
      'placeholder',
      'value',
      'minDatetime',
      'maxDatetime',
      'format',
      'phrases',
      'hourStep',
      'use12Hour',
      'minuteStep',
      'zoneServer',
      'zoneClient',
      'controlClass',
    ],
    computed: {
      dtClass() {
        let controlClass = 'form-control';
        if (this.controlClass) {
          controlClass = this.controlClass;
        }
        return controlClass;
      },
      dtMin() {
        if (this.minDatetime) {
          return this.minDatetime;
        }
        return "1";
      },
      dtMax() {
        if (this.maxDatetime) {
          return this.maxDatetime;
        }
        return "1";
      },
      dtFormat() {
        //If the global variable is set by default.
        if (typeof ProcessMaker !== "undefined" && ProcessMaker.user && ProcessMaker.user.calendar_format) {
          return ProcessMaker.user.calendar_format;
        }
        if (this.format && typeof this.format === 'string') {
          return this.format;
        }
        let format = {};
        format.year = 'numeric';
        format.month = 'numeric';
        format.day = 'numeric';
        format.hour = 'numeric';
        format.minute = '2-digit';
        if (this.format && typeof this.format === 'object') {
          format.year = this.format.year ? this.format.year : format.year;
          format.month = this.format.month ? this.format.month : format.month;
          format.day = this.format.day ? this.format.day : format.day;
          format.hour = this.format.hour ? this.format.hour : format.hour;
          format.minute = this.format.minute ? this.format.minute : format.minute;

          if (this.format.timeZoneName) {
            format.timeZoneName = this.format.timeZoneName;
          }
        }
        return format;
      },
      dtPhrases() {
        let phrases = {};
        phrases.ok = 'Continue';
        phrases.cancel = 'Exit';
        if (this.phrases && typeof this.phrases === 'string') {
          try {
            phrases = JSON.parse(this.phrases)
          } catch (e) {
            //phrases with values by default
          }
        }
        if (this.phrases && typeof this.phrases === 'object') {
          phrases.ok = this.phrases.ok ? this.phrases.ok : phrases.ok;
          phrases.cancel = this.phrases.cancel ? this.phrases.cancel : phrases.cancel;
        }
        return phrases;
      },
      dtHourStep() {
        if (this.hourStep) {
          return parseInt(this.hourStep);
        }
        return 1;
      },
      dtMinuteStep() {
        if (this.minuteStep) {
          return parseInt(this.minuteStep);
        }
        return 1;
      },
      dtZoneServer() {
        //If the global variable is set by default.
        if (typeof ProcessMaker !== "undefined" && ProcessMaker.user && ProcessMaker.user.app_timezone) {
          return ProcessMaker.user.app_timezone;
        }
        if (this.zoneServer) {
          return this.zoneServer;
        }
        return 'UTC';
      },
      dtZoneClient() {
        //If the global variable is set by default.
        if (typeof ProcessMaker !== "undefined" && ProcessMaker.user && ProcessMaker.user.timezone) {
          return ProcessMaker.user.timezone;
        }
        if (this.zoneClient) {
          return this.zoneClient;
        }
        return 'local'
      },
      dtUse12Hour() {
        return this.use12Hour ? Boolean(this.use12Hour) : false;
      }
    },
    data() {
      return {
        content: null,
        validator: null
      };
    },
    watch: {
      value() {
        this.content = this.value;
      }
    },
    methods: {
      updateValue(newDate) {
        this.$emit("input", newDate);
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>