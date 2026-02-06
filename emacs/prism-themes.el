;;; prism-themes.el --- 64 formally verified color themes -*- lexical-binding: t; -*-

;; Copyright (C) 2026 Omega Agentic

;; Author: j-pyxal
;; Maintainer: Omega Agentic <themes@omega.ms>
;; Version: 2.0.0
;; Package-Requires: ((emacs "27.1"))
;; Keywords: faces, themes
;; URL: https://github.com/justinfleek/PRISM
;; SPDX-License-Identifier: MIT

;;; Commentary:

;; Prism is a collection of 64 formally verified color themes built with
;; OKLCH color science for perceptual uniformity and WCAG AA compliance.
;;
;; All themes use a monochromatic 211° hue shift semantic type system.
;;
;; Usage:
;;   (require 'prism-themes)
;;   (load-theme 'acid_rain t)
;;
;; Or interactively:
;;   M-x prism-themes-load

;;; Code:

(defgroup prism-themes nil
  "Prism color themes."
  :group 'faces
  :prefix "prism-")

;;;###autoload
(when (and (boundp 'custom-theme-load-path) load-file-name)
  (let ((dir (file-name-as-directory
              (file-name-directory load-file-name))))
    (add-to-list 'custom-theme-load-path dir)
    (add-to-list 'custom-theme-load-path (concat dir "themes"))))

(defconst prism-themes-list
  '(acid_rain
    arctic
    aurora_glass
    ayu_mirage
    biopic
    blood_moon
    catppuccin_mocha
    champagne_noir
    coastal
    cobalt2
    constellation_map
    cyber_noir
    diamond_dust
    dracula_pro
    ember_hearth
    emerald_velvet
    faded_glory
    fleek
    fleek_gold
    fleek_gradient
    fleek_light
    forest
    forest_canopy
    ghost
    github
    grape
    gruvbox_material
    holographic
    inferno
    lavender_dusk
    memphis
    midnight_sapphire
    minimal
    mint
    moonlight_ii
    neoform
    neon_nexus
    nero_marquina
    night_owl
    nord_aurora
    obsidian_rose_gold
    ocean
    ocean_depths
    one_dark_pro
    palenight
    porcelain_moon
    rose
    rose_gold
    rose_pine
    slate_and_gold
    soft_charcoal
    sunset
    synthwave
    synthwave_84
    tessier
    tide_pool
    tokyo_night_bento
    tropical
    tuned
    ultraviolet
    vaporwave
    vaporwave_sunset
    vesper
    zen_garden)
  "List of all 64 Prism themes.")

;;;###autoload
(defun prism-themes-load (theme)
  "Load a Prism THEME by name."
  (interactive
   (list (intern (completing-read "Load Prism theme: "
                                  (mapcar #'symbol-name prism-themes-list)
                                  nil t))))
  (load-theme theme t))

(provide 'prism-themes)

;;; prism-themes.el ends here
