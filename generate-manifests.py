#!/usr/bin/env python3
"""
generate-manifests.py
Runs at Netlify build time (or locally).
Scans each _data/{category}/ folder and writes a manifest.json listing all .yml files.
The frontend fetches this manifest to know which product files to load.
"""

import os
import json

BASE = '_data'
categories = [
    'blades', 'knives', 'brushes', 'tapes', 'magnifiers',
    'pins', 'pens', 'sandpaper', 'cleanroom', 'cleaning',
    'gauges', 'misc'
]

for cat in categories:
    folder = os.path.join(BASE, cat)
    if not os.path.isdir(folder):
        continue
    files = sorted([f for f in os.listdir(folder) if f.endswith('.yml')])
    manifest_path = os.path.join(folder, 'manifest.json')
    with open(manifest_path, 'w') as f:
        json.dump(files, f, indent=2)
    print(f"  {cat}: {len(files)} files → manifest.json")

print("\nManifests generated.")
