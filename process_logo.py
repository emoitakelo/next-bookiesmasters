
from PIL import Image
import numpy as np

def process_logo(input_path, output_path):
    print(f"Opening {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Define black threshold (adjust if needed, but solid black is 0,0,0)
    threshold = 30
    
    # Find black pixels: R, G, B are all < threshold
    r, g, b, a = data.T
    black_areas = (r < threshold) & (g < threshold) & (b < threshold)
    
    # Set Alpha to 0 for black pixels
    data[..., 3][black_areas.T] = 0
    
    # Convert back to image
    img_transparent = Image.fromarray(data)
    
    # Crop to bounding box (removes empty space)
    bbox = img_transparent.getbbox()
    if bbox:
        print(f"Cropping to {bbox}")
        img_cropped = img_transparent.crop(bbox)
        img_cropped.save(output_path)
        print(f"Saved to {output_path}")
    else:
        print("Error: Image seems to be fully transparent/empty after processing")

if __name__ == "__main__":
    # Source is the generated file from previous step
    source = r"C:\Users\Administrator\.gemini\antigravity\brain\49ff53f7-3859-4709-b93f-708934a72484\bookiesmasters_sofascore_style_1765951689008.png"
    dest = r"c:\Users\Administrator\projects\bookiesmasters\public\logo.png"
    try:
        process_logo(source, dest)
    except Exception as e:
        print(f"Error: {e}")
