# Loot Explorer Dungeon - Token Verifier

# Prerequisites
1. MongoDB
2. Infura.io key or other web3 provider
3. .env file

# Example .env
```dotenv
METAMASK_URL=
MONGO_URL=
PORT=
```

# API

### 1. Create Verification Request

POST `/api/token`

Request:
```json
{
  "discord_id": <discord_id|int>
}
```

Response:
```json
{
  _id : r.insertedId
}
```

### 2. Send Verification Link

GET `/verify/:_id`

This returns an HTML page

### 3. Query Token Status

GET `/api/tokens/:discord_id`

Response:
```json
[
  {"_id":"61d0de9b3e6bc936ad5c2222","tokenId":2394,"discord_id":205368063820955650,"owner":"0xCECDDbE88359f6EcEBE90b42643B002543F27fE9"},
  {"_id":"61d0de9b3e6bc936ad5c2249","tokenId":2395,"discord_id":205368063820955650,"owner":"0xCECDDbE88359f6EcEBE90b42643B002543F27fE9"}
]
```

# Usage

Usage is being sponsored by @geggleto via ChainHeadsInc
This service is deployed at `https://loot-explorers.chainheadsinc.com/`
Example: `https://loot-explorers.chainheadsinc.com/api/tokens/205368063820955648`