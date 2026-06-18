import os
from PIL import Image

def convert_to_webp(source_path, dest_path, quality=80):
    if os.path.exists(source_path):
        print(f"Compressing {source_path}...")
        img = Image.open(source_path)
        img.save(dest_path, "WEBP", quality=quality)
        orig_size = os.path.getsize(source_path)
        new_size = os.path.getsize(dest_path)
        print(f"Done! Saved to {dest_path}")
        print(f"Original size: {orig_size / (1024*1024):.2f} MB | Optimized size: {new_size / (1024*1024):.2f} MB ({100 - (new_size/orig_size)*100:.1f}% reduction)\n")
    else:
        print(f"Source not found: {source_path}")

if __name__ == "__main__":
    # Contact page images
    convert_to_webp("public/images/contact/tree.png", "public/images/contact/tree.webp")
    convert_to_webp("public/images/contact/grass.png", "public/images/contact/grass.webp")
    
    # About page images
    convert_to_webp("public/images/about/about_top.png", "public/images/about/about_top.webp")
