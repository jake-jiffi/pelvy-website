#!/bin/sh
# Rebuild the site and run every check against it. Results go to checks/results/.
# Needs two previews running first, from the site folder:
#   npm run dev -- --port 4322       (the forms check uses the dev server)
#   npm run preview -- --port 4330   (everything else uses the built site)
C=$(cd "$(dirname "$0")" && pwd)
W=$(dirname "$C")
E=$C/results
PROD=${PROD:-http://127.0.0.1:4330}
mkdir -p "$E"
cd "$W" || exit 1
npm run build > "$E/build.log" 2>&1; echo "build exit $?"
curl -s -o /dev/null -w "built site preview %{http_code}\n" $PROD/
cd "$C" || exit 1
node behaviours.mjs $PROD > "$E/behaviours.txt" 2>&1; echo "behaviours: $(grep -c '^PASS' "$E/behaviours.txt") pass, $(grep -c '^FAIL' "$E/behaviours.txt") fail, $(grep 'console/page errors' "$E/behaviours.txt")"
node forms.mjs > "$E/forms.txt" 2>&1; echo "forms: $(grep -c '^PASS' "$E/forms.txt") pass, $(grep -c '^FAIL' "$E/forms.txt") fail"
node journeys.mjs $PROD "$E/journeys" > "$E/journeys.txt" 2>&1; echo "journeys exit $?: $(grep 'steps passed' "$E/journeys.txt")"
node webkit.mjs $PROD "$E/webkit" > "$E/webkit.txt" 2>&1; echo "webkit: $(grep -c '^PASS' "$E/webkit.txt") pass, $(grep -c '^FAIL' "$E/webkit.txt") fail, $(grep '^errors' "$E/webkit.txt")"
node r2hero.mjs $PROD "$E/hero" > "$E/hero-criteria.txt" 2>&1; echo "hero criteria: $(grep -c '^PASS' "$E/hero-criteria.txt") pass, $(grep -c '^FAIL' "$E/hero-criteria.txt") fail"
python3 "$C/tools/audit_dist.py" "$W/dist" > "$E/seo-audit.txt" 2>&1; echo "seo: $(grep '^PROBLEMS' "$E/seo-audit.txt")"
python3 "$C/tools/copy_scan.py" "$W/dist" > "$E/copy-scan.txt" 2>&1; echo "copy: $(tail -1 "$E/copy-scan.txt")"
node cls.mjs $PROD > "$E/cls.json" 2>&1; echo "layout shift record: $E/cls.json"
node perf.mjs $PROD > "$E/perf.txt" 2>&1; cut -c1-150 "$E/perf.txt"
