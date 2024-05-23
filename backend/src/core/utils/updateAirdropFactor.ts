import config from '@config/config';
import {
  create
} from '@components/airdropFactor/airdropFactor.service';
import { IAirdropFactor } from '@components/airdropFactor/airdropFactor.interface';


class AirdropFactor {
  public async update() {
    try {
        console.log("Updating airdrop factor");
        // fetch price using spot-price query from dymension
        let dymPrice, usdPrice;
        await fetch("https://dymension-rest.publicnode.com/dymensionxyz/dymension/gamm/v2/pools/2/prices?base_asset_denom=adym&quote_asset_denom=ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4")
            .then(data => data.json())
            .then(data => {
                dymPrice = parseFloat(data.spot_price)*1e12;
            })
        
        await fetch("https://dymension-rest.publicnode.com/dymensionxyz/dymension/gamm/v2/pools/12/prices?quote_asset_denom=adym&base_asset_denom=ibc/FB53D1684F155CBB86D9CE917807E42B59209EBE3AD3A92E15EF66586C073942")
            .then(data => data.json())
            .then(data => {
                usdPrice = parseFloat(data.spot_price) * dymPrice;
            })
        const n = config.k * usdPrice;
        const airdropFactorRecord = {
            k: config.k,
            price: usdPrice,
            n
        }
        await create(airdropFactorRecord as IAirdropFactor);
        console.log("Updated airdrop factor");
    } catch (error) {
        console.log(error);
    }
  }
}

export default new AirdropFactor();
