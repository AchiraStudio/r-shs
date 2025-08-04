import os
import json
import tkinter as tk
from tkinter import filedialog

# Supported image extensions
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

def is_image(filename):
    return os.path.splitext(filename.lower())[1] in IMAGE_EXTENSIONS

def build_event_data(folder_path, base_folder):
    folder_name = os.path.basename(folder_path)
    event_type = folder_name.split()[0].lower()

    gallery_images = []
    cover_image = None

    for root, _, files in os.walk(folder_path):
        for file in files:
            if is_image(file):
                rel_path = os.path.relpath(os.path.join(root, file), base_folder).replace("\\", "/")
                img_entry = {
                    "src": f"albums/{event_type}/{rel_path}",
                    "alt": os.path.splitext(file)[0].replace("_", " ").capitalize()
                }
                gallery_images.append(img_entry)
                if not cover_image:
                    cover_image = img_entry["src"]

    return {
        "eventType": event_type,
        "coverImage": cover_image or "",
        "title": f"{folder_name} Event",
        "subtitle": "Event Subtitle",
        "description": f"Our annual {folder_name.lower()} celebration.",
        "audioSrc": f"/path/to/{event_type}-music.mp3",
        "galleryImages": gallery_images
    }

def generate_events_json(root_dir):
    events = {}

    for folder in os.listdir(root_dir):
        folder_path = os.path.join(root_dir, folder)
        if os.path.isdir(folder_path):
            event_data = build_event_data(folder_path, root_dir)
            events[folder.lower()] = event_data

    return {"events": events}

if __name__ == "__main__":
    # Prompt user to select the base folder
    tk.Tk().withdraw()
    base_folder = filedialog.askdirectory(title="Select Album Base Folder")

    if not base_folder:
        print("No folder selected. Exiting.")
        exit()

    result = generate_events_json(base_folder)

    output_path = os.path.join(base_folder, "events.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"events.json created successfully at:\n{output_path}")
