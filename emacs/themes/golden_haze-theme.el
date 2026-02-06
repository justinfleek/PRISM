;;; golden_haze-theme.el --- Prism Golden Haze theme -*- lexical-binding: t; -*-
;;; Commentary:
;; Prism Golden Haze color theme - Auto-generated from vscode/themes
;;; Code:

(deftheme golden_haze
  "Prism Golden Haze - A #1a1c20 theme.")

(let ((class '((class color) (min-colors 89)))
      (bg "#e8eaee")
      (fg "#1a1c20")
      (hl "#e8eaee")
      (comment "#585048")
      (keyword "#ca8a04")
      (string "#888070")
      (func "#e8b840")
      (type "#1a1c20")
      (variable "#1a1c20")
      (constant "#906000"))

  (custom-theme-set-faces
   'golden_haze
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

(provide-theme 'golden_haze)
;;; golden_haze-theme.el ends here
