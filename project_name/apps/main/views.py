# Create your views here.
from {{ project_name }}.settings import PROJECT_DIR
from django.shortcuts import render
from django.http import HttpResponse
from {{ project_name }}.apps.main.feeds import LatestEntriesFeed

import os
try:
    import simplejson as json
except ImportError:
    import json

class LazyEncoder(json.JSONEncoder):
    """Encodes django's lazy i18n strings.
    Used to serialize translated strings to JSON, because
    simplejson chokes on it otherwise.
    """
    def default(self, obj):
        if isinstance(obj, Promise):
            return force_unicode(obj)
        return obj

def http_response(json_dict={}):
    return HttpResponse(json.dumps(json_dict, cls=LazyEncoder), content_type="application/json")


class Pages:
    def __init__(self):
        self.base_url = "main/{0}.jade"

    def main(self, request, page_requested):
        return {}


def general(request, **kwargs):
    return render(request, "main/base_general.jade", {})


def render_page(request, page_requested):
    the_file = "main/{0}.jade".format(page_requested)
    if os.path.isfile(os.path.join(PROJECT_DIR, 'templates', the_file)):
        variables = dict()
        return render(request, the_file, variables)
    else:
        return render(request, "main/{0}.jade".format("coming_soon"), {})


def render_data(request, page_requested):
    pages = Pages()
    variables = dict()
    if page_requested in dir(pages):
        variables['aux_data'] = getattr(pages, page_requested)(request, page_requested)
        return http_response(variables)
    return http_response({
        "aux_data": variables
    })

