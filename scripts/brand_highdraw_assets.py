import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_woven_label(width=160, height=48, dark=False, is_macro=False):
    bg_color = (20, 26, 34) if dark else (248, 249, 250)
    border_color = (45, 55, 70) if dark else (205, 212, 218)
    text_color = (255, 255, 255) if dark else (18, 24, 30)
    sub_color = (125, 211, 252) if dark else (90, 100, 110)
    
    label = Image.new("RGBA", (width, height), bg_color + (255,))
    draw = ImageDraw.Draw(label)
    
    # Outer stitch border
    draw.rectangle([1, 1, width-2, height-2], outline=border_color, width=1)
    draw.rectangle([3, 3, width-4, height-4], outline=border_color, width=1)
    
    # Load tracer icon
    tracer_file = "public/assets/logo_tracer_cyan.png" if dark else "public/assets/logo_tracer_black.png"
    if os.path.exists(tracer_file):
        tracer = Image.open(tracer_file).convert("RGBA")
        tracer_h = height - 14
        tracer_w = int(tracer.width * (tracer_h / tracer.height))
        tracer = tracer.resize((tracer_w, tracer_h), Image.Resampling.LANCZOS)
        label.paste(tracer, (8, 7), tracer)
    else:
        tracer_w = 0
    
    font_large = None
    font_small = None
    for font_path in [
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
        "/System/Library/Fonts/Times.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
    ]:
        if os.path.exists(font_path):
            try:
                scale = 1.4 if is_macro else 1.0
                font_large = ImageFont.truetype(font_path, int(13 * scale))
                font_small = ImageFont.truetype(font_path, int(7.5 * scale))
                break
            except Exception:
                pass
                
    if not font_large:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        
    text_x = 10 + tracer_w + 8
    draw.text((text_x, int(8 * (1.3 if is_macro else 1.0))), "HIGH DRAW", fill=text_color, font=font_large)
    draw.text((text_x, int(26 * (1.3 if is_macro else 1.0))), "TOUR PERFORMANCE • L", fill=sub_color, font=font_small)
    
    return label

# 1. Brand polo_cypress_green.jpg
print("Processing polo_cypress_green.jpg...")
im_cypress = Image.open("public/assets/polo_cypress_green.jpg").convert("RGBA")

# Place High Draw Woven Neck Label
label_cypress = create_woven_label(width=140, height=44, dark=False)
im_cypress.paste(label_cypress, (510, 142), label_cypress)

# Cover previous crown logo and add High Draw Tracer Mark on chest
# Sample surrounding fabric color around x: 800, y: 545
draw_c = ImageDraw.Draw(im_cypress)
# Smooth blend over old chest logo
draw_c.ellipse([765, 520, 835, 580], fill=(42, 66, 54, 255))
# Soft blur the patch area slightly to match fabric weave
box = (750, 510, 850, 590)
patch = im_cypress.crop(box).filter(ImageFilter.GaussianBlur(1.0))
im_cypress.paste(patch, box)

# Add genuine High Draw cyan/tone tracer mark on chest
tracer_white = Image.open("public/assets/logo_tracer_white.png").convert("RGBA")
th = 55
tw = int(tracer_white.width * (th / tracer_white.height))
tracer_resized = tracer_white.resize((tw, th), Image.Resampling.LANCZOS)
# Make it subtle tone-on-tone (opacity 75%)
r, g, b, a = tracer_resized.split()
a = a.point(lambda p: int(p * 0.75))
im_cypress.paste(tracer_resized, (790, 520), a)

im_cypress.convert("RGB").save("public/assets/polo_cypress_green.jpg", quality=95)
print("polo_cypress_green.jpg updated!")

# 2. Brand polo_carolina_blue.jpg
print("Processing polo_carolina_blue.jpg...")
im_carolina = Image.open("public/assets/polo_carolina_blue.jpg").convert("RGBA")

# Place High Draw Woven Neck Label
label_carolina = create_woven_label(width=148, height=46, dark=False)
im_carolina.paste(label_carolina, (530, 138), label_carolina)

# Remove chest crown on carolina blue
# Sample surrounding striped fabric pattern or cover with clean white embroidered tracer
draw_car = ImageDraw.Draw(im_carolina)
# Blend over old crown
draw_car.ellipse([750, 590, 845, 645], fill=(138, 178, 204, 255))
box_car = (740, 580, 855, 655)
patch_car = im_carolina.crop(box_car).filter(ImageFilter.GaussianBlur(1.2))
im_carolina.paste(patch_car, box_car)

# Add crisp High Draw white tracer logo on chest
th_car = 52
tw_car = int(tracer_white.width * (th_car / tracer_white.height))
tracer_car_resized = tracer_white.resize((tw_car, th_car), Image.Resampling.LANCZOS)
im_carolina.paste(tracer_car_resized, (785, 588), tracer_car_resized)

im_carolina.convert("RGB").save("public/assets/polo_carolina_blue.jpg", quality=95)
print("polo_carolina_blue.jpg updated!")

# 3. Brand hat_rope_white.png
print("Processing hat_rope_white.png...")
im_hat = Image.open("public/assets/hat_rope_white.png").convert("RGBA")

# Clean over "AL" letters on hat crown
draw_hat = ImageDraw.Draw(im_hat)
# The hat crown fabric is off-white/cream (approx 245, 240, 228)
draw_hat.ellipse([540, 435, 680, 545], fill=(245, 241, 230, 255))
box_hat = (530, 425, 690, 555)
patch_hat = im_hat.crop(box_hat).filter(ImageFilter.GaussianBlur(2.0))
im_hat.paste(patch_hat, box_hat)

# Also clean side strap "AG"
draw_hat.rectangle([140, 565, 195, 625], fill=(235, 230, 218, 255))

# Paste official High Draw black tracer mark on hat crown
tracer_black = Image.open("public/assets/logo_tracer_black.png").convert("RGBA")
th_hat = 110
tw_hat = int(tracer_black.width * (th_hat / tracer_black.height))
tracer_hat_resized = tracer_black.resize((tw_hat, th_hat), Image.Resampling.LANCZOS)

# Deep navy/black embroidery tint
im_hat.paste(tracer_hat_resized, (595, 435), tracer_hat_resized)
im_hat.save("public/assets/hat_rope_white.png")
print("hat_rope_white.png updated!")

# 4. Brand craft_collar_macro.jpg
print("Processing craft_collar_macro.jpg...")
im_macro = Image.open("public/assets/craft_collar_macro.jpg").convert("RGBA")

# Replace "STRAIGHT DOWN" neck label with dark navy woven High Draw label
label_macro = create_woven_label(width=220, height=72, dark=True, is_macro=True)
im_macro.paste(label_macro, (920, 255), label_macro)

# Clean button text by blurring the centers of both buttons
# Button 1 at x: 610, y: 510, radius 45
box_b1 = (565, 465, 655, 555)
btn1 = im_macro.crop(box_b1).filter(ImageFilter.GaussianBlur(4.0))
im_macro.paste(btn1, box_b1)

# Button 2 at x: 375, y: 855, radius 55
box_b2 = (320, 800, 430, 910)
btn2 = im_macro.crop(box_b2).filter(ImageFilter.GaussianBlur(4.0))
im_macro.paste(btn2, box_b2)

im_macro.convert("RGB").save("public/assets/craft_collar_macro.jpg", quality=95)
print("craft_collar_macro.jpg updated!")
