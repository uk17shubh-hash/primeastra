import os
import subprocess
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'outputs')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/process-video', methods=['POST'])
def process_video():
    task_id = str(uuid.uuid4())[:8]

    try:
        url = request.form.get('url')
        video_file = request.files.get('video')
        duration = request.form.get('duration', 'auto')
        aspect_ratio = request.form.get('aspectRatio', '9:16')

        if not url and not video_file:
            return jsonify({"success": False, "error": "URL ya file enter karein"}), 400

        # 1. Source Video lena
        if url:
            raw_video_path = os.path.join(UPLOAD_FOLDER, f"yt_{task_id}.mp4")
            dl_cmd = [
                "yt-dlp",
                "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
                "--merge-output-format", "mp4",
                "-o", raw_video_path,
                url
            ]
            res = subprocess.run(dl_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if res.returncode != 0:
                return jsonify({"success": False, "error": "YouTube download fail hua"}), 500
        elif video_file:
            raw_video_path = os.path.join(UPLOAD_FOLDER, f"upload_{task_id}.mp4")
            video_file.save(raw_video_path)

        output_filename = f"clip_{task_id}.mp4"
        output_clip_path = os.path.join(OUTPUT_FOLDER, output_filename)

        # 2. Timing aur Aspect ratio
        clip_time = "30" if duration == "auto" else ("15" if duration == "short" else "60")
        vf_filter = "crop=ih*(9/16):ih,scale=1080:1920" if aspect_ratio == "9:16" else "scale=1920:1080"

        # 3. FFmpeg se Crop & Cut
        ffmpeg_cmd = [
            "ffmpeg", "-y",
            "-ss", "00:00:05",
            "-i", raw_video_path,
            "-t", clip_time,
            "-vf", vf_filter,
            "-c:v", "libx264",
            "-preset", "fast",
            "-c:a", "aac",
            output_clip_path
        ]

        f_res = subprocess.run(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if f_res.returncode != 0:
            return jsonify({"success": False, "error": "FFmpeg processing fail hui"}), 500

        return jsonify({
            "success": True,
            "clipUrl": f"/download/{output_filename}"
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download_clip(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

if __name__ == '__main__':
    print("Server running on http://localhost:5000")
    app.run(port=5000, debug=True)