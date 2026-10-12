# Device portrait assets

Selected visual reference: `concepts/05-device-portrait-reference.png`, supplied by the user. The homepage follows its light background, large exploded product on the left, condensed model name and three hardware columns on the right.

All six transparent PNG illustrations in `public/devices/` were generated with the built-in ImageGen tool, based on the supplied reference's composition. They are illustrative product-family art, not photographs or verified service diagrams. UI text, specifications, buttons and layout are live React, not baked into the image.

| File | Selection | Art direction used |
| --- | --- | --- |
| asus-tuf.png | Detected ASUS TUF laptop | Graphite ASUS TUF laptop, exploded lid, cooling assembly, motherboard, memory and bottom plate; three-quarter view; studio lighting; transparent background; no specification labels. |
| lenovo-legion.png | Detected Lenovo Legion laptop | Dark Legion laptop with restrained lid branding, aligned exploded layers and dual-fan internals; same camera and studio lighting. |
| hp-laptop.png | Detected HP Pavilion/Envy laptop | Silver HP everyday laptop, separated lid, keyboard, board, battery and base; same camera and transparent studio treatment. |
| gaming-laptop.png | Other detected gaming laptop | Unbranded graphite gaming laptop with powerful dual-fan internal assembly, exploded layers, no vendor claim. |
| ultrabook.png | Other laptop | Slim unbranded silver laptop, exploded lid, keyboard, board and base, transparent background. |
| desktop.png | Desktop computer | Unbranded graphite tower, removed top and side panels, motherboard, GPU and power supply in a coherent exploded product composition. |

Selection code: `src/device-visual.mjs`. Explicit desktop form factor takes precedence over ambiguous model words. Unknown laptop families use the unbranded fallback. The product caption always distinguishes illustrative art from actual system information. Hardware information remains local and is not transmitted to an image or model lookup service.

Actual-device check: ASUS TUF Gaming A16 FA607NUG, AMD Ryzen 7 7445HS (6 cores / 12 threads), NVIDIA RTX 4050, 16 GB physical DDR5. No fictional VRAM is inferred from Win32_VideoController's limited AdapterRAM field.

## Version 2.1 additions

Tool: built-in ImageGen. Mode: new generation, transparent_background=true. Each image is a standalone transparent PNG in `public/devices/`.

Shared prompt direction: premium photorealistic exploded product illustration, centered portrait composition, front-left three-quarter view, separated coherent layers, neutral studio lighting, true transparent background, no text labels or specification claims. These are product-family illustrations, not verified teardown diagrams.

| File | Individual prompt direction |
| --- | --- |
| asus-rog.png | Black angular ROG Strix gaming laptop, restrained ROG lid emblem, RGB keyboard, dual cooling fans, floating aligned lid and internal layers. |
| lenovo-thinkpad.png | Black ThinkPad business laptop with red TrackPoint, restrained lid marking, single-fan compact internals, separated lid, keyboard, motherboard, battery and base. |
| lenovo-loq.png | Gray Lenovo LOQ gaming laptop, LOQ lid marking, extended rear thermal shelf, dual-fan assembly and exploded internal layers. |
| desktop-white.png | White gaming tower, white cooling fans, glass side panel separated from case, visible motherboard and graphics card. |
| mini-pc.png | Small graphite mini PC, compact chassis, exposed motherboard and low-profile cooling fan with floating cover. |

ASUS ROG, Lenovo LOQ and ThinkPad are detected as distinct families. Mini PC form factors have a distinct fallback. White desktop is a manual appearance choice, because chassis color cannot be inferred reliably from hardware inventory. All eleven illustrations can be selected manually from settings without changing detected model or specifications.

## Version 2.2 exact model photo

`public/devices/asus-fa607nug-official.png` is the official ASUS product image associated specifically with FA607NUG on its technical specifications page. It is selected only for detected ASUS FA607NUG and automatic artwork selection. The homepage lets the user switch between this verified exterior photo and the existing illustrative exploded view. It does not claim the generated internals are an exact teardown.

- Model/source page: https://www.asus.com/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-a16-2024/techspec/
- Image source: https://dlcdnwebimgs.asus.com/gain/e1e466ef-a9fa-48ff-b740-71ad3966a695/w1000
- An additional sourced FA607 series lid image is stored as `public/devices/asus-tuf-a16-fa607.png`; it is not used as a claimed exact model photo.
- ASUS retains ownership of these vendor images. Other device families retain labeled illustrative fallbacks. No hardware identity is sent to a remote lookup service.
