;;; tide_pool-theme.el --- Prism Tide Pool theme -*- lexical-binding: t; -*-
;;; Commentary:
;; Prism Tide Pool color theme - Auto-generated from vscode/themes
;;; Code:

(deftheme tide_pool
  "Prism Tide Pool - A #e0f0f8 theme.")

(let ((class '((class color) (min-colors 89)))
      (bg "#06090c")
      (fg "#e0f0f8")
      (hl "#0c1218")
      (comment "#485560")
      (keyword "#40e0d0")
      (string "#79e9de")
      (func "#6fe7db")
      (type "#e0f0f8")
      (variable "#e0f0f8")
      (constant "#66e6d9"))

  (custom-theme-set-faces
   'tide_pool
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

(provide-theme 'tide_pool)
;;; tide_pool-theme.el ends here
