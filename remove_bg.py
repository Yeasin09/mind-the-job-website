from PIL import Image
import sys
import os

def remove_white_bg(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Successfully saved transparent logo.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Hardcoded paths based on the context
    input_p = r"d:\Rossi Mama Website\Mind the Job\public\logo.png"
    # We overwrite it or save as new. Let's overwrite to avoid code changes if possible, or save new.
    # Saving as new is safer to avoid destroying the original if logic is bad.
    output_p = r"d:\Rossi Mama Website\Mind the Job\public\logo-transparent.png"
    
    # Check if PIL is installed
    try:
        import PIL
        remove_white_bg(input_p, output_p)
    except ImportError:
        print("Pillow not installed. Please install it with: pip install Pillow")
