import os
import zipfile

def create_zip_files():
    # 1. Full web + android source package
    full_zip_name = "NetControlMobile-FullSource.zip"
    exclude_dirs = {"node_modules", ".git", "dist", ".vite", "__pycache__"}

    with zipfile.ZipFile(full_zip_name, 'w', zipfile.ZIP_DEFLATED) as ziph:
        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file.endswith('.zip') or file.endswith('.pyc') or file == 'create_zip.py':
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, '.')
                ziph.write(file_path, arcname)

    print(f"Archive 1 created: {full_zip_name} ({os.path.getsize(full_zip_name)} bytes)")

    # 2. Android Studio Project direct zip
    android_zip_name = "NetControlMobile-AndroidStudio-Project.zip"
    if os.path.exists('android-project'):
        with zipfile.ZipFile(android_zip_name, 'w', zipfile.ZIP_DEFLATED) as ziph:
            for root, dirs, files in os.walk('android-project'):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, 'android-project')
                    ziph.write(file_path, arcname)
        print(f"Archive 2 created: {android_zip_name} ({os.path.getsize(android_zip_name)} bytes)")

if __name__ == "__main__":
    create_zip_files()
