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
        
        await fetch("https://dymension-rest.publicnode.com/dymensionxyz/dymension/gamm/v2/pools/13/prices?quote_asset_denom=adym&base_asset_denom=ibc/5A26C8DC8DA66F4DD94326E67F94510188F5F7AFE2DB3933A0C823670E56EABF")
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
