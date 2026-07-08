#!/bin/bash
# Baut 3 CozyVibe-Promo-Varianten (A/B/C): Intro + 4 Szenen (App im Handy) + Outro.
cd "$(dirname "$0")" || exit 1
V_REC="../ScreenRecording_06-17-2026 Beauty routine.MP4"
INTRO="output/test/test1_pink_routine.mp4"
SX=313; SY=425; SW=454; SH=1014   # App-Screen-Bereich im iPhone-Mockup

mkbg() { # variant scene out
  local g
  case "$1-$2" in
    A-*)       g="c0=0xFBF6F0:c1=0xEAC9A0" ;;
    C-*)       g="c0=0xFFFFFF:c1=0xFADCE9" ;;
    B-routine) g="c0=0xF8BBD0:c1=0xF06292" ;;
    B-themes)  g="c0=0xC77DFF:c1=0xFF9A56" ;;
    B-rainbow) g="c0=0xFF6B9D:c1=0x5EA8FF" ;;
    B-termine) g="c0=0xEAC9A0:c1=0xEF9320" ;;
    B-*)       g="c0=0xF8BBD0:c1=0xF06292" ;;
  esac
  ffmpeg -y -f lavfi -i "gradients=s=1080x1920:${g}:d=4:r=30" -frames:v 1 "$3" 2>/dev/null
}

scene_seg() { # variant scene rec_time dur out
  mkbg "$1" "$2" "_tmp_bg_$1.png"
  ffmpeg -y -loop 1 -t "$4" -i "_tmp_bg_$1.png" -ss "$3" -t "$4" -i "$V_REC" -loop 1 -i "_cf_$1_$2.png" \
    -filter_complex "[1]scale=${SW}:${SH}:force_original_aspect_ratio=increase,crop=${SW}:${SH}[app];[0][app]overlay=${SX}:${SY}[bg];[bg][2]overlay=0:0[v]" \
    -map "[v]" -t "$4" -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 "$5" 2>/dev/null
}

build_variant() {
  local var=$1
  ffmpeg -y -i "$INTRO" -loop 1 -i "_cf_${var}_intro.png" \
    -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v0];[1:v]fade=t=in:st=0:d=0.3:alpha=1[ov];[v0][ov]overlay=0:0[v]" \
    -map "[v]" -t 4 -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 "_seg_${var}_1.mp4" 2>/dev/null
  scene_seg "$var" routine 10  4 "_seg_${var}_2.mp4"
  scene_seg "$var" themes  126 3 "_seg_${var}_3.mp4"
  scene_seg "$var" rainbow 206 4 "_seg_${var}_4.mp4"
  scene_seg "$var" termine 313 4 "_seg_${var}_5.mp4"
  mkbg "$var" outro "_tmp_bg_${var}.png"
  ffmpeg -y -loop 1 -t 3.5 -i "_tmp_bg_${var}.png" -loop 1 -i "_cf_${var}_outro.png" \
    -filter_complex "[1:v]fade=t=in:st=0:d=0.3:alpha=1[ov];[0:v][ov]overlay=0:0[v]" \
    -map "[v]" -t 3.5 -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 "_seg_${var}_6.mp4" 2>/dev/null
  printf "file '_seg_%s_1.mp4'\nfile '_seg_%s_2.mp4'\nfile '_seg_%s_3.mp4'\nfile '_seg_%s_4.mp4'\nfile '_seg_%s_5.mp4'\nfile '_seg_%s_6.mp4'\n" "$var" "$var" "$var" "$var" "$var" "$var" > "_list_${var}.txt"
  ffmpeg -y -f concat -safe 0 -i "_list_${var}.txt" -c:v libx264 -crf 20 -pix_fmt yuv420p -r 30 "output/styles/promo_cozy_${var}.mp4" 2>/dev/null
  echo "  DONE promo_cozy_${var}.mp4 ($(ffprobe -v error -show_entries format=duration -of csv=p=0 output/styles/promo_cozy_${var}.mp4 2>/dev/null)s)"
}

for V in ${@:-A B C}; do echo "Baue Variante $V..."; build_variant "$V"; done
echo "ALLE FERTIG"
