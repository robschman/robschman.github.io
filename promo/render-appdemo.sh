#!/bin/bash
# App-Demo-Clips: echtes Screen-Recording, Hintergrund = unscharfe Version
# des App-Videos -> passt sich automatisch ans App-Theme an (Pink/Berry/Mono...).
# Text auf halbtransparenten Baendern (lesbar) + Abspann mit Link.
# Quelle wird beschleunigt (snappier). S1 = lebendige Abhak-Szene (scrollen+haken).
set -e
cd "$(dirname "$0")/.."
REC="ScreenRecording_06-17-2026 Beauty routine.MP4"
OUT="promo/output/app-demo"
mkdir -p "$OUT"

# Szene: ID  START  QUELL-DAUER  SPEED   (Ausgabedauer = QUELL-DAUER / SPEED)
SCENES=("S1 6 14 1.8" "S2 200 14 1.8" "S3 355 13 1.7")

scene () { # $1=ss $2=dur $3=speed $4=fg-png $5=out
  ffmpeg -y -ss "$1" -t "$2" -i "$REC" -loop 1 -i "$4" -filter_complex "\
    [0:v]setpts=PTS/$3,split=2[v0][v1];\
    [v0]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=24:3,eq=saturation=1.12[bg];\
    [v1]scale=636:-2,setsar=1[ph];\
    [bg][ph]overlay=222:300[m];\
    [m][1:v]overlay=0:0:shortest=1[v]" \
    -map "[v]" -an -r 30 -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart "$5" -loglevel error
}

outro () { # $1=png $2=out
  ffmpeg -y -loop 1 -t 3 -i "$1" \
    -vf "scale=1080:1920,setsar=1,fade=t=in:st=0:d=0.4,format=yuv420p" \
    -r 30 -c:v libx264 -pix_fmt yuv420p -crf 20 -t 3 -movflags +faststart "$2" -loglevel error
}

for V in A B; do
  for s in "${SCENES[@]}"; do
    set -- $s; SID=$1; SS=$2; DUR=$3; SPD=$4
    scene "$SS" "$DUR" "$SPD" "promo/_fg_${SID}_${V}.png" "$OUT/appdemo_${SID}_${V}.mp4"
    echo "  ✅ appdemo_${SID}_${V}.mp4"
  done
  outro "promo/_outro_${V}.png" "$OUT/_outro_${V}.mp4"
  echo "  ✅ outro_${V}"
  printf "file 'appdemo_S1_%s.mp4'\nfile 'appdemo_S2_%s.mp4'\nfile 'appdemo_S3_%s.mp4'\nfile '_outro_%s.mp4'\n" "$V" "$V" "$V" "$V" > "$OUT/_list_$V.txt"
  ffmpeg -y -f concat -safe 0 -i "$OUT/_list_$V.txt" -c copy "$OUT/reel_${V}.mp4" -loglevel error
  echo "  ✅ reel_${V}.mp4"
done

rm -f "$OUT"/_list_*.txt
echo "FERTIG"
for f in "$OUT"/reel_*.mp4; do d=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f"); echo "$(basename "$f") = ${d}s"; done
