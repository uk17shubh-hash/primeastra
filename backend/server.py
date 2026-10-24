import os
import subprocess
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = os.path.join(os.getcwd(), 'uploads')
OUTPUT_DIR = os.path.join(os.getcwd(), 'outputs')
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.route('/process-video', methods=['POST'])
def process():
    task_id = str(uuid.uuid4())[:8]
    url = request.form.get('url')
    file = request.files.get('video')

    raw_path = os.path.join(UPLOAD_DIR, f"raw_{task_id}.mp4")
    out_name = f"clip_{task_id}.mp4"
    out_path = os.path.join(OUTPUT_DIR, out_name)

    if url:
        # Download YouTube Video using yt-dlp
        cmd = ["yt-dlp", "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best", "-o", raw_path, url]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            return jsonify({"success": False, "error": "Download failed"}), 500
    elif file:
        file.save(raw_path)
    else:
        return jsonify({"success": False, "error": "No source"}), 400

    # Crop to 9:16 (1080x1920) and cut 30 seconds
    ffmpeg_cmd = [
        "ffmpeg", "-y", "-ss", "00:00:15", "-i", raw_path, "-t", "30",
        "-vf", "crop=ih*(9/16):ih,scale=1080:1920",
        "-c:v", "libx264", "-c:a", "aac", out_path
    ]
    subprocess.run(ffmpeg_cmd, check=True)

    return jsonify({"success": True, "clipUrl": f"/download/{out_name}"})

@app.route('/download/<filename>')
def download(filename):
    return send_from_directory(OUTPUT_DIR, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(port=5000)