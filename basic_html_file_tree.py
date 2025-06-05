"""
/!\/!\/!\
make sure you don't have a directory
named 'src' in this directory.

if you have one but empty this is fine.
/!\/!\/!\
"""

import os

dirs = [
    "src",
    "src/templates",
    "src/static",
    "src/static/css",
    "src/static/js",
    "src/static/img",
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

files = {
    "src/templates/index.html":
"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel="stylesheet" href="../static/css/index.css">
</head>
<body>
    
</body>
</html>""",
    "src/static/css/index.css": "",
}

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)