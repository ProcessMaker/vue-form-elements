<template>
    <div class="form-group">
        <label v-uni-for="name">{{label}}</label>
        <datetime
                v-on="$listeners"
                v-bind="$attrs"
                :type="type"
                :input-class="inputClass"
                :value-zone="valueZone"
                :zone="zone"
                :title="placeholder"
                :week-start="weekStart"
                :format="format"
                :phrases="parsedPhrases"
                :auto="auto"
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
  import {createUniqIdsMixin} from 'vue-uniq-ids';
  import ValidationMixin from './mixins/validation';
  import {Datetime} from 'vue-datetime';
  import 'vue-datetime/dist/vue-datetime.css'

  const uniqIdsMixin = createUniqIdsMixin();

  export default {
    inheritAttrs: false,
    mixins: [uniqIdsMixin, ValidationMixin],
    components: {
      datetime: Datetime
    },
    props: {
      name: String,
      placeholder: String,
      label: String,
      error: String,
      helper: String,
      type: {type: String, default: 'datetime'},
      inputClass: {type: [String, Array, Object], default: 'form-control'},
      valueZone: {
        type: String,
        default() {
          if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user && ProcessMaker.user.app_timezone) {
            return ProcessMaker.user.app_timezone;
          }

          return 'UTC';
        }
      },
      zone: {
        type: String,
        default() {
          if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user && ProcessMaker.user.timezone) {
            return ProcessMaker.user.timezone;
          }

          return 'local';
        }
      },
      weekStart: {type: Number, default: 7},
      format: {
        type: [String, Object],
        default() {
          if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user && ProcessMaker.user.calendar_format) {
            return ProcessMaker.user.calendar_format;
          }

          return {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          };
        }
      },
      phrases: {
        type: [String, Object],
        default() {
          return {ok: 'Continue', cancel: 'Exit'};
        }
      },
      auto: {type: Boolean, default: true},
    },
    computed: {
      parsedPhrases() {
        if (typeof this.phrases === 'string') {
          try {
            return JSON.parse(this.phrases)
          } catch (e) {
            // Ignore string, use default prop
          }
        }

        if (typeof this.phrases === "object") {
          try {
            return this.phrases;
          } catch (e) {
            // Ignore string, use default prop
          }
        }

        return {ok: 'Continue', cancel: 'Exit'};
      }
    }
  };
</script>
