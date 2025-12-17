
from PIL import Image

def generate_sizes():
    # Load the standalone icon we extracted earlier
    icon_path = r"c:\Users\Administrator\projects\bookiesmasters\public\bookiesmasters_icon_only.png"
    try:
        icon = Image.open(icon_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening icon: {e}")
        return

    sizes = [192, 512] # Standard sizes
    
    for size in sizes:
        # Create square canvas
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 255)) # Black bg
        
        # Resize icon to fit well (e.g. 70% of canvas)
        target_dim = int(size * 0.7)
        
        # Calculate aspect ratio
        w, h = icon.size
        ratio = w / h
        
        if w > h:
            new_w = target_dim
            new_h = int(new_w / ratio)
        else:
            new_h = target_dim
            new_w = int(new_h * ratio)
            
        icon_resized = icon.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Center
        x = (size - new_w) // 2
        y = (size - new_h) // 2
        
        canvas.paste(icon_resized, (x, y), icon_resized)
        
        output_path = f"c:\\Users\\Administrator\\projects\\bookiesmasters\\public\\icon_{size}.png"
        canvas.save(output_path)
        print(f"Saved {output_path}")

if __name__ == "__main__":
    generate_sizes()
