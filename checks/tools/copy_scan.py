# Scan the built site's visible words for brand-banned vocabulary, hype, AI tells,
# em dashes, exclamation marks and American spelling.
# Verbatim material is skipped: Amelia's posts, the legal page, clinic quotes and clinic details.
import sys, os, re
from html.parser import HTMLParser

dist = sys.argv[1]
SKIP_PAGES = ('pelvy-launch-party-perth-wa', 'queensland-health-pilot', 'privacy-policy')
SKIP_CLASSES = ('clinic__quote', 'clinic__more', 'clinic__tags', 'clinic__head', 'said__item', 'said__row')

class T(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip = 0; self.stack = []; self.out = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = a.get('class') or ''
        hide = tag in ('script', 'style', 'svg', 'template') or any(c in cls.split() for c in SKIP_CLASSES)
        if tag not in ('br', 'img', 'input', 'meta', 'link', 'source', 'hr'):
            self.stack.append((tag, hide))
            if hide: self.skip += 1
        for k in ('alt', 'aria-label', 'content', 'title', 'placeholder'):
            if a.get(k) and not self.skip and not (tag == 'meta' and a.get('property', '').startswith('og:url')):
                if tag != 'meta' or a.get('name') == 'description' or a.get('property') in ('og:title', 'og:description'):
                    self.out.append(a[k])
    def handle_endtag(self, tag):
        while self.stack:
            t, hide = self.stack.pop()
            if hide: self.skip -= 1
            if t == tag: break
    def handle_data(self, d):
        if not self.skip and d.strip(): self.out.append(d.strip())

BANNED = r"\b(journey|empower\w*|mega app|the only app|treat(s|ed|ing)?|cure[sd]?|diagnos\w+|optimi[sz]\w+|elevat\w+|down there|general users?|simply|miss a beat|wellness|fix(es|ed)?)\b"
HYPE = r"\b(seamless\w*|robust|powerful|comprehensive|effortless\w*|revolutionary|transformative|leverag\w+|utili[sz]\w+|facilitat\w+|ecosystem|holistic|delve|crucial|pivotal|showcas\w+|underscor\w+|tapestry|testament|vibrant|additionally|moreover|furthermore|unlock\w*|supercharg\w+|game-chang\w+|cutting-edge|just|easily|obviously|of course|in order to|it is worth|not only)\b"
US = r"\b(color|center|behavior|analyze|program(me)?s?\b(?!)|[a-z]{4,}(ize|izes|ized|izing|ization))\b"
ALLOW = {'treat': ['treatment hub', 'My treatment hub', 'Treatment hub'], 'size': [], }

total = 0
for root, _, files in os.walk(dist):
    for f in sorted(files):
        if not f.endswith('.html'): continue
        path = os.path.join(root, f); url = '/' + os.path.relpath(path, dist).replace('index.html', '')
        if any(s in url for s in SKIP_PAGES): continue
        p = T(); p.feed(open(path, encoding='utf-8').read())
        for chunk in p.out:
            hits = []
            for name, pat in (('banned', BANNED), ('hype or filler', HYPE), ('American spelling', US)):
                for m in re.finditer(pat, chunk, flags=re.I):
                    w = m.group(0)
                    if name == 'banned' and w.lower().startswith('treat') and 'treatment hub' in chunk.lower(): continue
                    if w.lower() in ('size', 'prize', 'seize', 'capsize'): continue
                    hits.append(f'{name}: "{w}"')
            if '—' in chunk: hits.append('em dash')
            if '!' in chunk: hits.append('exclamation mark')
            if re.search(r'[A-Z]{4,}', chunk) and not re.search(r'\b(QLD|NSW|TENS|PPFA|QENDO|HEP|PFMT|ISO|HIPAA|APA|FAQ|PDF|GPs?|TGA|AHPRA|AUD|WA|SA|NT|VIC|ACT|TAS|JSON|HTML|CSS|URL|QR)\b', chunk): hits.append('capitals: ' + re.search(r'[A-Z]{4,}', chunk).group(0))
            if hits:
                total += 1
                print(f'{url}: {"; ".join(sorted(set(hits)))}\n    {chunk[:150]}')
print(f'\n{total} lines flagged')
