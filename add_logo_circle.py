from PIL import Image, ImageDraw, ImageOps

def add_circle_to_logo(input_path, output_path, circle_color, border_width=20, padding=40):
    try:
        # Open the original logo
        img = Image.open(input_path).convert("RGBA")
        
        # Calculate new size
        # The circle needs to surround the image.
        # We'll create a new canvas larger than the image
        width, height = img.size
        identifier_dim = max(width, height)
        
        new_size = identifier_dim + (padding * 2) + (border_width * 2)
        
        # Create a new white background image
        new_img = Image.new("RGBA", (new_size, new_size), (255, 255, 255, 0))
        draw = ImageDraw.Draw(new_img)
        
        # Define circle bounding box
        # Centered in the new image
        # Inset slightly so the stroke doesn't get cut off
        margin = border_width / 2
        bbox = [margin, margin, new_size - margin, new_size - margin]
        
        # Draw the circle (Stroke only)
        # London Underground Red is roughly #E32017
        draw.ellipse(bbox, outline=circle_color, width=border_width)
        
        # Paste the original logo in the center
        # Center position
        x_pos = (new_size - width) // 2
        y_pos = (new_size - height) // 2
        
        # Paste
        new_img.paste(img, (x_pos, y_pos), img)
        
        # Save
        new_img.save(output_path)
        print(f"Successfully saved to {output_path}")

    except Exception as e:
        print(f"Error: {e}")

# Run for Red Circle
# London Underground Red: #E32017
add_circle_to_logo(
    "public/logo.png", 
    "public/client-logos/mind-the-job-logo-final-red.png", 
    "#E32017", 
    border_width=30, 
    padding=50
)

# Run for Blue Circle (Reference)
# London Underground Blue: #003688 (or Navy #111827)
# Let's use the provided 'Navy' color if possible, or standard Blue.
add_circle_to_logo(
    "public/logo.png", 
    "public/client-logos/mind-the-job-logo-final-blue.png", 
    "#111827", 
    border_width=30, 
    padding=50
)
