#-*- coding:utf-8 -*-
import json
import codecs

def main():
    source_file_list = ['area','area_object','city','city_object','province','province_object']
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
                    mysql_data += "INSERT INTO area  VALUES ('%s', '%s', '%s', '%s');\n" % (index+1, area['name'], area['id'], p)

        if k == 'province':
            for index, i in enumerate(json_data):
                mysql_data += "INSERT INTO province VALUES ('%s', '%s', '%s');\n" % (index+1, i['name'], i['id'])

        if k == 'city':
            index = 0
            for p in sorted(json_data.keys()):
                for city in json_data[p]:
                    index += 1
                    mysql_data += "INSERT INTO city VALUES ('%s', '%s', '%s', '%s');\n" % (index+1, city['id'], city['name'], p)

        if k in ['province', 'city', 'area']:
            out_mysql = codecs.open('mysql/%s.sql' % k, 'w', 'utf-8')
            out_mysql.write(mysql_data)

            out_mysql = codecs.open('postgresql/%s.sql' % k, 'w', 'utf-8')
            out_mysql.write(mysql_data)



if __name__ == '__main__':
    main()
