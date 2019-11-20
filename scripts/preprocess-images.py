from PIL import Image
import PIL.ImageOps
from os import path, listdir
import os
from pathlib import Path
from os.path import isfile, join

original_dir = 'original'
inverted_dir = 'inverted'
rotated_dir = 'rotated'
resized_dir = 'resized'
mirrored_dir = 'mirrored'
grayscaled_dir = 'gray-scaled'

curr_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = Path(curr_dir).parent
images_dir = path.join(parent_dir, 'media','images')
target_dirs = [ path.join(images_dir,target_dir_name) for target_dir_name in [original_dir, inverted_dir, rotated_dir, resized_dir, mirrored_dir, grayscaled_dir] ] 

for target_dir in target_dirs:
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

def watermark_with_transparency(input_image_path, output_image_path):
    base_image = Image.open(input_image_path)
    width, height = base_image.size
    transparent = Image.new('RGB', (width - 20, height - 20), (0,0,0,0))
    transparent.paste(base_image, (0,0))
    transparent.save(output_image_path)

def resize_image(image_name, image_path):
    image = Image.open(image_path)
    target = path.join(images_dir, resized_dir, image_name)
    width, height = image.size 
    image = image.resize((int(width/2), int(height/2))) 
    image.save(target)

def mirror_image(image_name, image_path):
    image = Image.open(image_path)
    target = path.join(images_dir, mirrored_dir, image_name)
    transposed_image = image.transpose(Image.FLIP_LEFT_RIGHT) 
    transposed_image.save(target)

def gray_scale_image(image_name, image_path):
    image = Image.open(image_path)
    target = path.join(images_dir, grayscaled_dir, image_name)
    greyscale_image = image.convert('L')
    greyscale_image.save(target)


def clear_exif_data(image_path):
    image = Image.open(image_path)
    data = list(image.getdata())
    image_without_exif = Image.new(image.mode, image.size)
    image_without_exif.putdata(data)
    image_without_exif.save(image_path)

def backup_image(image_name, image_path): 
    target = path.join(images_dir, original_dir, image_name)
    image = Image.open(image_path)
    image.save(target)

def rotate_image(image_name, image_path):
    target = path.join(images_dir, rotated_dir, image_name)
    image = Image.open(image_path)
    image_rotated = image.rotate(90, expand=True)
    image_rotated.save(target)

def modify_image(image_name):
    image_path = path.join(images_dir, image)
    backup_image(image_name, image_path)
    clear_exif_data(image_path)
    invert_colors(image_name, image_path)
    rotate_image(image_name, image_path)
    resize_image(image_name, image_path)
    mirror_image(image_name, image_path)
    gray_scale_image(image_name, image_path)

def invert_colors(image_name, image_path):
    target = path.join(images_dir, inverted_dir, image_name)
    image = Image.open(image_path)
    if image.mode == 'RGBA':
        r,g,b,a = image.split()
        rgb_image = Image.merge('RGB', (r,g,b))
        inverted_image = PIL.ImageOps.invert(rgb_image)
        r2,g2,b2 = inverted_image.split()
        final_transparent_image = Image.merge('RGBA', (r2,g2,b2,a))
        final_transparent_image.save(target)
    else:

        inverted_image = PIL.ImageOps.invert(image)
        inverted_image.save(target)

if __name__ == '__main__':
    images = [f for f in listdir(images_dir) if isfile(join(images_dir, f))]
    for image in images:
        modify_image(image)