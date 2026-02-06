;;; acid_rain-theme.el --- Prism Acid Rain theme -*- lexical-binding: t; -*-
;;; Commentary:
;; Prism Acid Rain color theme - Auto-generated from vscode/themes
;;; Code:

(deftheme acid_rain
  "Prism Acid Rain - A #ffc0d8 theme.")

(let ((class '((class color) (min-colors 89)))
      (bg "#0d1117")
      (fg "#bc8cff")
      (hl "#161b22")
      (comment "#6e7681")
      (keyword "#ff7eb6")
      (string "#7ee787")
      (func "#58a6ff")
      (type "#ffc0d8")
      (variable "#c9d1d9")
      (constant "#8b949e"))

  (custom-theme-set-faces
   'acid_rain
   `(default ((,class (:background ,bg :foreground ,fg))))
   `(cursor ((,class (:background ,keyword))))
   `(region ((,class (:background ,hl))))
   `(highlight ((,class (:background ,hl))))
   `(hl-line ((,class (:background ,hl))))
   `(fringe ((,class (:background ,bg))))
   `(line-number ((,class (:foreground ,comment))))
   `(line-number-current-line ((,class (:foreground ,fg))))
   `(font-lock-comment-face ((,class (:foreground ,comment :slant italic))))
   `(font-lock-keyword-face ((,class (:foreground ,keyword))))
   `(font-lock-string-face ((,class (:foreground ,string))))
   `(font-lock-function-name-face ((,class (:foreground ,func))))
   `(font-lock-variable-name-face ((,class (:foreground ,variable))))
   `(font-lock-type-face ((,class (:foreground ,type))))
   `(font-lock-constant-face ((,class (:foreground ,constant))))
   `(font-lock-builtin-face ((,class (:foreground ,keyword))))
   `(font-lock-preprocessor-face ((,class (:foreground ,keyword))))
   `(mode-line ((,class (:background ,hl :foreground ,fg))))
   `(mode-line-inactive ((,class (:background ,bg :foreground ,comment))))
   ;; Markdown/Org headings
   `(markdown-header-face-1 ((,class (:foreground ,keyword :weight bold))))
   `(markdown-header-face-2 ((,class (:foreground ,string :weight bold))))
   `(markdown-header-face-3 ((,class (:foreground ,func :weight bold))))
   `(markdown-bold-face ((,class (:foreground ,keyword :weight bold))))
   `(markdown-italic-face ((,class (:foreground ,string :slant italic))))
   `(org-level-1 ((,class (:foreground ,keyword :weight bold))))
   `(org-level-2 ((,class (:foreground ,string :weight bold))))
   `(org-level-3 ((,class (:foreground ,func :weight bold))))))

;;;###autoload
(when load-file-name
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory (file-name-directory load-file-name))))

(provide-theme 'acid_rain)
;;; acid_rain-theme.el ends here
