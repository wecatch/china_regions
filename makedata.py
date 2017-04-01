# -*- coding:utf-8 -*-
import json
import codecs
from collections import OrderedDict


def main():
    source_file_list = [
        'area', 'area_object', 'city', 'city_object', 'province', 'province_object']
    for k in source_file_list:
        data = codecs.open('json/%s.json' % k, 'r', 'utf-8').read()
        js_data = 'let %s = ' % k + data + '\nexport {%s} ' % k
        out_js = codecs.open('js/%s.js' % k, 'w', 'utf-8')
        out_js.write(js_data)
        json_data = json.loads(data)
        mysql_data = ''
        if k == 'area':
            index = 0
            for p in sorted(json_data.keys()):
                for area in json_data[p]:
                    index += 1
                    mysql_data += "INSERT INTO area  VALUES ('%s', '%s', '%s', '%s');\n" % (index, area['name'], area['id'], p) # noqa

        if k == 'province':
            for index, i in enumerate(json_data):
                mysql_data += "INSERT INTO province VALUES ('%s', '%s', '%s');\n" % (index+1, i['name'], i['id']) # noqa

        if k == 'city':
            index = 0
            for p in sorted(json_data.keys()):
                for city in json_data[p]:
                    index += 1
                    mysql_data += "INSERT INTO city VALUES ('%s', '%s', '%s', '%s');\n" % (index, city['id'], city['name'], p) # noqa

        if k in ['province', 'city', 'area']:
            out_mysql = codecs.open('mysql/%s.sql' % k, 'w', 'utf-8')
            out_mysql.write(mysql_data)

            out_mysql = codecs.open('postgresql/%s.sql' % k, 'w', 'utf-8')
            out_mysql.write(mysql_data)


def pull_data():
    province_object_d = json.loads(
        codecs.open('json/province_object.json', 'r', 'utf-8').read())
    cdata = codecs.open('src/city.json', 'r', 'utf-8').read()
    c_json = json.loads(cdata)
    index = 0
    city_object_d = OrderedDict()
    city_d = OrderedDict()
    area_object_d = OrderedDict()
    area_d = OrderedDict()
    current_city = {}
    for c in c_json:
        if int(c['id']) % 100 == 0:
            index += 1
            obj = {
                "province": province_object_d[c['id'][0:2] + '0000']['name'],
                "name": c['name'],
                "id": c['id']
            }
            current_city = obj
            city_object_d[c['id']] = obj
            city_d.setdefault(c['id'][0:2] + '0000', []).append(obj)
            area_d.setdefault(c['id'], [])
            continue

        if int(c['id']) % 1000 == 0:
            continue

        area_obj = {
            "city": current_city['name'],
            "name": c['name'],
            "id": c['id']
        }
        area_object_d[c['id']] = area_obj
        area_d[current_city['id']].append(area_obj)

    out_city_object = codecs.open('json/city_object.json', 'w', 'utf-8')
    out_area_object = codecs.open('json/area_object.json', 'w', 'utf-8')
    out_city = codecs.open('json/city.json', 'w', 'utf-8')
    out_area = codecs.open('json/area.json', 'w', 'utf-8')
    out_city_object.write(json.dumps(city_object_d, ensure_ascii=False, indent=4))
    out_city.write(json.dumps(city_d, ensure_ascii=False, indent=4))
    out_area_object.write(json.dumps(area_object_d, ensure_ascii=False, indent=4))
    out_area.write(json.dumps(area_d, ensure_ascii=False, indent=4))


if __name__ == '__main__':
    pass
    # pull_data()
    # main()
