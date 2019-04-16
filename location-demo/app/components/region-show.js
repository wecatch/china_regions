import { computed, observer, getWithDefault } from '@ember/object';
import Component from '@ember/component';
import { inject } from '@ember/service';
import EmberObject from '@ember/object';

export default Component.extend({
    actions: {
        resetSearch(){
            this.searchOptions.setProperties({
                province_id: '',
                city_id: '',
                area_id: '',
            });
        }
    },
    region: inject(),
    provinceOptions: computed.alias('region.provinceOptions'),
    province: computed('searchOptions.province_id', {
        get(){
            let id = getWithDefault(this, 'searchOptions.province_id', '')
            return this.get('region').getProvinceObject(id);
        }
    }),
    city: computed('searchOptions.city_id', {
        get(){
            let id = getWithDefault(this, 'searchOptions.city_id', '')
            return this.get('region').getCityObject(id);
        }
    }),
    area: computed('searchOptions.area_id', {
        get(){
            let id = getWithDefault(this, 'searchOptions.area_id', '')
            return this.get('region').getAreaObject(id);
        }
    }),
    cityOptions: null,
    areaOptions: null,
    provinceChange: observer('searchOptions.province_id', function() {
        let provinceId = this.get('searchOptions.province_id')
        this.set('cityOptions', this.get('region').getCity(provinceId));
        this.set('areaOptions', []);
        this.get('searchOptions').setProperties({
            city_id: '',
            area_id: '',
        });
    }),
    cityChange: observer('searchOptions.city_id', function() {
        let cityId = this.get('searchOptions.city_id');
        this.set('areaOptions', this.get('region').getArea(cityId));
        this.get('searchOptions').setProperties({
            area_id: '',
        });
    }),
    initRegion(){
        let provinceId = this.get('searchOptions.province_id')
        this.set('cityOptions', this.get('region').getCity(provinceId));
        
        let cityId = this.get('searchOptions.city_id');
        this.set('areaOptions', this.get('region').getArea(cityId));
    },
    init(){
        this._super(...arguments);
        this.initRegion();
        this.set('cityOptions', []);
        this.set('areaOptions', []);
        this.set('searchOptions', EmberObject.create({
            province_id: '',
            city_id: '',
            area_id: '',
            tag: '',
        }));
    }
});
