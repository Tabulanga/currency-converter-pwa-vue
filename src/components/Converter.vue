<template lang='pug'>
  .converter
    h1 Конвертер валют
    div
      input(type="text" min="0" v-model.number="firstQty" @focus="onFocusFirst")
      select(v-model="firstName")
        option(v-for="currency in currencyRates" v-bind:value="currency.CharCode") 
          | {{ currency.CharCode }} - {{currency.Name}}
    div
      input(type="text" v-model="secondQty" @focus="onFocusSecond")
      select(v-model="secondName")
        option(v-for="currency in currencyRates" v-bind:value="currency.CharCode") 
          | {{ currency.CharCode }} - {{currency.Name}} 
</template>

<script>
export default {
  name: 'Converter',
  data() {
    return {
      dailyRatesUrl: 'https://www.cbr-xml-daily.ru/daily_json.js',
      currencyRates: {},
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
    }
  },
  methods: {
    onFocusFirst() {
      this.priorityFirst = true
    },
    onFocusSecond() {
      this.priorityFirst = false
    },
    convert (qty, nameIn, nameOut) {
      const curIn = this.currencyRates[nameIn];
      const curOut = this.currencyRates[nameOut];
      const currencyRatio = (curIn.Value / curIn.Nominal) / (curOut.Value / curOut.Nominal);
      return (qty * currencyRatio).toFixed(2);
    },

    async fetchCurrencyRates() {
      const defaultCurrency = {
        'RUB': {
          'ID': 'R00000',
          'CharCode': 'RUB',
          'Nominal': 1,
          'Name': 'Российский рубль',
          'Value': 1,
        }
      };

      const json = await fetch(this.dailyRatesUrl)
        .then(responce => responce.json())
        .catch((err) => {
          console.error(err);
        });

      const data = defaultCurrency;
      this.$_.extend(data, json.Valute);

      this.$setItem('Date', json.Date);
      this.$setItem('Valute', data);

      return data;
    },

    actuallyRates(date) {
      const now = this.$moment();
      const duration = this.$moment
        .duration(now.diff(date))
        .asHours();
      
      return (duration > 24) ? false : true;
    },

    async loadCurrencyRates() {
      const dateUpdate = await this.$getItem('Date');
      this.currencyRates = (!dateUpdate || !this.actuallyRates(dateUpdate)) 
        ? await this.fetchCurrencyRates()
        : await this.$getItem('Valute');
    },
  },
  mounted() {
    this.loadCurrencyRates();
  },
};
</script>

<style scoped>
</style>
