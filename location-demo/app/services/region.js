import Ember from 'ember';
import { country } from '../regions/country';
import { province } from '../regions/province';
import { city } from '../regions/city';

import { country_object } from '../regions/country_object';
import { province_object } from '../regions/province_object';
import { city_object } from '../regions/city_object';

export default Ember.Service.extend({
    provinceOptions: province,
    cityOptions: city,
    areaOptions: country,
    getCity(provinceId){
        return provinceId ? city[provinceId] : []
    },
    getArea(cityId){
        return cityId ? country[cityId] : [];
    },
    getProvinceObject(id){
        return province_object[id] || '';
    },
    getCityObject(id){
        return city_object[id] || '';
    },
    getAreaObject(id){
        return country_object[id] || '';
    },
});
