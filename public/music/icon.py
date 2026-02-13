from mutagen import File
from PIL import Image
import io
import os

SUPPORTED_EXT = (".mp3", ".flac", ".m4a", ".ogg", ".wav")
output_file = "icon.png"

music_files = [f for f in os.listdir(".") if f.lower().endswith(SUPPORTED_EXT)]

if not music_files:
    print("❌ 当前文件夹没有找到音乐文件")
    exit()

image_data = None

for music_file in music_files:
    try:
        audio = File(music_file)
        if not audio:
            continue

        # MP3
        if audio.tags:
            for tag in audio.tags.values():
                if tag.__class__.__name__ == "APIC":
                    image_data = tag.data
                    break

        # FLAC
        if image_data is None and hasattr(audio, "pictures") and audio.pictures:
            image_data = audio.pictures[0].data

        # M4A
        if image_data is None and "covr" in audio:
            image_data = audio["covr"][0]

        if image_data:
            img = Image.open(io.BytesIO(image_data))
            img.save(output_file)
            print(f"✅ 从 {music_file} 提取封面成功 → icon.png")
            break

    except Exception as e:
        print(f"⚠️ 跳过 {music_file}: {e}")

if not image_data:
    print("❌ 所有音乐都没有内嵌封面")