"Please read http://stevelosh.com/blog/2010/09/coming-home-to-vim/ for more
"detail

"don't compatible with previous versions
set nocompatible
"auto indention, follow same rule as previous line
set ai
"auto write to buffer when switching to shell
set aw
"show line number at the left side of window
set number
"highlight pair parenthesis/square parenthesis
set showmatch
"hightlight current mode when in edit mode
set showmode
"show command name currently executing, non-finished also included
set showcmd
"search back to the beginning of a file when reaching the end of that file
set ws
"wrap with long lines
set wrap
"show status ruler
set ruler
"window starts to scroll when cursor is five lines near the border
set scrolloff=5
"move four characters for << and >>
set shiftwidth=4
"remove four spaces when backspacing or remove all when there are less than four spaces
set softtabstop=4
"set increamental search
set incsearch
"highlight all matching phrases
set hlsearch
"case sensitive when searching
set noic

set encoding=utf-8
set scrolloff=3
set autoindent
set showmode
set showcmd
set hidden
set wildmenu
set wildmode=list:longest
set visualbell
set cursorline
set ttyfast
set ruler
set backspace=indent,eol,start
set laststatus=2
set relativenumber
set undofile

"add a color bar at column 85, so that you know it is a long line
set wrap
set textwidth=79
set formatoptions=qrn1
set colorcolumn=85

"disable arrow keys when in normal mode
"also disable arrow keys when in insert mode, you need to switch to normal mode
"if want to move between lines
nnoremap <up> <nop>
nnoremap <down> <nop>
nnoremap <left> <nop>
nnoremap <right> <nop>
inoremap <up> <nop>
inoremap <down> <nop>
inoremap <left> <nop>
inoremap <right> <nop>
nnoremap j gj
nnoremap k gk

"save file when losing focus. That happens when switching to another tab
au FocusLost * :wa

"map jj to ESC
inoremap jj <ESC>
"map kk to <ESC>:
inoremap kk <ESC>:

"enable syntax and highlight syntax
syntax enable
syntax on

"enable clipboard between multiple vims
vmap y :w !pbcopy<CR><CR>
nmap yy :.w !pbcopy<CR><CR>
nmap p :r !pbpaste<CR><CR>

"display tab and space characters
set list
set listchars=tab:>-,trail:-

"nerd tree view
map <F7> :NERDTreeToggle<CR>
imap <F7> <ESC>:NERDTreeToggle<CR>

"powerline
set guifont=Meslo\ LG\ L\ Regular\ for\ Powerline
set nocompatible
set t_Co=256
"let g:Powerline_symbols = 'fancy'
set fillchars+=stl:\ ,stlnc:\

"plugin management
execute pathogen#infect()
filetype plugin indent on
"}
