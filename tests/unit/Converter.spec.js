import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import Converter from '@/components/Converter.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('Converter.vue', () => {
  const currencyRates = {
    RUB: { Name: 'RUB', Value: 12, Nominal: 10 },
    USD: { Name: 'USD', Value: 62, Nominal: 100 },
  };
  const wrapper = shallowMount(Converter, {
    localVue,
    propsData: { currencyRates },
  });

  it('transmitted props.currencyRates when passed', () => {
    expect(wrapper.props().currencyRates).to.equal(currencyRates);
  });

  it('default currency name RUB and USD when passed', () => {
    expect(wrapper.vm.firstName).to.equal('RUB');
    expect(wrapper.vm.secondName).to.equal('USD');
  });

  it('fetch currency rates from props.currencyRates when passed', () => {
    expect(wrapper.vm.firstData).to.equal(currencyRates.RUB);
    expect(wrapper.vm.secondData).to.equal(currencyRates.USD);
  });

  it('convert currency when passed', () => {
    expect(wrapper.vm.convert(6, 'RUB', 'USD')).to.equal('11.61');
  });
});
