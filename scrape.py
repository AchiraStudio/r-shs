import requests
import json
import os

# --- CONFIGURATION ---
GITHUB_USERNAME = "AchiraStudio"
REPO = "Gallery"
BRANCH = "main"
ALBUMS_FOLDER = "albums"
OUTPUT_FILE = "events.json"

# --- HELPERS ---
def get_github_api_files(path):
    url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{REPO}/contents/{path}?ref={BRANCH}"
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch {url}: {response.status_code}")
    return response.json()

def is_image_or_audio(filename):
    return filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp3'))

def build_event_json(folder_name, files):
    event_name = folder_name
    gallery_images = []
    audio_src = None
    cover_image = None

    for f in files:
        filename = f["name"]
        if not is_image_or_audio(filename):
            continue

        github_pages_url = f"https://{GITHUB_USERNAME}.github.io/{REPO}/{ALBUMS_FOLDER}/{event_name}/{filename}"

        if filename.lower().endswith('.mp3'):
            audio_src = github_pages_url
        elif filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')):
            if not cover_image:
                cover_image = github_pages_url
            gallery_images.append({
                "src": github_pages_url,
                "alt": os.path.splitext(filename)[0].capitalize()
            })

    return {
        event_name: {
            "eventType": event_name,
            "coverImage": cover_image,
            "title": event_name.replace("-", " ").title(),
            "subtitle": "Event Celebration",
            "description": f"Our annual {event_name.replace('-', ' ')} event filled with joy.",
            "audioSrc": audio_src,
            "galleryImages": gallery_images
        }
    }

# --- MAIN ---
def main():
    events = {}

    # Step 1: Get all subfolders under /albums
    album_folders = get_github_api_files(ALBUMS_FOLDER)

    for item in album_folders:
        if item["type"] != "dir":
            continue

        folder_name = item["name"]
        print(f"📂 Processing event folder: {folder_name}")

        try:
            files = get_github_api_files(f"{ALBUMS_FOLDER}/{folder_name}")
            event_json = build_event_json(folder_name, files)
            events.update(event_json)
        except Exception as e:
            print(f"❌ Failed to process {folder_name}: {e}")

    # Step 2: Write JSON file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump({"events": events}, f, indent=2)
    print(f"\n✅ Done! Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
