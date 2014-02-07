import re
from django.core import signing

def myurl( request ):
    re_domain = re.compile(r"(\w+\.)?([\w-]+)(\.(com|ir))?(:\d+)?")
    the_url = re_domain.findall(request.META['HTTP_HOST'])[:1][0][1]
    return { 'myurlx': the_url }