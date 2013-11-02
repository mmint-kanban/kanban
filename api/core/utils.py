# coding=utf-8
import re
from werkzeug.datastructures import ImmutableMultiDict

def request_data_to_dict(data):
    """ Transform request data to dict with 2 level of depth
        Ex:
         jsonData = {
            process: 1,
            ticket: {
                id: 1,
                name: 'test'
            }
         }
    """
    if not isinstance(data, ImmutableMultiDict):
        raise ValueError('Input must be ImmutableMultiDict type.')

    res = {}
    for (key, value) in data.to_dict().items():
        matches = re.match('(.*)\[(.*)\]', key)
        if matches:
            (key_lv_1, key_lv_2) = matches.groups()
            if key_lv_1 not in res:
                res[key_lv_1] = {}
            res[key_lv_1][key_lv_2] = value
        else:
            res[key] = value
    return res