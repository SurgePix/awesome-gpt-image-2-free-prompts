# GPT Image 2 Usage Guide

## Table of Contents

- [Quick Start](#quick-start)
- [Prompt Anatomy](#prompt-anatomy)
- [Advanced Techniques](#advanced-techniques)
- [Variable Templates](#variable-templates)
- [Batch Generation](#batch-generation)
- [Contributing Translations](#contributing-translations)

---

## Quick Start

Every prompt in this library follows a consistent structure you can immediately copy and modify:

```
[SUBJECT] + [STYLE/MEDIUM] + [LIGHTING] + [CAMERA/LENS] + [MOOD] + [TECHNICAL DETAILS]
```

Example breakdown:
```
Ultra-realistic portrait of a barista         ← SUBJECT
in the style of cinematic photography          ← STYLE
golden hour window light from the left         ← LIGHTING
shot on Leica Q2, 28mm f/1.7                  ← CAMERA
warm, intimate, slightly melancholic           ← MOOD
shallow depth of field, film grain            ← TECHNICAL
```

---

## Prompt Anatomy

### Subject Modifiers
- **Count**: `a single`, `three`, `a crowd of`
- **Age/gender**: `elderly woman`, `teenage boy`, `non-binary person`
- **Action**: `laughing`, `mid-stride`, `caught off guard`

### Style Keywords That Work Well
| Style | Keywords |
|-------|----------|
| Photorealism | `photorealistic`, `shot on [camera]`, `RAW photo` |
| Cinematic | `cinematic still`, `movie frame`, `anamorphic lens` |
| Editorial | `Vogue editorial`, `magazine spread`, `fashion photography` |
| Product | `product photography`, `studio lighting`, `white seamless` |

### Lighting Reference
- `golden hour`, `blue hour`, `overcast diffused`
- `neon backlit`, `fluorescent overhead`, `candlelit`
- `Rembrandt lighting`, `split lighting`, `butterfly lighting`

---

## Advanced Techniques

### 1. Style Transfer via Reference Description
Instead of saying "make it look like [artist]", describe the visual characteristics:

❌ `in the style of Monet`  
✅ `loose brushwork with visible paint texture, dappled light broken into fragments of color, impressionist palette of lavender, gold, and teal`

### 2. Negative Space Control
```
[subject] on the left third, large negative space on the right, 
minimal background, no distracting elements
```

### 3. Text-in-Image (Typography)
GPT Image 2 excels at this. Key tips:
- Specify font style explicitly: `bold sans-serif`, `elegant serif`, `handwritten`
- Specify exact text: `with the exact text "YOUR TEXT HERE"`
- Specify position: `text centered`, `top-left corner`, `lower third`

### 4. Consistency Across Images
For character/product consistency, always include:
```
[character description]. Keep the same face, hair, and clothing 
as previously described. [new scene/action].
```

---

## Variable Templates

Copy these templates and fill in the `[VARIABLES]`:

### Portrait Template
```
[ADJECTIVE] portrait of a [AGE] [GENDER] [ETHNICITY], [EXPRESSION],
wearing [CLOTHING], in [SETTING]. Shot on [CAMERA], [LENS] lens, [LIGHTING].
[MOOD] atmosphere. [TECHNICAL DETAIL].
```

### Product Template
```
Professional product photography of [PRODUCT NAME], [COLOR/MATERIAL],
on [SURFACE/BACKGROUND]. [LIGHTING SETUP]. [ANGLE] angle.
Clean, commercial-grade output. [BRAND VIBE] aesthetic.
```

### Scene Template
```
[TIME OF DAY], [WEATHER], [LOCATION TYPE]. [NUMBER] [PEOPLE/OBJECTS] [ACTION].
[CAMERA POSITION] shot. [LENS] focal length. [COLOR GRADE] color grading.
[MOOD] mood. Photorealistic, ultra-detailed.
```

---

## Batch Generation

When generating multiple images with the API, use this pattern to maintain consistency:

```python
base_style = "cinematic photography, anamorphic lens, teal and orange color grade"
subjects = ["a chef in a busy kitchen", "a musician on an empty stage", "a runner at dawn"]

prompts = [f"{subject}, {base_style}" for subject in subjects]
```

---

## Contributing Translations

To add a new language README:

1. Copy `README.md` to `README_[lang].md` (e.g., `README_ko.md`)
2. Translate all user-facing text
3. Keep all code blocks, links, and file paths unchanged
4. Submit a PR with the title `[i18n] Add [Language] translation`
