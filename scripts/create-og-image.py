#!/usr/bin/env python3
"""
Generate a proper Open Graph image (1200x630) for TableMaster.
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Dimensions
WIDTH = 1200
HEIGHT = 630

# Colors
PRIMARY = (0, 102, 255)  # #0066FF
PRIMARY_DARK = (0, 68, 204)  # #0044CC
WHITE = (255, 255, 255)
GRAY = (245, 245, 245)  # #FAFAFA

# Create image with gradient
def create_gradient(width, height, color1, color2):
    """Create a vertical gradient background."""
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        mask_data.extend([int(255 * (y / height))] * width)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

# Try to load a nice font, fallback to default
def get_font(size):
    font_paths = [
        '/System/Library/Fonts/Helvetica.ttc',
        '/System/Library/Fonts/Arial.ttf',
        '/Library/Fonts/Arial.ttf',
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except:
                continue
    # Fallback to default font
    return ImageFont.load_default()

def main():
    # Create gradient background
    image = create_gradient(WIDTH, HEIGHT, PRIMARY, PRIMARY_DARK)
    draw = ImageDraw.Draw(image)
    
    # Add a subtle grid pattern
    for x in range(0, WIDTH, 40):
        draw.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 20), width=1)
    for y in range(0, HEIGHT, 40):
        draw.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 20), width=1)
    
    # Load fonts
    font_large = get_font(72)
    font_medium = get_font(36)
    font_small = get_font(28)
    
    # Main text
    main_text = "TableMaster"
    # Calculate text size (approximate)
    text_bbox = draw.textbbox((0, 0), main_text, font=font_large)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (WIDTH - text_width) // 2
    text_y = (HEIGHT - text_height) // 2 - 60
    
    draw.text((text_x, text_y), main_text, fill=WHITE, font=font_large, stroke_width=1, stroke_fill=PRIMARY_DARK)
    
    # Subtitle
    subtitle = "Système de réservation sans commission"
    sub_bbox = draw.textbbox((0, 0), subtitle, font=font_medium)
    sub_width = sub_bbox[2] - sub_bbox[0]
    sub_x = (WIDTH - sub_width) // 2
    sub_y = text_y + text_height + 20
    draw.text((sub_x, sub_y), subtitle, fill=WHITE, font=font_medium)
    
    # Pricing line
    pricing = "À partir de 39€/mois · 400 réservations incluses"
    price_bbox = draw.textbbox((0, 0), pricing, font=font_small)
    price_width = price_bbox[2] - price_bbox[0]
    price_x = (WIDTH - price_width) // 2
    price_y = sub_y + 80
    draw.text((price_x, price_y), pricing, fill=GRAY, font=font_small)
    
    # Add logo placeholder (small rectangle)
    logo_size = 80
    logo_x = WIDTH - logo_size - 40
    logo_y = 40
    draw.rectangle([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], 
                   fill=WHITE, outline=PRIMARY_DARK, width=3)
    # Draw a simple "TM" inside logo
    tm_text = "TM"
    tm_bbox = draw.textbbox((0, 0), tm_text, font=font_medium)
    tm_width = tm_bbox[2] - tm_bbox[0]
    tm_height = tm_bbox[3] - tm_bbox[1]
    tm_x = logo_x + (logo_size - tm_width) // 2
    tm_y = logo_y + (logo_size - tm_height) // 2
    draw.text((tm_x, tm_y), tm_text, fill=PRIMARY, font=font_medium)
    
    # Save image
    output_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'og-image.png')
    image.save(output_path, 'PNG')
    print(f"✅ Open Graph image generated: {output_path} ({WIDTH}x{HEIGHT})")

if __name__ == '__main__':
    main()