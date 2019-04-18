# Running

`npm run dev`

# Usage

## Create request

POST request to:
`/analyze`

Body format:
```
{ "message": "hello world" }
```

## Check status

GET request to:
`/analyze/1`

## Cancel request

POST request to:
`/analyze/1/cancel`

## Check status (version with 503 errors)

GET request to:
`/analyze-buggy/1`