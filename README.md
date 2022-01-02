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

### 4. Get Token Metadata
This api call grabs the metadata from IPFS and translates the IPFS image into a web address

GET `/api/metadata/:tokenId`

Response:
```json
{
	"name": "Yhado Olhiorc",
	"image": "https://infura-ipfs.io/ipfs/bafybeihv5qxbwj3ypqqzxzdwmjdkqxq2l4xvk5yej3qyorsorpf5tlty6i/explorers/1.png",
	"description": "Goblins are playful creatures with a knack for harmless mischief. They are no stranger to diving into hidden caves and dungeons for Loot and are especially fond of gold and shiny treasures. They belong to the Noctii race, dwellers of the Underworld. Though not much is known about them, they seem to coexist with the rest of the inhabitants in the Explorer realm.\n\nLoot Explorers are 8000 unique explorer characters decked out with gear found in the first 8000 genesis bags of loot. Each Explorer corresponds to the number of the Loot bag. Putting a twist on the classic RPG style with chunky lines and juicy colors, each Explorer's design is influenced by the loot they carry mixed in with elements such as distinct classes & cool backdrops, all attached to uniquely generated name.",
	"attributes": [{
		"trait_type": "Level",
		"value": 1,
		"display_type": "number"
	}, {
		"trait_type": "Background",
		"value": "Sunset Hilltop"
	}, {
		"trait_type": "Race",
		"value": "Noctii"
	}, {
		"trait_type": "Allegiance",
		"value": "Sage"
	}, {
		"trait_type": "Origins",
		"value": "Skeleton"
	}, {
		"trait_type": "Type",
		"value": "Goblin"
	}, {
		"trait_type": "Head",
		"value": "Goblin"
	}, {
		"trait_type": "Face",
		"value": "Cheeky Pout"
	}, {
		"trait_type": "Weapon",
		"value": "Grave Wand"
	}, {
		"trait_type": "Chest Armor",
		"value": "Dark Hard Leather Armor"
	}, {
		"trait_type": "Head Armor",
		"value": "Divine Hood"
	}, {
		"trait_type": "Waist Armor",
		"value": "Hard Leather Belt"
	}, {
		"trait_type": "Foot Armor",
		"value": "Ornate Greaves"
	}, {
		"trait_type": "Hand Armor",
		"value": "Studded Leather Gloves"
	}, {
		"trait_type": "Necklace",
		"value": "Necklace of Enlightenment"
	}, {
		"trait_type": "Ring",
		"value": "Gold Ring"
	}]
}
```

# Usage

Usage is being sponsored by @geggleto via ChainHeadsInc
This service is deployed at `https://loot-explorers.chainheadsinc.com/`
Example: `https://loot-explorers.chainheadsinc.com/api/tokens/205368063820955648`