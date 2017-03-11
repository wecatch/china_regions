import Ember from 'ember';
import { area } from '../regions/area';
import { province } from '../regions/province';
import { city } from '../regions/city';

import { area_object } from '../regions/area_object';
import { province_object } from '../regions/province_object';
import { city_object } from '../regions/city_object';

export default Ember.Service.extend({
    provinceOptions: province,
    cityOptions: city,
    areaOptions: area,
    getCity(provinceId){
        return provinceId ? city[provinceId] : []
    },
    getArea(cityId){
        return cityId ? area[cityId] : [];
    },
    getProvinceObject(id){
        return province_object[id] || '';
    },
    getCityObject(id){
        return city_object[id] || '';
    },
    getAreaObject(id){
        return area_object[id] || '';
    },
});
