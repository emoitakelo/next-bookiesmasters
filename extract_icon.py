
from PIL import Image
import numpy as np

def extract_icon():
    # Load current logo
    logo_path = r"c:\Users\Administrator\projects\bookiesmasters\public\logo.png"
    try:
        img = Image.open(logo_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Convert to numpy array
    data = np.array(img)
    
    # Get alpha channel
    alpha = data[..., 3]
    
    # Find columns that have visible pixels
    col_has_pixels = np.any(alpha > 0, axis=0)
    
    # Find the gap between icon and text
    # The icon is on the left. We expect a block of pixels, then a gap, then text.
    
    start_col = -1
    end_col = -1
    
    in_segment = False
    segments = [] # List of (start, end)
    
    for x in range(len(col_has_pixels)):
        if col_has_pixels[x]:
            if not in_segment:
                start_col = x
                in_segment = True
        else:
            if in_segment:
                end_col = x
                segments.append((start_col, end_col))
                in_segment = False
    
    if in_segment:
        segments.append((start_col, len(col_has_pixels)))
        
    print(f"Found segments (x ranges): {segments}")
    
    if not segments:
        print("No content found.")
        return

    # The icon should be the first segment (or the first cluster of segments if close)
    # The text is usually wide. The icon is usually roughly square-ish or at the start.
    # Given the previous logo, icon is distinct on the left.
    
    # Let's assume the first main segment is the icon. 
    # If the icon has internal vertical gaps, this might split it.
    # We can group segments that are close together.
    
    merged_segments = []
    if segments:
        current_start, current_end = segments[0]
        for i in range(1, len(segments)):
            next_start, next_end = segments[i]
            if next_start - current_end < 20: # Gap threshold (20px)
                current_end = next_end
            else:
                merged_segments.append((current_start, current_end))
                current_start, current_end = next_start, next_end
        merged_segments.append((current_start, current_end))
        
    print(f"Merged segments: {merged_segments}")
    
    if not merged_segments:
        return

    # The icon is the first merged segment
    icon_start, icon_end = merged_segments[0]
    
    # Crop the icon
    # We also need vertical bounds
    icon_region = alpha[:, icon_start:icon_end]
    row_has_pixels = np.any(icon_region > 0, axis=1)
    
    icon_top = np.argmax(row_has_pixels)
    # argmax finds first True. If none, returns 0. Check if it actually has pixels.
    if not np.any(row_has_pixels):
        return
        
    # Find last row
    # reverse array, find first True, subtract from len
    icon_bottom = len(row_has_pixels) - np.argmax(row_has_pixels[::-1])
    
    print(f"Cropping Icon: x={icon_start}-{icon_end}, y={icon_top}-{icon_bottom}")
    
    icon_img = img.crop((icon_start, icon_top, icon_end, icon_bottom))
    
    # Save standalone icon
    icon_out = r"c:\Users\Administrator\projects\bookiesmasters\public\bookiesmasters_icon_only.png"
    icon_img.save(icon_out)
    print(f"Saved icon to {icon_out}")
    
    # Create Square Social Version (Icon Centered on Black)
    canvas_size = 1080
    bg_color = (0, 0, 0, 255)
    canvas = Image.new("RGBA", (canvas_size, canvas_size), bg_color)
    
    # Resize icon if it's too small or too big for the square?
    # Usually we want it to fill about 50-60% of the canvas width
    target_width = int(canvas_size * 0.6)
    
    # Aspect ratio
    w, h = icon_img.size
    ratio = w / h
    
    # Determine new size
    if w > h:
        new_w = target_width
        new_h = int(new_w / ratio)
    else:
        new_h = target_width
        new_w = int(new_h * ratio)
        
    icon_resized = icon_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    x = (canvas_size - new_w) // 2
    y = (canvas_size - new_h) // 2
    
    canvas.paste(icon_resized, (x, y), icon_resized)
    
    social_out = r"c:\Users\Administrator\projects\bookiesmasters\public\bookiesmasters_social_icon_square.png"
    canvas.save(social_out)
    print(f"Saved social square icon to {social_out}")

extract_icon()
