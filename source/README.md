# Running This challenge

Build
```
docker build -t athack-ctf/chall2025-insecure-by-design:latest .
```

Run
```
docker run -d --name insecure-by-design \
  --hostname insecure-by-design \
  -p 52045:2025 \
  --memory 300m \
  --cpus 0.12 \
  athack-ctf/chall2025-insecure-by-design:latest
```
