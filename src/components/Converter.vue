<template lang='pug'>
  div.converter
    img(alt="Vue logo" src="../assets/logo.png")
    h1 Конвертер валют
    b-input-group(size="lg")
      b-form-input(type="number" min="0" v-model.number="firstQty" @focus="onFocusFirst")
      b-form-select(v-model="firstName")
        option(v-for="currency in currencyRates" v-bind:value="currency.CharCode")
          | {{ currency.CharCode }} - {{currency.Name}}
    br
    b-input-group(size="lg")
      b-form-input(type="number" min="0" v-model.number="secondQty" @focus="onFocusSecond")
      b-form-select(v-model="secondName")
        option(v-for="currency in currencyRates" v-bind:value="currency.CharCode")
          | {{ currency.CharCode }} - {{currency.Name}}
    br
</template>

<script>
export default {
  name: 'Converter',
  props: {
    currencyRates: Object,
  },
  data() {
    return {
      firstName: 'RUB',
      secondName: 'USD',
      firstQty: 0,
      secondQty: 0,
      priorityFirst: true,
    };
  },
  computed: {
    currencyList() {
      return this.$_.keys(this.currencyRates);
    },
    firstData() {
      return this.currencyRates[this.firstName];
    },
    secondData() {
      return this.currencyRates[this.secondName];
    },
  },
  watch: {
    firstQty: function (val) {
      if (this.priorityFirst) {
        this.secondQty = this.convert(val, this.firstName, this.secondName);
      }
    },
    secondQty: function (val) {
      if (!this.priorityFirst) {
        this.firstQty = this.convert(val, this.secondName, this.firstName);
      }
    },
    firstName: function (newName) {
      this.secondQty = this.convert(this.firstQty, newName, this.secondName);
    },
    secondName: function (newName) {
      this.secondQty = this.convert(this.firstQty, this.firstName, newName);
    },
  },
  methods: {
    onFocusFirst() {
      this.priorityFirst = true;
    },
    onFocusSecond() {
      this.priorityFirst = false;
    },
    convert(qty, nameIn, nameOut) {
      const curIn = this.currencyRates[nameIn];
      const curOut = this.currencyRates[nameOut];
      const currencyRatio = (curIn.Value / curIn.Nominal) / (curOut.Value / curOut.Nominal);
      return (qty * currencyRatio).toFixed(2);
    },
  },
};
</script>

<style scoped>
</style>
