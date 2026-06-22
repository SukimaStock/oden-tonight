# 今夜のおでん / ODEN TONIGHT

Canvas API と Codea Lite for Web を使った、灯串横丁のおでん屋台ミニ経営ゲームです。

## Repository structure

```text
oden-tonight/
├─ index.html
├─ style.css
├─ sketch.js
└─ engine/
   └─ codea-lite.js
```

GitHub Repository の直下へ、このZIPの中身をそのまま配置してください。

## GitHub Pages

GitHub Pages の公開元を `main` ブランチの `/(root)` に設定すると、リポジトリのトップページとしてゲームを公開できます。

## Local test

ローカル確認では、リポジトリ直下で次を実行します。

```bash
python3 -m http.server 8000
```

その後、`http://localhost:8000/` を開いてください。
