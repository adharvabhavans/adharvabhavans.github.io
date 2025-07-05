This document aims to track which js modules import each other,
to prevent dependency hell. Please update it if you change the `import`s of files.

```
constants:

labels/
    constants:
    index: labels/constants

mobile: constants
camera:     constants
lighting:   constants
movement:   constants
sky:        constants
ui:         constants

map:        ui
            labels/constants
            labels/index
            mobile
```