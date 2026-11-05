#!/bin/sh
# How much of a clip visibly moves: the share of pixels whose brightness ranges
# by more than 12 of 255 across frames sampled twice a second.
# usage: loop_motion.sh <video> <workdir>
set -e
v="$1"; w="$2"; rm -rf "$w"; mkdir -p "$w"
ffmpeg -v error -y -i "$v" -vf "fps=2,scale=480:-1,format=gray" "$w/f_%03d.png"
magick "$w"/f_*.png -evaluate-sequence max "$w/max.png"
magick "$w"/f_*.png -evaluate-sequence min "$w/min.png"
magick "$w/max.png" "$w/min.png" -compose difference -composite "$w/range.png"
pct=$(magick "$w/range.png" -threshold 4.706% -format "%[fx:mean*100]" info:)
peak=$(magick "$w/range.png" -format "%[fx:maxima*255]" info:)
echo "$(basename "$v"): $(ls "$w"/f_*.png | wc -l | tr -d ' ') frames, ${pct}% of pixels range over 12, peak range ${peak} of 255"
magick "$w/range.png" -auto-level "$w/range-map.png"
