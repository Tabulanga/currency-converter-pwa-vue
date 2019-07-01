<template lang='pug'>
  div#app
    Converter(v-bind:currencyRates="rates")
</template>

<script>
import Converter from './components/Converter.vue';

export default {
  name: 'app',
  components: {
    Converter,
  },
  data() {
    return {
      dailyRatesUrl: 'https://www.cbr-xml-daily.ru/daily_json.js',
      rates: {}
    };
  },
  methods: {
    async fetchCurrencyRates(url) {
      const defaultCurrency = {
        'RUB': {
          'ID': 'R00000',
          'CharCode': 'RUB',
          'Nominal': 1,
          'Name': 'Российский рубль',
          'Value': 1,
        }
      };

      const json = await fetch(url)
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

    async loadCurrencyRates(url) {
      const dateUpdate = await this.$getItem('Date');
      this.rates = (!dateUpdate || !this.actuallyRates(dateUpdate)) 
        ? await this.fetchCurrencyRates(url)
        : await this.$getItem('Valute');
    },
  },
  created() {
    this.loadCurrencyRates(this.dailyRatesUrl);
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
