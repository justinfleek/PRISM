;;; catppuccin_mocha-theme.el --- Prism Catppuccin Mocha theme -*- lexical-binding: t; -*-
;;; Commentary:
;; Prism Catppuccin Mocha color theme - Auto-generated from vscode/themes
;;; Code:

(deftheme catppuccin_mocha
  "Prism Catppuccin Mocha - A #f9e2af theme.")

(let ((class '((class color) (min-colors 89)))
      (bg "#1e1e2e")
      (fg "#fab387")
      (hl "#28283d")
      (comment "#6c6c7e")
      (keyword "#cba6f7")
      (string "#a6e3a1")
      (func "#89b4fa")
      (type "#f9e2af")
      (variable "#cdd6f4")
      (constant "#fab387"))

  (custom-theme-set-faces
   'catppuccin_mocha
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

(provide-theme 'catppuccin_mocha)
;;; catppuccin_mocha-theme.el ends here
