import { NFTStorage, File } from 'nft.storage'
require('dotenv').config();

const client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRFM2RBNjBiNjcxMDYxNGYzMjVFMGYyOUJiMTFFMzg2MWRlNzI4ZkQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0ODEwOTM1NzAxNCwibmFtZSI6ImxlbnMtaGFjayJ9.vw-HDVaJbS5QxXlfwSmZMb4XWCHy48TSsjHTli-a7PY" })

export async function main(_name, _description, _nftImg, _trait1, _trai1Value, _trait2, _trait2Value) {
  const metadata = await client.store({
    name: `${_name}`,
    description: `${_description}`,
    image: new File(
      [
        /* data */
        _nftImg,
      ],
      `${_name}.jpg`,
      { type: 'image/jpg' }
    ),
    attributes: [
        {
          trait_type: `${_trait1}`,
          value: `${_trai1Value}`
        },
        {
          trait_type: `${_trait2}`,
          value: `${_trait2Value}`
        }
    ]
  })

  console.log(metadata.url)
  // ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json
  return metadata.url;
}

// main()